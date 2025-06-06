"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "apps/frontend/src/stores/authStore";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(form.username, form.password);
    if (success) {
      router.replace("/dashboard"); // faster than window.location.href
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded-lg shadow-md w-full max-w-sm'
      >
        <h2 className='text-2xl font-semibold mb-4'>Login</h2>

        <input
          type='text'
          placeholder='Username'
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className='w-full p-2 border border-gray-300 rounded mb-3'
        />

        <input
          type='password'
          placeholder='Password'
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className='w-full p-2 border border-gray-300 rounded mb-4'
        />

        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700'
        >
          Login
        </button>

        <p className='mt-4 text-sm text-center'>
          Don&apos;t have an account?{" "}
          <Link href='/register' className='text-green-600 hover:underline'>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
