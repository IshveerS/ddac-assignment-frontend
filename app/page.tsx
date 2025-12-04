'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from './context/AuthContext';

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState('Home');
  const { isAuthenticated, clearAuth } = useAuth();

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  const navItems = ['Home', 'Tournament', 'Contact', 'About Us', 'FAQ'];

  // 📰 Latest News Data
  const news = [
    {
      id: 1,
      title: 'LegendForge Championship 2025 Announcement',
      desc: 'write later',
      date: 'Nov 5, 2025',
      img: '/lol_worldcup.jpg',
    },
    {
      id: 2,
      title: 'LegendForge World 2025 Final Trailer',
      desc: 'write later',
      date: 'Nov 7, 2025',
      img: '/lol_worldtrailer.jpg',
    },
    {
      id: 3,
      title: 'LegendForge Carnival in Kuala Lumpur',
      desc: 'write later',
      date: 'Nov 12, 2025',
      img: '/lol_carnival.jpg',
    },
    {
      id: 4,
      title: 'LegendForge Carnival in Kuala Lumpur',
      desc: 'write later',
      date: 'Nov 12, 2025',
      img: '/lol_carnival.jpg',
    },
    {
      id: 5,
      title: 'LegendForge Carnival in Kuala Lumpur',
      desc: 'write later',
      date: 'Nov 12, 2025',
      img: '/lol_carnival.jpg',
    },
    {
      id: 6,
      title: 'LegendForge Carnival in Kuala Lumpur',
      desc: 'write later',
      date: 'Nov 12, 2025',
      img: '/lol_carnival.jpg',
    },
  ];

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
            {navItems.map((item) => {
              // Automatically generate route
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
                  className={`block font-semibold ${
                    active === item ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'
                  }`}
                >
                  {item}
                </Link>
              );
            })}
            <button className="w-full mt-2 flex items-center justify-center text-purple-400 border border-purple-400 px-4 py-2 rounded-md font-semibold hover:bg-purple-400 hover:text-black transition">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </button>
          </div>
        )}
      </header>

      {/* ===== Hero Section ===== */}
      <section className="relative flex items-center justify-center w-full min-h-screen px-6 pt-32 pb-16 overflow-hidden text-center">
        <div className="absolute inset-0">
          <Image
            src="/lol.jpg"
            alt="LegendForge Background"
            fill
            priority
            className="object-cover opacity-40"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#0a0d12]/60 via-[#0a0d12]/80 to-[#0a0d12]" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
          <span className="inline-block bg-purple-600/20 border border-purple-400 text-purple-300 px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-widest">
            E-Sport
          </span>

          <h2 className="text-5xl md:text-7xl font-black leading-tight">
            <span className="block text-white">LEGENDFORGE</span>
            <span className="block text-purple-400">TOURNAMENT</span>
          </h2>

          <p className="text-gray-300 text-lg max-w-xl">
            LegendForge is a 5V5 MOBA where teams battle to destroy the enemy Nexus.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-10 rounded-md text-lg shadow-lg transition-all hover:scale-105">
              GET STARTED
            </button>
            <button className="bg-transparent border border-purple-400 hover:bg-purple-500 hover:text-black text-purple-400 font-bold py-3 px-10 rounded-md text-lg shadow-lg transition-all hover:scale-105">
              LEARN MORE
            </button>
          </div>
        </div>
      </section>

      {/* ===== Welcome Players Section ===== */}
      <section className="relative w-full py-40 text-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/lol_join2.jpg"
            alt="Join LegendForge Background"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#0a0d12]/60 via-[#0a0d12]/80 to-[#0a0d12]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg">
            ARE YOU READY TO <span className="text-purple-400">Legend</span>Forge ?
          </h2>

          <p className="text-gray-300 text-lg md:text-xl mb-12 leading-relaxed">
            Step into the world of <span className="text-purple-400 font-semibold">LegendForge</span>,  
            where champions rise, legends are forged, and glory awaits those who fight together.
          <p>Form your dream team, enter the arena, and dominate the battlefield.</p>
          </p>
          
          <Link
            href="/tournament"
            className="bg-purple-500 hover:bg-purple-400 text-black font-bold py-3 px-12 rounded-md text-lg shadow-lg transition-all hover:scale-105 mb-20 inline-block"
          >
            JOIN TOURNAMENTS
          </Link>

          {/* Features Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-10">
            <div className="bg-[#111827]/60 border border-purple-500/30 hover:border-purple-400 rounded-xl p-8 shadow-lg transition-all hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]">
              <div className="text-4xl mb-4">🧑‍🤝‍🧑</div>
              <h3 className="text-xl font-bold text-white mb-2">GATHER YOUR TEAMMATES</h3>
              <p className="text-gray-400 text-sm">
                Team up with your friends and join community tournaments together!
              </p>
            </div>

            <div className="bg-[#111827]/60 border border-purple-500/30 hover:border-purple-400 rounded-xl p-8 shadow-lg transition-all hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">COMMUNITY TOURNAMENTS</h3>
              <p className="text-gray-400 text-sm">
                Become an organizer and help build the LegendForge community
              </p>
            </div>

            <div className="bg-[#111827]/60 border border-purple-500/30 hover:border-purple-400 rounded-xl p-8 shadow-lg transition-all hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-white mb-2">COMPETE FOR PRIZES</h3>
              <p className="text-gray-400 text-sm">
                You will soon be able to compete in tournaments and earn in-game rewards
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Latest News Section ===== */}
      <section className="relative bg-[#0b0f17] py-20 px-6 text-center">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-extrabold text-white mb-12">
            UPDATES <span className="text-purple-400">LATEST</span> NEWS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {news.map((item) => (
              <div
                key={item.id}
                className="bg-linear-to-b from-[#111827] to-[#0b0f17] rounded-xl overflow-hidden border border-purple-500/30 hover:border-purple-400 transition transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              >
                <div className="relative w-full h-56">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover opacity-90"
                  />
                </div>
                <div className="p-6 space-y-3 text-left">
                  <p className="text-xs text-gray-400">{item.date}</p>
                  <h4 className="text-lg font-bold text-white">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                  <a
                    href="#"
                    className="inline-block text-purple-400 hover:text-purple-300 text-sm font-semibold mt-2"
                  >
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Active Team Members Section ===== */}
      <section className="relative bg-[#0a0d12] py-24 px-6 text-center border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-14">
          <span className="text-purple-400">ACTIVE TEAM MEMBERS</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {/* Member 1 */}
            <div className="bg-linear-to-b from-[#111827] to-[#0b0f17] border border-purple-500/30 rounded-xl p-6 shadow-lg hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
              <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-purple-500/40 shadow-lg mb-6">
                <Image
                  src="/member.png"
                  alt="Team Member 1"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">IZZUL HAZIM BIN ZAHBA</h4>
              <p className="text-gray-400 text-sm">Project Manager & Backend Developer</p> 
            </div>

            {/* Member 2 */}
            <div className="bg-linear-to-b from-[#111827] to-[#0b0f17] border border-purple-500/30 rounded-xl p-6 shadow-lg hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
              <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-purple-500/40 shadow-lg mb-6">
                <Image
                  src="/member.png"
                  alt="Team Member 2"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">NG WEE SIANG</h4>
              <p className="text-gray-400 text-sm">Frontend Developer</p>
            </div>

            {/* Member 3 */}
            <div className="bg-linear-to-b from-[#111827] to-[#0b0f17] border border-purple-500/30 rounded-xl p-6 shadow-lg hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
              <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-purple-500/40 shadow-lg mb-6">
                <Image
                  src="/member.png"
                  alt="Team Member 3"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">ISHVEER SINGH A/L PRDEEP SINGH</h4>
              <p className="text-gray-400 text-sm">Frontend Developer</p>
            </div>

            {/* Member 4 */}
            <div className="bg-linear-to-b from-[#111827] to-[#0b0f17] border border-purple-500/30 rounded-xl p-6 shadow-lg hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
              <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-purple-500/40 shadow-lg mb-6">
                <Image
                  src="/member.png"
                  alt="Team Member 4"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">PRAVEEN VARMAN A/L SELVANATHAN</h4>
              <p className="text-gray-400 text-sm">Backend Developer</p>
            </div>
          </div>
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








