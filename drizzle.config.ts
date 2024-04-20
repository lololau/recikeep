import type { Config } from "drizzle-kit";
export default {
	schema: "./src/database/schema.ts",
	out: "./src/database/drizzle",
	driver: "better-sqlite",
	dbCredentials: {
		url: "./src/database/sqlite.db",
	},
} satisfies Config;
