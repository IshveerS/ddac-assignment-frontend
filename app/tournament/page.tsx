'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, LogIn, Calendar, Clock } from 'lucide-react';

export default function TournamentPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState('Tournament');
  const [successMessage, setSuccessMessage] = useState('');

  const navItems = ['Home', 'Tournament', 'Contact', 'About Us', 'FAQ'];

  // Example tournament list (You can edit/add more)
  const tournaments = [
    {
      id: 1,
      title: 'LegendForge Championship Qualifier',
      date: 'December 10, 2025',
      time: '7:00 PM',
      status: 'Open',
      img: '/lol_worldcup.jpg',
    },
    {
      id: 2,
      title: '5V5 MOBA Clash Cup',
      date: 'December 20, 2025',
      time: '8:30 PM',
      status: 'Open',
      img: '/lol.jpg',
    },
    {
      id: 3,
      title: 'LegendForge Regional Battle',
      date: 'January 5, 2026',
      time: '6:30 PM',
      status: 'Coming Soon',
      img: '/lol_worldtrailer.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0d12] text-white font-sans">

      {/* ===== Navbar ===== */}
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
              />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              <span className="text-purple-400">Legend</span>Forge
            </h1>
          </div>

          {/* Desktop Navigation */}
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
                  className={`relative transition-all group ${
                    active === item ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'
                  }`}
                >
                  {item}
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 bg-emerald-400 transition-all ${
                      active === item ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Login Button */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              href="/login"
              className="flex items-center text-purple-400 border border-purple-400 px-4 py-2 rounded-md font-semibold hover:bg-purple-400 hover:text-black transition"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-300 hover:text-emerald-400"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-[#0d1118] px-6 py-4 border-t border-emerald-500/30">
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
                  className="block py-2 text-gray-300 hover:text-emerald-400 font-semibold"
                >
                  {item}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* ===== Hero Section ===== */}
      <section className="relative flex items-center justify-center w-full h-[55vh] px-6 pt-32 text-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/lol.jpg"
            alt="Tournament Background"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d12]/60 to-[#0a0d12]" />
        </div>

        <div className="relative z-10">
          <h2 className="text-5xl md:text-6xl font-extrabold">TOURNAMENTS</h2>
          <p className="text-emerald-400 font-semibold mt-2">
            <Link href="/" className="hover:text-purple-400">HOME</Link> • TOURNAMENT
          </p>
          <div className="mt-6 h-[6px] w-[120%] bg-purple-500 rotate-[-2deg] mx-auto" />
        </div>
      </section>

      {/* ===== Tournament List ===== */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h3 className="text-4xl font-extrabold text-center mb-12">AVAILABLE TOURNAMENTS</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {tournaments.map((t) => (
            <div
              key={t.id}
              className="bg-[#111827]/60 border border-purple-500/30 rounded-xl shadow-lg hover:border-purple-400 transition hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] overflow-hidden"
            >
              <div className="relative h-40 w-full">
                <Image src={t.img} alt={t.title} fill className="object-cover" />
              </div>

              <div className="p-6">
                <h4 className="text-xl font-bold mb-2">{t.title}</h4>

                <p className="flex items-center text-gray-300 gap-2">
                  <Calendar className="w-5 h-5 text-purple-400" /> {t.date}
                </p>

                <p className="flex items-center text-gray-300 gap-2 mt-1">
                  <Clock className="w-5 h-5 text-purple-400" /> {t.time}
                </p>

                <p className="mt-2 text-sm font-semibold text-purple-300">
                  Status: {t.status}
                </p>

                <button
                onClick={() => {
                    if (t.status === 'Open') {
                    setSuccessMessage(`${t.title} — Joined Successfully!`);
                    }
                }}
                className={`mt-6 w-full py-3 rounded-md font-bold transition ${
                    t.status === 'Open'
                    ? 'bg-purple-600 hover:bg-purple-500'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
                >
                {t.status === 'Open' ? 'Join Tournament' : 'Coming Soon'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Success Popup ===== */}
        {successMessage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999] animate-fadeIn">
            <div className="bg-[#111827] border border-purple-400 rounded-xl p-8 w-[90%] max-w-md text-center shadow-xl">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">SUCCESS 🎉</h3>

            <p className="text-gray-300 mb-6">{successMessage}</p>

            <button
                onClick={() => setSuccessMessage('')}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-8 rounded-md transition"
            >
                OK
            </button>
            </div>
        </div>
        )}

      {/* ===== Footer ===== */}
      <footer className="bg-[#0a0d12] border-t border-emerald-500/30 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 md:w-10 md:h-10">
              <Image src="/lol_logo.jpg" fill className="object-contain" alt="LegendForge Logo" />
            </div>
            <h2 className="text-xl font-bold"><span className="text-purple-400">Legend</span>Forge</h2>
          </div>

          <div className="flex gap-6 text-sm">
            {['PRIVACY POLICY', 'TERMS OF SERVICE', 'RULES OF CONDUCT'].map((l) => (
              <a key={l} href="#" className="hover:text-emerald-400">{l}</a>
            ))}
          </div>

          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} LegendForge. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
