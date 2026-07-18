import { NativeModule, requireNativeModule } from "expo";

declare class VispSrtModule extends NativeModule<Record<string, never>> {}

export default requireNativeModule<VispSrtModule>("VispSrt");
