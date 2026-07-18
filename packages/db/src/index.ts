import { readFileSync } from "node:fs";

import { env } from "@VISP/env/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const SSL_URL_PARAMS = [
	"sslmode",
	"sslrootcert",
	"sslcert",
	"sslkey",
	"uselibpqcompat",
] as const;

function databaseUrlWithoutSslParams(url: string): string {
	const parsed = new URL(url);
	for (const key of SSL_URL_PARAMS) {
		parsed.searchParams.delete(key);
	}
	return parsed.toString();
}

export function createDb() {
	const sslCaPath = env.DATABASE_SSL_CA;
	const pool = new Pool(
		sslCaPath
			? {
					connectionString: databaseUrlWithoutSslParams(env.DATABASE_URL),
					ssl: {
						ca: readFileSync(sslCaPath, "utf8"),
						rejectUnauthorized: true,
					},
				}
			: { connectionString: env.DATABASE_URL },
	);

	return drizzle(pool, { schema });
}

export const db = createDb();
