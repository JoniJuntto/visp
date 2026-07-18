import type { ChatFragment, ChatMessage } from "./contract";

const MAX_FRAGMENTS = 32;
const MAX_MESSAGE_LENGTH = 500;
const MAX_NAME_LENGTH = 64;
const COLOR = /^#[0-9a-f]{6}$/i;

function string(value: unknown, max: number) {
	return typeof value === "string" ? value.slice(0, max) : "";
}

function identifier(value: unknown, max = 160) {
	return typeof value === "string" || typeof value === "number"
		? String(value).slice(0, max)
		: "";
}

function date(value: unknown) {
	const parsed = typeof value === "string" ? new Date(value) : new Date();
	return Number.isNaN(parsed.getTime())
		? new Date().toISOString()
		: parsed.toISOString();
}

function color(value: unknown) {
	return typeof value === "string" && COLOR.test(value)
		? value.toUpperCase()
		: undefined;
}

function finish(
	message: Omit<ChatMessage, "fragments"> & { fragments: ChatFragment[] },
): ChatMessage | null {
	let remaining = MAX_MESSAGE_LENGTH;
	const fragments: ChatFragment[] = [];
	for (const fragment of message.fragments.slice(0, MAX_FRAGMENTS)) {
		if (remaining <= 0) break;
		const text = fragment.text.slice(0, remaining);
		if (!text) continue;
		remaining -= text.length;
		fragments.push(
			fragment.type === "text" ? { type: "text", text } : { ...fragment, text },
		);
	}
	if (
		!message.id ||
		!message.sender.id ||
		!message.sender.name ||
		fragments.length === 0
	) {
		return null;
	}
	return { ...message, fragments };
}

export function twitchEmoteUrl(id: string) {
	return `https://static-cdn.jtvnw.net/emoticons/v2/${encodeURIComponent(id)}/static/dark/1.0`;
}

export function kickEmoteUrl(id: string) {
	return `https://files.kick.com/emotes/${encodeURIComponent(id)}/fullsize`;
}

export function normalizeTwitchMessage(payload: unknown): ChatMessage | null {
	if (!payload || typeof payload !== "object") return null;
	const event = payload as Record<string, unknown>;
	const message = event.message as { fragments?: unknown[] } | undefined;
	const fragments = (message?.fragments ?? []).flatMap<ChatFragment>((raw) => {
		if (!raw || typeof raw !== "object") return [];
		const fragment = raw as {
			emote?: { id?: unknown } | null;
			text?: unknown;
			type?: unknown;
		};
		const text = string(fragment.text, MAX_MESSAGE_LENGTH);
		const emoteId = string(fragment.emote?.id, 128);
		if (fragment.type === "emote" && emoteId) {
			return [{ type: "emote", text, url: twitchEmoteUrl(emoteId) }];
		}
		return text ? [{ type: "text", text }] : [];
	});
	return finish({
		id: identifier(event.message_id),
		provider: "twitch",
		sentAt: date(event.sent_at),
		sender: {
			id: identifier(event.chatter_user_id, 128),
			name: string(
				event.chatter_user_name ?? event.chatter_user_login,
				MAX_NAME_LENGTH,
			),
			color: color(event.color),
		},
		fragments,
	});
}

type KickPosition = { e?: unknown; s?: unknown };
type KickEmote = { emote_id?: unknown; positions?: KickPosition[] };

export function normalizeKickMessage(payload: unknown): ChatMessage | null {
	if (!payload || typeof payload !== "object") return null;
	const event = payload as Record<string, unknown>;
	const sender = (event.sender ?? {}) as Record<string, unknown>;
	const identity = (sender.identity ?? {}) as Record<string, unknown>;
	const content = string(event.content, MAX_MESSAGE_LENGTH);
	const positions = ((event.emotes as KickEmote[] | undefined) ?? [])
		.flatMap((emote) => {
			const id = string(emote.emote_id, 128);
			return (emote.positions ?? []).map((position) => ({
				id,
				start: Number(position.s),
				end: Number(position.e),
			}));
		})
		.filter(
			({ id, start, end }) =>
				id && Number.isInteger(start) && Number.isInteger(end),
		)
		.sort((a, b) => a.start - b.start)
		.slice(0, MAX_FRAGMENTS);

	const fragments: ChatFragment[] = [];
	let cursor = 0;
	for (const position of positions) {
		if (
			position.start < cursor ||
			position.start < 0 ||
			position.end < position.start ||
			position.end >= content.length
		)
			continue;
		if (position.start > cursor)
			fragments.push({
				type: "text",
				text: content.slice(cursor, position.start),
			});
		const token = content.slice(position.start, position.end + 1);
		const name = token.match(/^\[emote:[^:]+:(.+)]$/)?.[1] ?? token;
		fragments.push({
			type: "emote",
			text: name,
			url: kickEmoteUrl(position.id),
		});
		cursor = position.end + 1;
	}
	if (cursor < content.length)
		fragments.push({ type: "text", text: content.slice(cursor) });

	return finish({
		id: identifier(event.message_id),
		provider: "kick",
		sentAt: date(event.created_at),
		sender: {
			id: identifier(sender.user_id, 128),
			name: string(sender.username, MAX_NAME_LENGTH),
			color: color(identity.username_color),
		},
		fragments,
	});
}
