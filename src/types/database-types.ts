import { AnySQLiteTable, BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";

export type Database = {
  db: BaseSQLiteDatabase<"async", any, Record<string, AnySQLiteTable>>;
};
