import { drizzle as drizzleTurso } from "drizzle-orm/libsql";
import { type Config, createClient } from "@libsql/client";
import * as Sentry from "@sentry/node";
import { libsqlIntegration } from "sentry-integration-libsql-client";

import * as schema from "./schema";

let config: Config;

if (!process.env.CI_MODE && process.env.NODE_ENV === "production") {
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

Sentry.init({
	dsn: "https://8ca7361b680e2e1d37c67865aef44df0@o4508087813996544.ingest.de.sentry.io/4508087823761488",
	integrations: [
		libsqlIntegration(client, Sentry, {
			tracing: false,
			breadcrumbs: false,
			errors: false,
		}),
	],
});

export { db };
