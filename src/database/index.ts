import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";

import * as schema from "./schema";

const sqlite = new Database("./src/database/sqlite.db");
export const db = drizzle(sqlite, { schema });
