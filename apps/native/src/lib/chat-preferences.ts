import * as SecureStore from "expo-secure-store";
import { type ChatPreferences, parseChatPreferences } from "./chat-model";

export * from "./chat-model";

function storageKey(userId: string) {
	return `visp.chat.${userId.replace(/[^a-z0-9._-]/gi, "_")}`;
}

export async function loadChatPreferences(userId: string) {
	return parseChatPreferences(
		await SecureStore.getItemAsync(storageKey(userId)),
	);
}

export async function saveChatPreferences(
	userId: string,
	preferences: ChatPreferences,
) {
	await SecureStore.setItemAsync(
		storageKey(userId),
		JSON.stringify(preferences),
	);
}
