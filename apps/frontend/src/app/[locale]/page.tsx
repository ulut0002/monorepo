"use client";

import { useEffect, useState } from "react";
import { useT } from "../../hooks/useT"; // or "@/utils/i18n" etc.
import { User } from "@shared/types";
import LoginForm from "../components/auth/LoginForm";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const t = useT("ProjectStructure"); // simpler and readable

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/test/user`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
      });
  }, []);

  return (
    <main className='p-8 text-center flex flex-col items-center'>
      <h1 className='text-4xl font-bold text-blue-600'>{t("title")}</h1>
      {user ? (
        <p className='mt-4 text-xl'>
          Hello, {user.name} ({user.email})
        </p>
      ) : (
        <p className='mt-4 text-gray-500'>Loading user...</p>
      )}

      <div className='mt-8 w-full max-w-md'>
        <LoginForm />
      </div>
    </main>
  );
}
