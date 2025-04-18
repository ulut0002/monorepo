"use client";

import { useEffect, useState } from "react";
import { useT } from "../../hooks/useT"; // or "@/utils/i18n" etc.
import { User } from "@shared/types";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const t = useT("ProjectStructure"); // simpler and readable

  useEffect(() => {
    fetch("http://localhost:4000/api/health")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
      })
      .catch((err) => {});
  }, []);

  return (
    <main className='p-8 text-center'>
      <h1 className='text-4xl font-bold text-blue-600'>{t("title")}</h1>
      {user ? (
        <p className='mt-4 text-xl'>
          Hello, {user.name} ({user.email})
        </p>
      ) : (
        <p className='mt-4 text-gray-500'>Loading user...</p>
      )}
    </main>
  );
}
