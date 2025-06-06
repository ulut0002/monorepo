// components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useAuthStore } from "../stores/authStore";
import { Spinner } from "./Spinner";

export default function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const performLogout = useAuthStore((state) => state.performLogout);

  const handleLogout = () => {
    startTransition(() => {
      performLogout(); // fire-and-forget
      router.replace("/login"); // ⏩ replaces history
    });
  };

  return (
    <button
      onClick={handleLogout}
      className='mt-4 flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50'
      disabled={isPending}
    >
      {isPending && <Spinner loading={true} />}
      Logout
    </button>
  );
}
