import { create } from "zustand";

type AuthStatus = "idle" | "checking" | "authenticated" | "unauthenticated";

interface AuthState {
  status: AuthStatus;
  isLoggedIn: boolean;
  user: any | null;
  checkAuth: () => Promise<void>;
  performLogout: () => void;
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
