'use client';

import { useAuth } from '../context/AuthContext';
import { Menu, X, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function NavBar({ navItems }: { navItems: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState('Home');
  const { isAuthenticated, clearAuth } = useAuth();

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-[#0a0d12]/90 backdrop-blur-md border-b border-emerald-500/30 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 md:w-12 md:h-12">
            <img
              src="/lol_logo.jpg"
              alt="LegendForge Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            <span className="text-purple-400">Legend</span>
            <span className="text-white">Forge</span>
          </h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
          {navItems.map((item) => {
            const path =
              item === 'Home'
                ? '/'
                : item === 'Contact'
                ? '/contactus'
                : `/${item.toLowerCase().replace(/\s+/g, '')}`;

            return (
              <Link
                key={item}
                href={path}
                onClick={() => setActive(item)}
                className={`relative transition-all group ${
                  active === item ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'
                }`}
              >
                {item}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-emerald-400 transition-all ${
                    active === item ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                ></span>
              </Link>
            );
          })}
        </nav>

        {/* Sign In / Logout button */}
        <div className="hidden md:flex items-center space-x-2">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center text-red-400 border border-red-400 px-4 py-2 rounded-md font-semibold hover:bg-red-400 hover:text-black transition"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center text-purple-400 border border-purple-400 px-4 py-2 rounded-md font-semibold hover:bg-purple-400 hover:text-black transition"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-300 hover:text-emerald-400"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0d1118] border-t border-emerald-500/30 px-6 py-4 space-y-3">
          {navItems.map((item) => {
            const path =
              item === 'Home'
                ? '/'
                : item === 'Contact'
                ? '/contactus'
                : `/${item.toLowerCase().replace(/\s+/g, '')}`;

            return (
              <Link
                key={item}
                href={path}
                onClick={() => setActive(item)}
                className="block text-gray-300 hover:text-emerald-400 transition"
              >
                {item}
              </Link>
            );
          })}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center text-red-400 border border-red-400 px-4 py-2 rounded-md font-semibold hover:bg-red-400 hover:text-black transition mt-4"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="block text-center text-purple-400 border border-purple-400 px-4 py-2 rounded-md font-semibold hover:bg-purple-400 hover:text-black transition mt-4"
            >
              <span className="flex items-center justify-center">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
