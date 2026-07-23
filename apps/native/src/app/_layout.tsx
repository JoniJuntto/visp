import { Stack, usePathname } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ExpoUiWebFixes } from "../components/expo-ui-web-fixes";
import { trackPageview } from "../lib/analytics";

export default function RootLayout() {
	const pathname = usePathname();

	useEffect(() => {
		trackPageview(pathname);
	}, [pathname]);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ExpoUiWebFixes />
			<Stack screenOptions={{ headerShown: false }} />
		</GestureHandlerRootView>
	);
}
