import React, { createContext, useContext, useEffect, useState } from "react";
import { drizzle } from "drizzle-orm/sqlite-proxy";
import Database from "@tauri-apps/plugin-sql";
import * as schema from "../db/schema";
import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";

interface DatabaseContextType {
  db: BaseSQLiteDatabase<"async", any, typeof schema> | null;
  isLoading: boolean;
  error: string | null;
  reconnect: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType>({
  db: null,
  isLoading: true,
  error: null,
  reconnect: async () => {},
});

function isSelectQuery(sql: string): boolean {
  const trimmedSql = sql.trim().toLowerCase();
  return trimmedSql.startsWith("select") || trimmedSql.startsWith("with");
}

async function createDrizzle() {
  return drizzle<typeof schema>(
    async (sql, params, method) => {
      try {
        const sqlite = await Database.load("sqlite:test.db");
        console.log("schema: " + typeof schema);
        let rows: any = [];
        let results = [];

        if (isSelectQuery(sql)) {
          rows = await sqlite.select(sql, params).catch((e) => {
            console.error("SQL Error:", e);
            return [];
          });
        } else {
          rows = await sqlite.execute(sql, params).catch((e) => {
            console.error("SQL Error:", e);
            return [];
          });
          return { rows: [] };
        }

        rows = rows.map((row: any) => {
          return Object.values(row);
        });

        results = method === "all" ? rows : rows[0];
        await sqlite.close();

        return { rows: results };
      } catch (error) {
        console.error("Database operation failed:", error);
        throw error;
      }
    },
    { schema, logger: true }
  );
}

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [db, setDb] = useState<BaseSQLiteDatabase<
    "async",
    any,
    typeof schema
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeDatabase = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const drizzleInstance = await createDrizzle();
      setDb(drizzleInstance);

      await drizzleInstance.select().from(schema.users).limit(1);
    } catch (err) {
      console.error("Failed to initialize database:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setDb(null);
    } finally {
      setIsLoading(false);
    }
  };

  const reconnect = async () => {
    await initializeDatabase();
  };

  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, isLoading, error, reconnect }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};
