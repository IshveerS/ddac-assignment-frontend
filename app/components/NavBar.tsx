'use client';

import { useAuth } from '../context/AuthContext';
import { Menu, X, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export function NavBar({ navItems }: { navItems: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, clearAuth, role, isAdmin, isOrganizer } = useAuth();

  const resolvePath = (item: string) => {
    if (item === 'Home') return '/';
    if (item === 'Contact') return '/contactus';
    return `/${item.toLowerCase().replace(/\s+/g, '')}`;
  };

  const isActive = (item: string) => {
    const path = resolvePath(item);
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(`${path}/`);
  };

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
            <Image
              src="/lol_logo.jpg"
              alt="LegendForge Logo"
              fill
              className="object-contain"
              sizes="48px"
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
            const path = resolvePath(item);
            const active = isActive(item);
            return (
              <Link
                key={item}
                href={path}
                className={`relative transition-all group ${
                  active ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'
                }`}
              >
                {item}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-emerald-400 transition-all ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                ></span>
              </Link>
            );
          })}
          {isAuthenticated && (
            <>
              <Link
                href="/profile"
                className={`relative transition-all group ${
                  pathname === '/profile' ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'
                }`}
              >
                Profile
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-emerald-400 transition-all ${
                    pathname === '/profile' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                ></span>
              </Link>
            </>
          )}
          {(isAdmin || isOrganizer) && (
            <Link
              href="/console"
              className={`relative transition-all group ${
                pathname === '/console' ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'
              }`}
            >
              Console
              <span
                className={`absolute left-0 -bottom-1 h-0.5 bg-emerald-400 transition-all ${
                  pathname === '/console' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              ></span>
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              className={`relative transition-all group ${
                pathname === '/admin' ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'
              }`}
            >
              Admin
              <span
                className={`absolute left-0 -bottom-1 h-0.5 bg-emerald-400 transition-all ${
                  pathname === '/admin' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              ></span>
            </Link>
          )}
          {isOrganizer && (
            <Link
              href="/organizer"
              className={`relative transition-all group ${
                pathname === '/organizer' ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'
              }`}
            >
              Organizer
              <span
                className={`absolute left-0 -bottom-1 h-0.5 bg-emerald-400 transition-all ${
                  pathname === '/organizer' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              ></span>
            </Link>
          )}
        </nav>

        {/* Sign In / Logout button */}
        <div className="hidden md:flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              {role && (
                <span className="text-xs uppercase tracking-wide text-emerald-300 border border-emerald-400/50 px-2 py-1 rounded-full">
                  {role}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center text-red-400 border border-red-400 px-4 py-2 rounded-md font-semibold hover:bg-red-400 hover:text-black transition"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </>
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
            const path = resolvePath(item);
            return (
              <Link
                key={item}
                href={path}
                onClick={() => setIsOpen(false)}
                className="block text-gray-300 hover:text-emerald-400 transition"
              >
                {item}
              </Link>
            );
          })}
          {isAuthenticated && (
            <>
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="block text-gray-300 hover:text-emerald-400 transition"
              >
                Profile
              </Link>
            </>
          )}
          {(isAdmin || isOrganizer) && (
            <Link
              href="/console"
              onClick={() => setIsOpen(false)}
              className="block text-gray-300 hover:text-emerald-400 transition"
            >
              Console
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="block text-gray-300 hover:text-emerald-400 transition"
            >
              Admin Dashboard
            </Link>
          )}
          {isOrganizer && (
            <Link
              href="/organizer"
              onClick={() => setIsOpen(false)}
              className="block text-gray-300 hover:text-emerald-400 transition"
            >
              Organizer Dashboard
            </Link>
          )}
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
