import { drizzle as drizzleTurso } from "drizzle-orm/libsql";
import { type Config, createClient } from "@libsql/client";

import * as schema from "./schema";

let config: Config;

if (process.env.NODE_ENV === "production") {
	if (!process.env.TURSO_CONNECTION_URL || !process.env.TURSO_AUTH_TOKEN) {
		throw new Error("missing turso token");
	}
	config = {
		url: process.env.TURSO_CONNECTION_URL,
		authToken: process.env.TURSO_AUTH_TOKEN,
	};
} else {
	config = {
		url: "file:./src/database/sqlite.db",
	};
}
const client = createClient(config);
const db = drizzleTurso(client, { schema });

export { db };
