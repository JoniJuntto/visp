import { auth } from "@VISP/auth";
import {
	convertToModelMessages,
	safeValidateUIMessages,
	streamText,
	type UIMessage,
} from "ai";
import { Elysia } from "elysia";

const SYSTEM_PROMPT = `You are Seppo, the concise and friendly VISP setup assistant.
Help users complete VISP's three setup steps:
1. Choose how many devices stream concurrently. A device is a phone, camera rig, or computer sending video. They can add more later.
2. Choose their streaming app: OBS Studio for a PC/laptop, Larix Broadcaster for a phone, Moblin for an iPhone, or the generic Streamlabs/something else option.
3. VISP creates private stream links for each device and an OBS scene collection. Users paste a device link into their streaming app, then add the resulting feed to OBS manually or by importing the scene collection.

Ask only the questions needed to understand their setup. Give practical recommendations, explain unfamiliar terms plainly, and keep answers short. Do not claim to change wizard answers or create links. Never ask for or repeat credentials, API keys, stream links, or passwords. If asked about something outside VISP onboarding, redirect to setup help.`;

const MAX_MESSAGES = 20;
const MAX_PART_CHARACTERS = 2_000;
const MAX_TRANSCRIPT_CHARACTERS = 20_000;

export async function validateSeppoMessages(messages: unknown) {
	if (
		!Array.isArray(messages) ||
		messages.length === 0 ||
		messages.length > MAX_MESSAGES
	) {
		return null;
	}

	const validated = await safeValidateUIMessages({
		messages: messages as UIMessage[],
	});
	if (!validated.success || validated.data.at(-1)?.role !== "user") return null;

	let characters = 0;
	for (const message of validated.data) {
		if (message.role !== "user" && message.role !== "assistant") return null;
		for (const part of message.parts) {
			if (part.type !== "text" || part.text.length > MAX_PART_CHARACTERS)
				return null;
			characters += part.text.length;
		}
	}

	return characters <= MAX_TRANSCRIPT_CHARACTERS ? validated.data : null;
}

export const seppoRoutes = new Elysia({ name: "seppo-routes" }).post(
	"/api/setup-assistant",
	async ({ request, status }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) return status(401, { error: "Authentication required" });

		let body: unknown;
		try {
			body = await request.json();
		} catch {
			return status(400, { error: "Invalid request" });
		}

		const messages = await validateSeppoMessages(
			typeof body === "object" && body !== null && "messages" in body
				? body.messages
				: undefined,
		);
		if (!messages) return status(400, { error: "Invalid messages" });

		try {
			const result = streamText({
				model: "anthropic/claude-sonnet-4.6",
				system: SYSTEM_PROMPT,
				messages: await convertToModelMessages(messages),
				maxOutputTokens: 500,
			});
			return result.toUIMessageStreamResponse({
				onError: () => "Seppo is unavailable right now. Please try again.",
			});
		} catch {
			return status(502, { error: "Seppo is unavailable right now" });
		}
	},
	{ parse: "none" },
);
