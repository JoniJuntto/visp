export type ChatProvider = "twitch" | "kick";
export type ChatCorner =
	| "top-left"
	| "top-right"
	| "bottom-left"
	| "bottom-right";

export type ChatFragment =
	| { type: "text"; text: string }
	| { type: "emote"; text: string; url: string };

export type ChatMessage = {
	id: string;
	provider: ChatProvider;
	sentAt: string;
	sender: { id: string; name: string; color?: string };
	fragments: ChatFragment[];
};

export type ChatProviderStatus = {
	provider: ChatProvider;
	state: "connected" | "connecting" | "disconnected" | "error";
};

export type ChatLiveEvent =
	| { type: "message"; message: ChatMessage }
	| { type: "status"; status: ChatProviderStatus };
