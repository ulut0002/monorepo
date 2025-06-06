// stores/authStore.ts
import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean | null;
  checkAuth: () => Promise<void>;
  logout: () => void;
  performLogout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: null,

  checkAuth: async () => {
    try {
      const res = await fetch("/api/auth/me");
      set({ isLoggedIn: res.ok });
    } catch {
      set({ isLoggedIn: false });
    }
  },

  logout: () => {
    set({ isLoggedIn: false });
  },

  performLogout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      set({ isLoggedIn: false });
    }
  },
}));
