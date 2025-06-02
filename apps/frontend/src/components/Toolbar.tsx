"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";

export default function Toolbar() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        setIsLoggedIn(res.ok);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <header className='w-full p-4 bg-gray-100 border-b flex justify-between items-center'>
      <div className='text-lg font-bold'>MyApp</div>
      <div className='space-x-4'>
        {isLoggedIn === null ? null : isLoggedIn ? (
          <LogoutButton onLogout={() => setIsLoggedIn(false)} />
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
