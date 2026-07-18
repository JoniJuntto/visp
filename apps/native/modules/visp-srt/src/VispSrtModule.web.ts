import { NativeModule, registerWebModule } from "expo";

class VispSrtModule extends NativeModule<Record<string, never>> {}

export default registerWebModule(VispSrtModule, "VispSrt");
