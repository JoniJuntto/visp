import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	clientPrefix: "VITE_",
	client: {
		VITE_RELAY_PING_URL: z.url(),
		VITE_SERVER_URL: z.url(),
	},
	runtimeEnv: (
		import.meta as ImportMeta & {
			env: Record<string, boolean | string | undefined>;
		}
	).env,
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
