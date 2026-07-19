import { NativeModule, requireNativeModule } from "expo";

type VispSrtEvents = {
	onWatchSceneCommand(event: { requestId: string; scene: string }): void;
};

declare class VispSrtModule extends NativeModule<VispSrtEvents> {
	syncWatchSnapshot(json: string): void;
	replyToWatchSceneCommand(requestId: string, error: string | null): void;
}

export default requireNativeModule<VispSrtModule>("VispSrt");
