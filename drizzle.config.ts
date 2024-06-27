import { config } from "dotenv"
import { defineConfig, type Config } from "drizzle-kit";

const dev = process.env.NODE_ENV !== "production"

config({path: dev ? '.env.development' : '.env.production'})

let drizzlConfig
if (!process.env.CI_MODE && process.env.NODE_ENV === "production") {
	if (!process.env.TURSO_CONNECTION_URL || !process.env.TURSO_AUTH_TOKEN) {
		throw new Error("missing turso token");
	}
	drizzlConfig = {
		schema: "./src/database/schema.ts",
		out: "./src/database/drizzle",
		dialect: "sqlite",
		driver: "turso",
		dbCredentials: {
			url: process.env.TURSO_CONNECTION_URL,
			authToken: process.env.TURSO_AUTH_TOKEN,
		},
		strict: true,
		verbose: true,
	} satisfies Config
} else {
	drizzlConfig = {
		schema: "./src/database/schema.ts",
		out: "./src/database/drizzle",
		dialect: "sqlite",
		driver: "turso",
		dbCredentials: {
			url: "file:./src/database/sqlite.db",
		},
		strict: true,
		verbose: true,
	} satisfies Config
}

export default drizzlConfig