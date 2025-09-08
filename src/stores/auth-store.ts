// src/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
    username: string;
    email: string;
}



interface AuthState {
    user: User | null;
    isAuthorized: boolean;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthorized: false,
            isLoading: false,

            login: (userData: User) => set({
                user: userData,
                isAuthorized: true,
                isLoading: false
            }),

            logout: () => set({
                user: null,
                isAuthorized: false,
                isLoading: false
            }),

            setLoading: (loading: boolean) => set({ isLoading: loading }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);