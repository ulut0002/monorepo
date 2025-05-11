"use client";

import { useState } from "react";
import axios from "axios";
import { Mail, Lock, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginHref = `/auth/login`;

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      await axios.post("/api/auth/register", {
        email,
        password,
        username,
      });

      window.location.href = "/";
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Registration failed");
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <div className='text-red-500 text-sm mb-4'>{error}</div>}
      <div className='space-y-4'>
        <div className='flex items-center border px-3 py-2 rounded-md'>
          <User className='w-5 h-5 text-gray-400 mr-2' />
          <input
            className='w-full outline-none'
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className='flex items-center border px-3 py-2 rounded-md'>
          <Mail className='w-5 h-5 text-gray-400 mr-2' />
          <input
            className='w-full outline-none'
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='flex items-center border px-3 py-2 rounded-md'>
          <Lock className='w-5 h-5 text-gray-400 mr-2' />
          <input
            className='w-full outline-none'
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full py-2 rounded-md text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <p className='text-center text-sm mt-4'>
          Already have an account?{" "}
          <Link href={loginHref} className='text-blue-600'>
            Login
          </Link>
        </p>
      </div>
    </>
  );
}
