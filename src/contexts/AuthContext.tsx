import { useAuthStore, User } from "@/stores/auth-store";
import { ReactNode, createContext, useContext } from "react";

interface AuthorizedContextType {
  isAuthorized: boolean;
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const AuthorizedContext = createContext<AuthorizedContextType>({
  isAuthorized: false,
  user: null,
  isLoading: false,
  login: () => {},
  logout: () => {},
  setLoading: () => {},
});

export const AuthorizedProvider = ({ children }: { children: ReactNode }) => {
  const authStore = useAuthStore();

  return (
    <AuthorizedContext.Provider value={authStore}>
      {children}
    </AuthorizedContext.Provider>
  );
};

export const useAuthorized = () => useContext(AuthorizedContext);
