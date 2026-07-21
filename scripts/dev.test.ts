import { describe, expect, test } from "bun:test";
import { setEnvValue } from "./dev";

describe("local development env updates", () => {
	test("replaces existing values and appends missing keys", () => {
		let source = "FIRST=old\nSECOND=kept\n";
		source = setEnvValue(source, "FIRST", "new");
		source = setEnvValue(source, "THIRD", "added");
		expect(source).toBe("FIRST=new\nSECOND=kept\nTHIRD=added\n");
	});
});
