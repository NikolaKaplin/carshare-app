import { Navigate, Outlet } from "react-router";
import { useAuthorized } from "@/contexts/AuthContext";

function AuthLayout() {
  const { isAuthorized } = useAuthorized();
  if (!isAuthorized) return <Navigate to={"auth"} />;
  return <Outlet />;
}

export default AuthLayout;
