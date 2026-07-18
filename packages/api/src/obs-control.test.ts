import "./test-env";

import { describe, expect, test } from "bun:test";
import { parseObsControlToken } from "./obs-control";

describe("OBS control token", () => {
	test("accepts only the exact bearer token shape", () => {
		const id = "a".repeat(24);
		const secret = "b".repeat(64);
		expect(parseObsControlToken(`Bearer ${id}.${secret}`)).toEqual({
			id,
			secret,
		});
		expect(parseObsControlToken(`${id}.${secret}`)).toBeNull();
		expect(parseObsControlToken(`Bearer ${id}.${secret}.extra`)).toBeNull();
		expect(parseObsControlToken("Bearer ../bad")).toBeNull();
	});
});
