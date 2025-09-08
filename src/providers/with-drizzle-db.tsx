import { DatabaseProvider } from "tauri-react-sqlite";
import * as schema from "../db/schema";

export const witDrizzleDb = (component: () => React.ReactNode) => () => {
  return (
    <DatabaseProvider
      options={{ schema: schema, dbPath: "sqlite:test.db", logger: true }}
    >
      {component()}
    </DatabaseProvider>
  );
};
