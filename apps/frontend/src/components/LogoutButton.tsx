// components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useAuthStore } from "../stores/authStore";

export default function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const performLogout = useAuthStore((state) => state.performLogout);

  const handleLogout = async () => {
    await performLogout();

    startTransition(() => {
      router.push("/login");
    });
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
