import * as SecureStore from "expo-secure-store";
import {
	parseStreamInfoDraft,
	type StreamInfoDraft,
} from "./stream-info-model";

export * from "./stream-info-model";

function storageKey(userId: string) {
	return `visp.streaminfo.${userId.replace(/[^a-z0-9._-]/gi, "_")}`;
}

export async function loadStreamInfoDraft(userId: string) {
	return parseStreamInfoDraft(
		await SecureStore.getItemAsync(storageKey(userId)),
	);
}

export async function saveStreamInfoDraft(
	userId: string,
	draft: StreamInfoDraft,
) {
	await SecureStore.setItemAsync(storageKey(userId), JSON.stringify(draft));
}
