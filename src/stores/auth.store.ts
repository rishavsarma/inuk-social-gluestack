import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

import { ROUTES } from "@/routes";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  setToken: (token: string) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

// Custom storage engine mapping Zustand persist to Expo SecureStore
const secureStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await SecureStore.getItemAsync(name);
      return value ?? null;
    } catch (e) {
      console.error("Failed to get item from SecureStore", e);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (e) {
      console.error("Failed to set item in SecureStore", e);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (e) {
      console.error("Failed to delete item from SecureStore", e);
    }
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      _hasHydrated: false,
      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true, isLoading: false }),
      setToken: (token) => set({ token }),
      logout: () => {
        router.replace(ROUTES.AUTH.HOME);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
      setLoading: (isLoading) => set({ isLoading }),
      setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => secureStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
