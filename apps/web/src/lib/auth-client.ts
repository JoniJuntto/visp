import { env } from "@VISP/env/web";
import {
	deviceAuthorizationClient,
	genericOAuthClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

function getServerUrl(url: string) {
	const normalized = url.endsWith("/") ? url.slice(0, -1) : url;

	if (!normalized.startsWith("/")) {
		return normalized;
	}

	if (typeof window !== "undefined") {
		return `${window.location.origin}${normalized}`;
	}

	const processEnv = (
		globalThis as {
			process?: { env?: Record<string, string | undefined> };
		}
	).process?.env;
	const vercelUrl =
		processEnv?.VERCEL_ENV === "production"
			? (processEnv?.VERCEL_PROJECT_PRODUCTION_URL ?? processEnv?.VERCEL_URL)
			: (processEnv?.VERCEL_URL ?? processEnv?.VERCEL_PROJECT_PRODUCTION_URL);
	if (vercelUrl) {
		const origin = vercelUrl.startsWith("http")
			? vercelUrl
			: `https://${vercelUrl}`;
		return `${origin}${normalized}`;
	}

	return `http://localhost:3000${normalized}`;
}
const authBaseURL =
	import.meta.env.PROD && typeof window !== "undefined"
		? `${window.location.origin}/api/auth`
		: new URL("/api/auth", getServerUrl(env.VITE_SERVER_URL)).toString();

export const authClient = createAuthClient({
	baseURL: authBaseURL,
	plugins: [deviceAuthorizationClient(), genericOAuthClient()],
});

export const authApiURL = (path: string) =>
	`${authBaseURL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

export const authRedirectURL = (path: string) =>
	new URL(path, window.location.origin).toString();
