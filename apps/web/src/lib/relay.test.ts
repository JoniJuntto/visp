import { describe, expect, test } from "bun:test";

import { medianRoundTrip } from "./relay";

describe("relay RTT probe", () => {
	test("uses the median without mutating samples", () => {
		const samples = [90, 10, 50, 70, 30, 110, 40];
		expect(medianRoundTrip(samples)).toBe(50);
		expect(samples).toEqual([90, 10, 50, 70, 30, 110, 40]);
	});
});
