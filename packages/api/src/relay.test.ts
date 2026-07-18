import "./test-env";

import { describe, expect, test } from "bun:test";

const {
	buildSceneCollection,
	decryptPublishSecret,
	encryptPublishSecret,
	recommendLatency,
} = await import("./relay");

describe("relay guidance", () => {
	test("encrypts publish secrets with user and path binding", () => {
		const encrypted = encryptPublishSecret("publish-secret", "user-a", 1);
		expect(encrypted).not.toContain("publish-secret");
		expect(decryptPublishSecret(encrypted, "user-a", 1)).toBe("publish-secret");
		expect(() => decryptPublishSecret(encrypted, "user-a", 2)).toThrow(
			"cannot be revealed",
		);
		expect(() =>
			decryptPublishSecret(`${encrypted.slice(0, -1)}x`, "user-a", 1),
		).toThrow("cannot be revealed");
	});

	test("applies profile multipliers, floors, and 50 ms rounding", () => {
		expect(recommendLatency(1, "wired").ms).toBe(120);
		expect(recommendLatency(81, "wired").ms).toBe(250);
		expect(recommendLatency(1, "wifi").ms).toBe(300);
		expect(recommendLatency(101, "wifi").ms).toBe(450);
		expect(recommendLatency(1, "cellular").ms).toBe(600);
		expect(recommendLatency(109, "cellular").ms).toBe(700);
	});

	test("generates OBS ffmpeg media sources with the required settings", () => {
		const collection = buildSceneCollection({
			handle: "streamer",
			latencyMicros: 300_000,
			paths: [{ label: "main", slug: "streamer-1" }],
			readSecret: "read-secret",
		});
		const source = collection.sources.find(
			(item) => item.id === "ffmpeg_source",
		);
		if (!source || !("input" in source.settings)) {
			throw new Error("OBS media source was not generated");
		}

		expect(source.settings).toMatchObject({
			input_format: "mpegts",
			buffering_mb: 1,
			clear_on_media_end: true,
			reconnect_delay_sec: 1,
		});
		expect(source.settings.input).toContain("streamid=read:streamer-1");
		expect(source.settings.input).toContain("latency=300000");
	});
});
