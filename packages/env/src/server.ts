import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { serverEnvSchema } from "./schema";

export const env = createEnv({
	server: serverEnvSchema,
	runtimeEnv: process.env,
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
