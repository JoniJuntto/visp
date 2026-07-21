export const LANDING_SEPPO_SESSION_KEY = "visp.seppo.landing-opened";

export function scheduleLandingSeppoAutoOpen(
	storage: Pick<Storage, "getItem" | "setItem">,
	onOpen: () => void,
	schedule: (callback: () => void, delay: number) => number = window.setTimeout,
	cancel: (timer: number) => void = window.clearTimeout,
) {
	if (storage.getItem(LANDING_SEPPO_SESSION_KEY)) return () => {};
	const timer = schedule(() => {
		storage.setItem(LANDING_SEPPO_SESSION_KEY, "true");
		onOpen();
	}, 5_000);
	return () => cancel(timer);
}
