// components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      // Redirect to login or home
      startTransition(() => {
        router.push("/login");
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className='mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50'
      disabled={isPending}
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}
