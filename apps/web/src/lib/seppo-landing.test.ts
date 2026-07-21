import { describe, expect, test } from "bun:test";
import {
	LANDING_SEPPO_SESSION_KEY,
	scheduleLandingSeppoAutoOpen,
} from "./seppo-landing";

describe("landing Seppo auto-open", () => {
	test("opens after five seconds once per session and cancels on cleanup", () => {
		const values = new Map<string, string>();
		const storage = {
			getItem: (key: string) => values.get(key) ?? null,
			setItem: (key: string, value: string) => values.set(key, value),
		};
		let callback = () => {};
		let delay = 0;
		let cancelled = false;
		let opened = 0;
		const cleanup = scheduleLandingSeppoAutoOpen(
			storage,
			() => opened++,
			(next, timeout) => {
				callback = next;
				delay = timeout;
				return 7;
			},
			(timer) => {
				cancelled = timer === 7;
			},
		);

		expect(delay).toBe(5_000);
		callback();
		expect(opened).toBe(1);
		expect(values.get(LANDING_SEPPO_SESSION_KEY)).toBe("true");
		cleanup();
		expect(cancelled).toBe(true);

		let scheduledAgain = false;
		scheduleLandingSeppoAutoOpen(
			storage,
			() => {},
			() => {
				scheduledAgain = true;
				return 8;
			},
			() => {},
		);
		expect(scheduledAgain).toBe(false);
	});
});
