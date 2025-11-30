'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Simple password match validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');

    console.log('Register submitted:', { username, email, password });

    // Example backend route call
    // await fetch('/api/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username, email, password }),
    // });
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

      {/* === Register Form === */}
      <div className="relative z-20 bg-[#111827]/80 border border-purple-500/30 rounded-2xl shadow-lg p-10 w-[90%] max-w-md backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Register <span className="text-purple-400">LegendForge</span> Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-6">
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

          {/* Email */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md bg-[#0d1118]/80 border border-gray-600 text-white focus:border-purple-400 focus:outline-none"
              placeholder="Enter your email"
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
              placeholder="Create a password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md bg-[#0d1118]/80 border border-gray-600 text-white focus:border-purple-400 focus:outline-none"
              placeholder="Re-enter your password"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-400 text-sm font-semibold text-center">{error}</p>}

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-md shadow-md transition-all hover:scale-105"
          >
            Register
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
            Login here
          </Link>
        </p>

        {/* ✅ Add this new section */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-block text-purple-400 hover:text-purple-300 font-semibold border border-purple-400 px-5 py-2 rounded-md hover:bg-purple-500/20 transition-all"
          >
            Home 🏠︎
          </Link>
        </div>
      </div>
    </div>
  );
}
