"use client";

import { useState } from "react";
import axios from "axios";
import { Mail, Lock, User } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // Added
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await axios.post("/api/auth/login", {
        email,
        username,
        password,
      });

      // Redirect on success
      window.location.href = "/dashboard";
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Login failed");
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <div className='text-red-500 text-sm mb-4'>{error}</div>}
      <div className='space-y-4'>
        {/* Username */}
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

        {/* Email */}
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

        {/* Password */}
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

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-2 rounded-md text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Link */}
        <p className='text-center text-sm mt-4'>
          Don&apos;t have an account?{" "}
          <Link href={`/auth/register`} className='text-blue-600'>
            Register
          </Link>
        </p>
      </div>
    </>
  );
}
