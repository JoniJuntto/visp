import "./test-env";

import { describe, expect, test } from "bun:test";

const { seppoRoutes, validateSeppoMessages } = await import("./seppo");

describe("Seppo setup assistant", () => {
	test("requires authentication", async () => {
		const response = await seppoRoutes.handle(
			new Request("http://localhost/api/setup-assistant", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					messages: [
						{ id: "1", role: "user", parts: [{ type: "text", text: "Hi" }] },
					],
				}),
			}),
		);

		expect(response.status).toBe(401);
	});

	test("accepts a small text transcript and rejects unsafe payloads", async () => {
		expect(
			await validateSeppoMessages([
				{
					id: "1",
					role: "user",
					parts: [{ type: "text", text: "Help me choose" }],
				},
			]),
		).not.toBeNull();
		expect(
			await validateSeppoMessages([
				{
					id: "1",
					role: "user",
					parts: [{ type: "text", text: "x".repeat(2_001) }],
				},
			]),
		).toBeNull();
		expect(
			await validateSeppoMessages([
				{
					id: "1",
					role: "user",
					parts: [
						{ type: "file", mediaType: "text/plain", url: "data:,secret" },
					],
				},
			]),
		).toBeNull();
	});
});
