"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      window.location.href = "/dashboard";
    } else {
      alert("Registration failed");
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded-lg shadow-md w-full max-w-sm'
      >
        <h2 className='text-2xl font-semibold mb-4'>Register</h2>

        <input
          type='text'
          placeholder='Username'
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className='w-full p-2 border border-gray-300 rounded mb-3'
        />

        <input
          type='email'
          placeholder='Email'
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
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
          className='w-full bg-green-600 text-white py-2 rounded hover:bg-green-700'
        >
          Register
        </button>

        <p className='mt-4 text-sm text-center'>
          Already have an account?{" "}
          <Link href='/login' className='text-blue-600 hover:underline'>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
