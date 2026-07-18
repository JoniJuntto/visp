import type { ChatFragment } from "@VISP/api/chat/contract";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import type { FloatingPosition, VisibleChatMessage } from "../lib/chat-model";

function Fragment({ fragment }: { fragment: ChatFragment }) {
	const [failed, setFailed] = useState(false);
	if (fragment.type === "text" || failed) {
		return (
			<Text style={{ color: "white", fontSize: 14 }}>{fragment.text}</Text>
		);
	}
	return (
		<Image
			onError={() => setFailed(true)}
			source={fragment.url}
			style={{ height: 22, width: 22 }}
		/>
	);
}

function keyedFragments(fragments: ChatFragment[]) {
	const occurrences = new Map<string, number>();
	return fragments.map((fragment) => {
		const value =
			fragment.type === "emote"
				? `${fragment.type}:${fragment.text}:${fragment.url}`
				: `${fragment.type}:${fragment.text}`;
		const occurrence = occurrences.get(value) ?? 0;
		occurrences.set(value, occurrence + 1);
		return { fragment, key: `${value}:${occurrence}` };
	});
}

export function FloatingChat({
	messages,
	onPositionChange,
	position,
}: {
	messages: VisibleChatMessage[];
	onPositionChange: (position: FloatingPosition) => void;
	position: FloatingPosition;
}) {
	const { height, width } = useWindowDimensions();
	const maxX = Math.max(0, width - 300);
	const maxY = Math.max(0, height - 180);
	const x = useSharedValue(Math.min(maxX, position.x));
	const y = useSharedValue(Math.min(maxY, position.y));
	const originX = useSharedValue(position.x);
	const originY = useSharedValue(position.y);

	useEffect(() => {
		x.value = Math.max(0, Math.min(maxX, position.x));
		y.value = Math.max(0, Math.min(maxY, position.y));
	}, [maxX, maxY, position.x, position.y, x, y]);

	const pan = Gesture.Pan()
		.onBegin(() => {
			originX.value = x.value;
			originY.value = y.value;
		})
		.onUpdate(({ translationX, translationY }) => {
			x.value = Math.max(0, Math.min(maxX, originX.value + translationX));
			y.value = Math.max(0, Math.min(maxY, originY.value + translationY));
		})
		.onEnd(() => runOnJS(onPositionChange)({ x: x.value, y: y.value }));
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: x.value }, { translateY: y.value }],
	}));

	if (messages.length === 0) return null;
	return (
		<GestureDetector gesture={pan}>
			<Animated.View
				style={[
					{
						backgroundColor: "rgba(0,0,0,0.64)",
						borderRadius: 14,
						gap: 6,
						left: 0,
						maxWidth: 300,
						padding: 10,
						position: "absolute",
						top: 0,
					},
					animatedStyle,
				]}
			>
				{messages.map((message) => (
					<View
						key={`${message.provider}-${message.id}`}
						style={{ opacity: message.opacity }}
					>
						<Text
							style={{
								color: message.sender.color ?? "white",
								fontSize: 13,
								fontWeight: "800",
							}}
						>
							{message.sender.name}
						</Text>
						<View
							style={{
								alignItems: "center",
								flexDirection: "row",
								flexWrap: "wrap",
							}}
						>
							{keyedFragments(message.fragments).map(({ fragment, key }) => (
								<Fragment fragment={fragment} key={`${message.id}:${key}`} />
							))}
						</View>
					</View>
				))}
			</Animated.View>
		</GestureDetector>
	);
}
