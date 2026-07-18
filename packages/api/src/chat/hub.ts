import type {
	ChatLiveEvent,
	ChatProvider,
	ChatProviderStatus,
} from "./contract";

type Listener = (event: ChatLiveEvent) => void;
type AudienceListener = (userId: string, count: number) => void;

class ChatHub {
	private readonly audiences = new Set<AudienceListener>();
	private readonly listeners = new Map<string, Set<Listener>>();
	private readonly statuses = new Map<
		string,
		Map<ChatProvider, ChatProviderStatus>
	>();

	onAudienceChanged(listener: AudienceListener) {
		this.audiences.add(listener);
		return () => this.audiences.delete(listener);
	}

	subscribe(userId: string, listener: Listener) {
		const listeners = this.listeners.get(userId) ?? new Set<Listener>();
		listeners.add(listener);
		this.listeners.set(userId, listeners);
		for (const status of this.statuses.get(userId)?.values() ?? []) {
			listener({ type: "status", status });
		}
		this.notifyAudience(userId, listeners.size);
		return () => {
			listeners.delete(listener);
			if (listeners.size === 0) this.listeners.delete(userId);
			this.notifyAudience(userId, listeners.size);
			if (listeners.size === 0) this.statuses.delete(userId);
		};
	}

	publish(userId: string, event: ChatLiveEvent) {
		for (const listener of this.listeners.get(userId) ?? []) listener(event);
	}

	status(
		userId: string,
		provider: ChatProvider,
		state: ChatProviderStatus["state"],
	) {
		const statuses = this.statuses.get(userId) ?? new Map();
		const status = { provider, state } satisfies ChatProviderStatus;
		statuses.set(provider, status);
		this.statuses.set(userId, statuses);
		this.publish(userId, { type: "status", status });
	}

	private notifyAudience(userId: string, count: number) {
		for (const listener of this.audiences) listener(userId, count);
	}
}

export const chatHub = new ChatHub();
