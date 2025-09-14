import { DatabaseProvider } from "tauri-react-sqlite";
import * as schema from "../db/schema";
import { DB_PATH } from "@/lib/constants";

export const withDrizzleDb = (component: () => React.ReactNode) => () => {
  return (
    <DatabaseProvider
      options={{
        schema: schema,
        dbPath: DB_PATH,
        logger: false,
      }}
    >
      {component()}
    </DatabaseProvider>
  );
};
