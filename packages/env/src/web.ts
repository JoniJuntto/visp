import { createEnv } from "@t3-oss/env-core";
import { webEnvSchema } from "./schema";

export const env = createEnv({
	clientPrefix: "VITE_",
	client: webEnvSchema,
	runtimeEnv: (
		import.meta as ImportMeta & {
			env: Record<string, boolean | string | undefined>;
		}
	).env,
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
