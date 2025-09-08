import { AuthorizedProvider } from "@/contexts/AuthContext";

export const witAuth = (component: () => React.ReactNode) => () => {
  return <AuthorizedProvider>{component()}</AuthorizedProvider>;
};
