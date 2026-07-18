import { expect, test } from "bun:test";
import { audioTierForLevel } from "./audio-level";

test("audioTierForLevel buckets peak levels", () => {
	expect(audioTierForLevel(0)).toBe(0);
	expect(audioTierForLevel(0.01)).toBe(0);
	expect(audioTierForLevel(0.02)).toBe(1);
	expect(audioTierForLevel(0.34)).toBe(1);
	expect(audioTierForLevel(0.35)).toBe(2);
	expect(audioTierForLevel(0.69)).toBe(2);
	expect(audioTierForLevel(0.7)).toBe(3);
	expect(audioTierForLevel(1)).toBe(3);
});
