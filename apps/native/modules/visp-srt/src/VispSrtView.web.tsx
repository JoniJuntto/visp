import type { VispSrtViewProps } from "./VispSrt.types";

// VispSrtView is not available on the web platform.
export default function VispSrtView(_props: VispSrtViewProps) {
	throw new Error("VispSrtView is not available on the web platform.");
}
