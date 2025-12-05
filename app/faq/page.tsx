'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, LogIn, ChevronDown } from 'lucide-react';

export default function FAQPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState('FAQ');

  const navItems = ['Home', 'Tournament', 'Contact', 'About Us', 'FAQ'];

  const faqs = [
    {
      q: 'How do I join the LegendForge Tournament?',
      a: 'To join, simply register an account and navigate to the Tournament tab. You will need a full team before joining.'
    },
    {
      q: 'Is participation free?',
      a: 'Yes! Joining LegendForge tournaments is completely free for all players.'
    },
    {
      q: 'What are the tournament rules?',
      a: 'Rules will be listed under the Tournament page, including match structure, penalties, and fair play guidelines.'
    },
    {
      q: 'Can I join without a team?',
      a: 'Currently, you need a full 5-player team. Solo-queue tournaments will be added in the future.'
    }
  ];

  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0d12] text-white font-sans overflow-hidden relative">

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
                sizes="40px"
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
                    active === item
                      ? 'text-emerald-400'
                      : 'text-gray-300 hover:text-emerald-400'
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

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-gray-300 hover:text-emerald-400"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-[#0d1118] px-6 py-4 space-y-3 border-t border-emerald-500/30">
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
                  className={`block font-semibold ${
                    active === item
                      ? 'text-emerald-400'
                      : 'text-gray-300 hover:text-emerald-400'
                  }`}
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
            src="/lol1.jpg"
            alt="FAQ Background"
            fill
            priority
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d12]/60 to-[#0a0d12]" />
        </div>

        <div className="relative z-10">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-4">FREQUENTLY ASKED QUESTIONS</h2>
          <p className="text-emerald-400 font-semibold">
            <Link href="/" className="hover:text-purple-400">HOME</Link> • FAQ
          </p>
          <div className="mt-6 h-[6px] w-[120%] bg-purple-500 rotate-[-2deg] mx-auto" />
        </div>
      </section>

      {/* ===== FAQ Section ===== */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        {faqs.map((item, index) => (
          <div key={index} className="mb-4">
            <button
              onClick={() => setExpanded(expanded === index ? null : index)}
              className="w-full flex justify-between items-center bg-[#111827]/60 border border-purple-500/30 px-6 py-4 rounded-xl hover:border-purple-400 transition"
            >
              <span className="text-white font-semibold text-lg">{item.q}</span>
              <ChevronDown
                className={`w-6 h-6 text-purple-400 transition-transform ${
                  expanded === index ? 'rotate-180' : ''
                }`}
              />
            </button>

            {expanded === index && (
              <div className="bg-[#0f1623] border border-purple-500/20 mt-2 p-6 rounded-xl text-gray-300 text-sm">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* ===== Submit Question Form ===== */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h3 className="text-4xl font-bold text-white mb-10">DROP YOUR QUESTION</h3>

        <form className="space-y-6 bg-[#111827]/60 border border-purple-500/30 p-10 rounded-2xl shadow-xl">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-3 rounded-md bg-[#0d1118] border border-gray-600 text-white focus:border-purple-400 outline-none"
            required
          />

          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-3 rounded-md bg-[#0d1118] border border-gray-600 text-white focus:border-purple-400 outline-none"
            required
          />

          <textarea
            placeholder="Your Question"
            rows={5}
            className="w-full px-4 py-3 rounded-md bg-[#0d1118] border border-gray-600 text-white focus:border-purple-400 outline-none"
            required
          ></textarea>

          <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-md shadow-md transition hover:scale-105">
            Submit Now
          </button>
        </form>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-[#0a0d12] border-t border-emerald-500/30 text-gray-400 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 md:w-10 md:h-10">
              <Image src="/lol_logo.jpg" alt="LegendForge Logo" fill className="object-contain" />
            </div>
            <h2 className="text-xl font-bold">
              <span className="text-purple-400">Legend</span>Forge
            </h2>
          </div>

          <div className="flex gap-6 text-sm font-medium">
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
