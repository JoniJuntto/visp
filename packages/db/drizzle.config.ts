import { readFileSync } from "node:fs";

import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
	path: "../../apps/server/.env",
});

const databaseUrl = process.env.DATABASE_URL || "";
const sslCaPath = process.env.DATABASE_SSL_CA;

function postgresCredentials(url: string, sslCaPath: string) {
	const parsed = new URL(url);
	const database = parsed.pathname.replace(/^\//, "");
	if (!database) {
		throw new Error("DATABASE_URL must include a database name");
	}

	return {
		host: parsed.hostname,
		port: parsed.port ? Number(parsed.port) : 5432,
		user: decodeURIComponent(parsed.username),
		password: decodeURIComponent(parsed.password),
		database,
		ssl: {
			ca: readFileSync(sslCaPath, "utf8"),
			rejectUnauthorized: true as const,
		},
	};
}

export default defineConfig({
	schema: "./src/schema",
	out: "./src/migrations",
	dialect: "postgresql",
	dbCredentials: sslCaPath
		? postgresCredentials(databaseUrl, sslCaPath)
		: { url: databaseUrl },
});
