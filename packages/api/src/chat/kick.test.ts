import { describe, expect, test } from "bun:test";
import { createSign, generateKeyPairSync } from "node:crypto";
import type { KickWebhookHeaders } from "./kick";

import "../test-env";

const { verifyKickWebhook } = await import("./kick");

const { privateKey, publicKey } = generateKeyPairSync("rsa", {
	modulusLength: 2048,
});

function signedHeaders(rawBody: string, timestamp: string): KickWebhookHeaders {
	const messageId = "event-1";
	const signer = createSign("RSA-SHA256");
	signer.update(`${messageId}.${timestamp}.${rawBody}`);
	signer.end();
	return {
		messageId,
		signature: signer.sign(privateKey, "base64"),
		timestamp,
		type: "chat.message.sent",
		version: "1",
	};
}

describe("Kick webhook verification", () => {
	test("accepts a valid signature once and rejects its replay", () => {
		const now = Date.parse("2026-07-17T10:00:00.000Z");
		const rawBody = '{"message_id":"message-1"}';
		const headers = signedHeaders(rawBody, new Date(now).toISOString());
		const replays = new Map<string, number>();

		expect(
			verifyKickWebhook(rawBody, headers, now, publicKey, replays),
		).toEqual({ ok: true });
		expect(
			verifyKickWebhook(rawBody, headers, now, publicKey, replays),
		).toEqual({
			ok: false,
			reason: "replay",
		});
	});

	test("rejects stale timestamps and body tampering", () => {
		const now = Date.parse("2026-07-17T10:00:00.000Z");
		const rawBody = '{"message_id":"message-1"}';
		const stale = signedHeaders(
			rawBody,
			new Date(now - 5 * 60_000 - 1).toISOString(),
		);
		expect(
			verifyKickWebhook(rawBody, stale, now, publicKey, new Map()),
		).toEqual({
			ok: false,
			reason: "timestamp",
		});

		const current = signedHeaders(rawBody, new Date(now).toISOString());
		expect(
			verifyKickWebhook(`${rawBody} `, current, now, publicKey, new Map()),
		).toEqual({
			ok: false,
			reason: "signature",
		});
	});
});
