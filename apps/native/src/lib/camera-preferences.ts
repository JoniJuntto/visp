import * as SecureStore from "expo-secure-store";
import { parseImageStabilizationPreference } from "./camera-settings";

const IMAGE_STABILIZATION_KEY = "visp.camera.image-stabilization";

export async function loadImageStabilizationPreference(): Promise<boolean> {
	return parseImageStabilizationPreference(
		await SecureStore.getItemAsync(IMAGE_STABILIZATION_KEY),
	);
}

export async function saveImageStabilizationPreference(
	enabled: boolean,
): Promise<void> {
	await SecureStore.setItemAsync(IMAGE_STABILIZATION_KEY, String(enabled));
}
