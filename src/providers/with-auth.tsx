import { AuthorizedProvider } from "@/contexts/AuthContext";

export const withAuth = (component: () => React.ReactNode) => () => {
  return <AuthorizedProvider>{component()}</AuthorizedProvider>;
};
