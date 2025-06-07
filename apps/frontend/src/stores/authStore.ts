import { create } from "zustand";

type AuthStatus = "idle" | "checking" | "authenticated" | "unauthenticated";
import { IWebNewUserModel } from "@monorepo/shared/types/user.types";
interface AuthState {
  status: AuthStatus;
  isLoggedIn: boolean;
  user: IWebNewUserModel | null;
  checkAuth: () => Promise<void>;
  performLogout: () => void;
  login: (username: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), ms)
  );
  return Promise.race([promise, timeout]);
}

export const useAuthStore = create<AuthState>((set) => ({
  status: "idle",
  isLoggedIn: false,
  user: null,

  register: async (username, email, password) => {
    set({ status: "checking" });

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        set({
          isLoggedIn: true,
          status: "authenticated",
          user: data.user ?? null,
        });
        return true;
      } else {
        set({ isLoggedIn: false, status: "unauthenticated", user: null });
        return false;
      }
    } catch (err) {
      console.error("Registration failed:", err);
      set({ isLoggedIn: false, status: "unauthenticated", user: null });
      return false;
    }
  },

  login: async (username, password) => {
    set({ status: "checking" });

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const userData = await res.json();

        set({
          isLoggedIn: true,
          status: "authenticated",
          user: userData.user ?? null,
        });

        return true;
      } else {
        set({ isLoggedIn: false, status: "unauthenticated", user: null });
        return false;
      }
    } catch (err) {
      console.error("Login failed:", err);
      set({ isLoggedIn: false, status: "unauthenticated", user: null });
      return false;
    }
  },

  checkAuth: async () => {
    set({ status: "checking" });

    try {
      const res = await withTimeout(
        fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        }),
        10000
      );

      if (res.ok) {
        const data = await res.json();
        set({
          isLoggedIn: true,
          status: "authenticated",
          user: data.user ?? null,
        });
      } else {
        set({ isLoggedIn: false, status: "unauthenticated", user: null });
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      set({ isLoggedIn: false, status: "unauthenticated", user: null });
    }
  },

  performLogout: () => {
    // Fire-and-forget logout
    fetch("/api/auth/logout", { method: "POST" }).catch((err) =>
      console.error("Logout request failed:", err)
    );

    // Update UI immediately
    set({ isLoggedIn: false, status: "unauthenticated", user: null });
  },
}));
