import { describe, expect, test } from "bun:test";
import {
	kickEmoteUrl,
	normalizeKickMessage,
	normalizeTwitchMessage,
	twitchEmoteUrl,
} from "./normalize";

describe("chat normalization", () => {
	test("normalizes Twitch fragments and rejects invalid colors", () => {
		const message = normalizeTwitchMessage({
			message_id: "m1",
			chatter_user_id: "u1",
			chatter_user_name: "Alice",
			color: "red",
			message: {
				fragments: [
					{ type: "text", text: "hi " },
					{ type: "emote", text: "Kappa", emote: { id: "25" } },
				],
			},
		});
		expect(message?.sender.color).toBeUndefined();
		expect(message?.fragments).toEqual([
			{ type: "text", text: "hi " },
			{ type: "emote", text: "Kappa", url: twitchEmoteUrl("25") },
		]);
	});

	test("orders Kick positions and preserves emote fallback names", () => {
		const content = "Hi [emote:2:Wave] and [emote:1:Clap]";
		const message = normalizeKickMessage({
			message_id: "m2",
			created_at: "2026-01-01T00:00:00Z",
			content,
			sender: {
				user_id: 7,
				username: "Bob",
				identity: { username_color: "#aabbcc" },
			},
			emotes: [
				{ emote_id: "1", positions: [{ s: 22, e: 35 }] },
				{ emote_id: "2", positions: [{ s: 3, e: 16 }] },
			],
		});
		expect(message?.sender.color).toBe("#AABBCC");
		expect(message?.fragments).toEqual([
			{ type: "text", text: "Hi " },
			{ type: "emote", text: "Wave", url: kickEmoteUrl("2") },
			{ type: "text", text: " and " },
			{ type: "emote", text: "Clap", url: kickEmoteUrl("1") },
		]);
	});

	test("clamps provider-controlled fragments and total message length", () => {
		const message = normalizeTwitchMessage({
			message_id: "bounded",
			chatter_user_id: "viewer",
			chatter_user_name: "Viewer",
			color: "#12345",
			message: {
				fragments: Array.from({ length: 40 }, () => ({
					text: "x".repeat(30),
					type: "text",
				})),
			},
		});
		expect(message?.sender.color).toBeUndefined();
		expect(message?.fragments.length).toBeLessThanOrEqual(32);
		expect(
			message?.fragments.reduce(
				(length, fragment) => length + fragment.text.length,
				0,
			),
		).toBe(500);
	});
});
