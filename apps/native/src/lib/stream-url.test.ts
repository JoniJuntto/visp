import { describe, expect, test } from "bun:test";

import {
	describeStreamUrl,
	selectPublishUrl,
	validateStreamUrl,
} from "./stream-url-validation";

describe("VISP stream URLs", () => {
	const valid =
		"srt://relay.example.com:8890?streamid=publish:slug:handle:secret&pkt_size=1316";

	test("accepts a VISP SRT publish URL without changing it", () => {
		expect(validateStreamUrl(`  ${valid}  `)).toBe(valid);
	});

	test.each([
		"",
		"https://relay.example.com:8890?streamid=publish:a:b:c",
		"srt://relay.example.com?streamid=publish:a:b:c",
		"srt://relay.example.com:8890?streamid=read:a:b:c",
	])("rejects %s", (value) => {
		expect(() => validateStreamUrl(value)).toThrow();
	});

	test("describes only the host and port", () => {
		expect(describeStreamUrl(valid)).toBe("relay.example.com:8890");
		expect(describeStreamUrl(valid)).not.toContain("secret");
	});

	test("selects the first returned publish URL", () => {
		expect(selectPublishUrl([{ srt: valid }])).toBe(valid);
		expect(() => selectPublishUrl([])).toThrow("No active VISP path");
	});
});
