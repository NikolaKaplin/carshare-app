// src/contexts/AuthContext.tsx
import { schema } from "@/components/shared/data-table";
import { useAuthStore, User } from "@/stores/auth-store";
import { ReactNode, createContext, useContext } from "react";
import { createTauriDrizzle } from "tauri-react-sqlite";

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
