import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { apiClient } from "../lib/backend";

type ObsStatus = Awaited<ReturnType<typeof apiClient.obs.status.query>>;

export function ObsControlButton({
	onError,
}: {
	onError: (message: string) => void;
}) {
	const [busy, setBusy] = useState(false);
	const [status, setStatus] = useState<ObsStatus>();

	useEffect(() => {
		let active = true;
		let timer: ReturnType<typeof setTimeout>;
		const refresh = async () => {
			try {
				const next = await apiClient.obs.status.query();
				if (active) setStatus(next);
			} catch {
				if (active) setStatus(undefined);
			} finally {
				if (active) timer = setTimeout(refresh, 3000);
			}
		};
		void refresh();
		return () => {
			active = false;
			clearTimeout(timer);
		};
	}, []);

	if (!status?.configured) return null;
	const disabled = busy || status.pending || !status.connected;
	const label = !status.connected
		? "OBS offline"
		: status.pending
			? "Waiting for OBS…"
			: status.streaming
				? "Stop OBS"
				: "Start OBS";

	return (
		<Pressable
			accessibilityLabel={
				status.streaming ? "Stop OBS stream" : "Start OBS stream"
			}
			accessibilityRole="button"
			accessibilityState={{ disabled }}
			disabled={disabled}
			onPress={() => {
				setBusy(true);
				apiClient.obs.setStreaming
					.mutate({ streaming: !status.streaming })
					.then(setStatus)
					.catch((error) =>
						onError(
							error instanceof Error ? error.message : "OBS command failed",
						),
					)
					.finally(() => setBusy(false));
			}}
			style={({ pressed }) => [
				styles.button,
				status.streaming && styles.stopButton,
				disabled && styles.disabled,
				pressed && styles.pressed,
			]}
		>
			<Text style={styles.label}>{label}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: "rgba(255,255,255,0.16)",
		borderColor: "rgba(255,255,255,0.24)",
		borderRadius: 18,
		borderWidth: 1,
		paddingHorizontal: 16,
		paddingVertical: 9,
	},
	disabled: { opacity: 0.45 },
	label: { color: "white", fontSize: 13, fontWeight: "800" },
	pressed: { transform: [{ scale: 0.98 }] },
	stopButton: { backgroundColor: "rgba(255,53,77,0.78)" },
});
