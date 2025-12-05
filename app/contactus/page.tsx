'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, LogIn, Phone, Mail, MapPin } from 'lucide-react';

export default function ContactUs() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState('Contact');

  const navItems = ['Home', 'Tournament', 'Contact', 'About Us', 'FAQ'];

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
                sizes="(max-width: 768px) 40px, 60px"
                priority
              />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              <span className="text-purple-400">Legend</span>
              <span className="text-white">Forge</span>
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
            {navItems.map((item) => (
              <Link
                key={item}
                href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '')}`}
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
            ))}
          </nav>

          {/* Sign In */}
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

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-[#0d1118] border-t border-emerald-500/30 px-6 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item}
                href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '')}`}
                onClick={() => setActive(item)}
                className={`block font-semibold ${
                  active === item ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'
                }`}
              >
                {item}
              </Link>
            ))}
            <Link
              href="/login"
              className="w-full flex items-center justify-center text-purple-400 border border-purple-400 px-4 py-2 rounded-md font-semibold hover:bg-purple-400 hover:text-black transition"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Link>
          </div>
        )}
      </header>

      {/* ===== Hero Section ===== */}
      <section className="relative flex items-center justify-center w-full h-[60vh] px-6 pt-32 pb-16 overflow-hidden text-center">
        <div className="absolute inset-0">
          <Image
            src="/lol_carnival.jpg"
            alt="Contact Background"
            fill
            priority
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#0a0d12]/60 to-[#0a0d12]" />
        </div>

        <div className="relative z-10 text-center">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-4">CONTACT US</h2>
          <p className="text-emerald-400 font-semibold">
            <Link href="/" className="hover:text-purple-400">
              HOME
            </Link>{' '}
            • CONTACT
          </p>
          <div className="mt-6 h-1.5 w-[120%] bg-purple-500 transform rotate-[-2deg] mx-auto" />
        </div>
      </section>

      {/* ===== Contact Info + Form Section ===== */}
      <section className="relative bg-[#0a0d12] py-20 px-6 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Left Info */}
          <div>
            <h3 className="text-4xl font-extrabold mb-6">CONTACT US AND FIND YOUR LegendForge</h3>
            <p className="text-gray-400 mb-10 leading-relaxed">
              Have questions or want to collaborate with us? Reach out through any of the channels
              below, or send us a message directly. We are always ready to connect with our players
              and partners.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Phone className="text-purple-400 w-6 h-6" />
                <p className="text-gray-300">+60 12-345 6789</p>
              </div>

              <div className="flex items-center space-x-4">
                <Mail className="text-purple-400 w-6 h-6" />
                <p className="text-gray-300">support@legendforge.com</p>
              </div>

              <div className="flex items-center space-x-4">
                <MapPin className="text-purple-400 w-6 h-6" />
                <p className="text-gray-300">Asia Pacific University of Technology & Innovation, Bukit Jalil, Kuala Lumpur</p>
              </div>
            </div>
          </div>

          {/* Right Contact Form */}
          <form className="space-y-6 bg-[#111827]/80 border border-purple-500/30 p-8 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Name *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-md bg-[#0d1118] border border-gray-600 text-white focus:border-purple-400 focus:outline-none"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-md bg-[#0d1118] border border-gray-600 text-white focus:border-purple-400 focus:outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Comment *</label>
              <textarea
                rows={5}
                className="w-full px-4 py-3 rounded-md bg-[#0d1118] border border-gray-600 text-white focus:border-purple-400 focus:outline-none resize-none"
                placeholder="Write your message here"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-10 rounded-md shadow-md transition-all hover:scale-105"
            >
              Submit Now
            </button>
          </form>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="relative bg-[#0a0d12] border-t border-emerald-500/30 text-gray-400 py-10 px-6 z-10 shadow-[0_-4px_30px_rgba(16,185,129,0.15)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 md:w-10 md:h-10">
              <Image
                src="/lol_logo.jpg"
                alt="LegendForge Logo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 40px, 60px"
              />
            </div>
            <h2 className="text-xl font-bold text-white">
              <span className="text-purple-400">Legend</span>Forge
            </h2>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-medium">
            {['PRIVACY POLICY', 'TERMS OF SERVICE', 'RULES OF CONDUCT'].map((link) => (
              <a
                key={link}
                href="#"
                className="relative group text-gray-400 hover:text-emerald-400 transition-all"
              >
                {link}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all"></span>
              </a>
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
