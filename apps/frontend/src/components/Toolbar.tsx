// components/Toolbar.tsx
"use client";

import Link from "next/link";
import { useEffect } from "react";
import LogoutButton from "./LogoutButton";
import { useAuthStore } from "../stores/authStore";

export default function Toolbar() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <header className='w-full p-4 bg-gray-100 border-b flex justify-between items-center'>
      <div className='text-lg font-bold'>MyApp</div>
      <div className='space-x-4'>
        {isLoggedIn === null ? null : isLoggedIn ? (
          <LogoutButton />
        ) : (
          <>
            <Link href='/login' className='text-blue-600 hover:underline'>
              Login
            </Link>
            <Link href='/register' className='text-blue-600 hover:underline'>
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
