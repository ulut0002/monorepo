// stores/useSessionStore.ts
import { create } from "zustand";

type SessionState = {
  isLoggedIn: boolean;
  loading: boolean;
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useSessionStore = create<SessionState>((set) => ({
  isLoggedIn: false,
  loading: true,
  checkSession: async () => {
    const cookie = getCookieValue("auth_cookie");
    if (!cookie) {
      set({ isLoggedIn: false, loading: false });
      return;
    }

    try {
      const res = await fetch("/api/auth/validate", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      set({ isLoggedIn: data.valid, loading: false });
    } catch {
      set({ isLoggedIn: false, loading: false });
    }
  },
  logout: async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    set({ isLoggedIn: false });
  },
}));

// Utility (could be in a separate utils file)
function getCookieValue(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}
