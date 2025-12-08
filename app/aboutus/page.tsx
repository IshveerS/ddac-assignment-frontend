'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Users, Target, Rocket } from 'lucide-react';

const NavBar = dynamic(() => import('../components/NavBar').then((mod) => mod.NavBar), {
  ssr: false,
  loading: () => null,
});

export default function AboutUs() {
  const navItems = ['Home', 'Tournament', 'Contact', 'About Us', 'FAQ'];

  return (
    <div className="min-h-screen bg-[#0a0d12] text-white font-sans overflow-hidden relative">
      {/* ===== Navbar ===== */}
      <NavBar navItems={navItems} />

      {/* ===== Hero Section ===== */}
      <section className="relative flex items-center justify-center w-full h-[60vh] px-6 pt-32 pb-16 overflow-hidden text-center">
        <div className="absolute inset-0">
          <Image
            src="/lol1.jpg"
            alt="About Background"
            fill
            priority
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#0a0d12]/60 to-[#0a0d12]" />
        </div>

        <div className="relative z-10 text-center">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-4">ABOUT US</h2>
          <p className="text-emerald-400 font-semibold">
            <Link href="/" className="hover:text-purple-400">
              HOME
            </Link>{' '}
            • ABOUT US
          </p>
          <div className="mt-6 h-1.5 w-[120%] bg-purple-500 transform rotate-[-2deg] mx-auto" />
        </div>
      </section>

      {/* ===== About Section ===== */}
      <section className="relative bg-[#0a0d12] py-20 px-6 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-4xl font-extrabold mb-6">WE ARE ORGANIZER AND DEVELOPER LEGENDFORGE</h3>
          <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
            LegendForge is a passionate team of gamers and developers who aim to bring competitive
            gaming communities together through immersive e-sport experiences. We organize and
            manage high-intensity tournaments designed to test teamwork, creativity, and strategy.
          </p>
        </div>

        {/* Vision + Mission */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16 max-w-6xl mx-auto">
          <div className="bg-[#111827]/60 border border-purple-500/30 rounded-xl p-8 text-center hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition">
            <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2">Our Team</h4>
            <p className="text-gray-400 text-sm">
              A diverse group of players, coders, and event organizers who share one mission — to
              elevate the gaming scene.
            </p>
          </div>

          <div className="bg-[#111827]/60 border border-purple-500/30 rounded-xl p-8 text-center hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition">
            <Target className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2">Our Vision</h4>
            <p className="text-gray-400 text-sm">
              To be the leading e-sport platform that empowers new talents and builds a thriving
              gaming ecosystem across regions.
            </p>
          </div>

          <div className="bg-[#111827]/60 border border-purple-500/30 rounded-xl p-8 text-center hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition">
            <Rocket className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2">Our Mission</h4>
            <p className="text-gray-400 text-sm">
              To connect players and teams through world-class tournaments, fair play, and modern
              gaming technology.
            </p>
          </div>
        </div>

        {/* Join Us Button */}
        <div className="text-center mt-16">
          <Link
            href="/contactus"
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-10 rounded-md shadow-lg transition-all hover:scale-105"
          >
            Join Us
          </Link>
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
