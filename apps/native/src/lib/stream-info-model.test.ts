import { describe, expect, test } from "bun:test";
import {
	mergeCategorySuggestions,
	parseStreamInfoDraft,
} from "./stream-info-model";

describe("parseStreamInfoDraft", () => {
	test("round-trips a full draft", () => {
		const draft = {
			title: "Hello",
			categoryName: "Chess",
			twitchCategoryId: "743",
			kickCategoryId: 5,
		};
		expect(parseStreamInfoDraft(JSON.stringify(draft))).toEqual(draft);
	});

	test("rejects garbage and missing fields", () => {
		expect(parseStreamInfoDraft(null)).toBeUndefined();
		expect(parseStreamInfoDraft("not json")).toBeUndefined();
		expect(parseStreamInfoDraft(JSON.stringify({ title: 3 }))).toBeUndefined();
	});

	test("drops wrongly typed category ids but keeps the rest", () => {
		expect(
			parseStreamInfoDraft(
				JSON.stringify({
					title: "Hi",
					categoryName: "IRL",
					twitchCategoryId: 9,
					kickCategoryId: "9",
				}),
			),
		).toEqual({
			title: "Hi",
			categoryName: "IRL",
			twitchCategoryId: undefined,
			kickCategoryId: undefined,
		});
	});
});

describe("mergeCategorySuggestions", () => {
	test("merges same-named categories across platforms case-insensitively", () => {
		expect(
			mergeCategorySuggestions(
				[
					{ id: "1", name: "Chess" },
					{ id: "2", name: "Just Chatting" },
				],
				[
					{ id: 10, name: "chess" },
					{ id: 11, name: "IRL" },
				],
			),
		).toEqual([
			{ name: "Chess", twitchCategoryId: "1", kickCategoryId: 10 },
			{ name: "Just Chatting", twitchCategoryId: "2" },
			{ name: "IRL", kickCategoryId: 11 },
		]);
	});

	test("handles null platforms and applies the limit", () => {
		expect(mergeCategorySuggestions(null, null)).toEqual([]);
		const many = Array.from({ length: 10 }, (_, index) => ({
			id: String(index),
			name: `Game ${index}`,
		}));
		expect(mergeCategorySuggestions(many, null, 6)).toHaveLength(6);
	});
});
