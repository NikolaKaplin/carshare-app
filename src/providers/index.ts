import compose from "compose-function";
import { withDrizzleDb } from "./with-drizzle-db";
import { withAuth } from "./with-auth";
import { withRouting } from "./with-routing";
import { withTheme } from "./with-theme";
import { withQuery } from "./with-query";
import { withSonner } from "./with-sonner";

export const withProviders = compose(
  withQuery,
  withDrizzleDb,
  withAuth,
  withRouting,
  withTheme,
  withSonner,
);
