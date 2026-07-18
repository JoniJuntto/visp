import { describe, expect, test } from "bun:test";
import { ChatTicketStore } from "./tickets";

describe("chat live tickets", () => {
	test("are single use and isolated to their owner", () => {
		const store = new ChatTicketStore();
		const { ticket } = store.issue("user-a", 1_000);
		expect(store.consume(ticket, 2_000)).toBe("user-a");
		expect(store.consume(ticket, 2_001)).toBeNull();
	});

	test("expire after thirty seconds", () => {
		const store = new ChatTicketStore();
		const { ticket } = store.issue("user-a", 1_000);
		expect(store.consume(ticket, 31_000)).toBeNull();
	});
});
