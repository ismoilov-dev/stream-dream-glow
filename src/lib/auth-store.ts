import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthTokens, User } from "./types";

interface AuthState {
  tokens: AuthTokens | null;
  user: User | null;
  isAuthenticated: boolean;
  setTokens: (t: AuthTokens | null) => void;
  setUser: (u: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tokens: null,
      user: null,
      isAuthenticated: false,
      setTokens: (tokens) => set({ tokens, isAuthenticated: !!tokens }),
      setUser: (user) => set({ user }),
      logout: () => set({ tokens: null, user: null, isAuthenticated: false }),
    }),
    { name: "streamplay-auth" },
  ),
);
