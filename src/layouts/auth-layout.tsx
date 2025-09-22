import { Navigate, Outlet } from "react-router";
import { useEffect } from "react";
import { useDatabase } from "tauri-react-sqlite";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useAuthStore } from "@/stores/auth-store";

function AuthLayout() {
  const { isAuthorized, user, logout } = useAuthStore();
  const { db } = useDatabase();
  useEffect(() => {
    (async () => {
      if (user) {
        const dbUser = await db?.select().from(users).where(eq(users.email, user.email))
        if (!dbUser) logout() 
      }
    })()
  }, [])
  if (!isAuthorized) return <Navigate to={"auth"} />;
  return <Outlet />;
}

export default AuthLayout;
