'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setAccessToken } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        setError(text || 'Login failed');
        return;
      }

      const data = await res.json();
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
        window.location.href = '/';
      } else {
        setError('Login failed (no token returned)');
      }
    } catch (err) {
      setError('Login request failed');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0d12] relative overflow-hidden">
      {/* === Video Background === */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/lol_video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-b from-[#0a0d12]/60 via-[#0a0d12]/70 to-[#0a0d12]/80 z-10" />
      </div>

      {/* === Login Form === */}
      <div className="relative z-10 bg-[#111827]/80 border border-purple-500/30 rounded-2xl shadow-lg p-10 w-[90%] max-w-md backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Welcome Back <span className="text-purple-400">LegendForge</span>
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md bg-[#0d1118]/80 border border-gray-600 text-white focus:border-purple-400 focus:outline-none"
              placeholder="Enter your username"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md bg-[#0d1118]/80 border border-gray-600 text-white focus:border-purple-400 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-md shadow-md transition-all hover:scale-105"
          >
            Sign In
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-purple-400 hover:text-purple-300 font-semibold">
            Register here
          </Link>
        </p>

        {/* Home button */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-block text-purple-400 hover:text-purple-300 font-semibold border border-purple-400 px-5 py-2 rounded-md hover:bg-purple-500/20 transition-all"
          >
            Home 🏠
          </Link>
        </div>
      </div>
    </div>
  );
}
