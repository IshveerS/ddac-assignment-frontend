'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Trophy, Calendar } from 'lucide-react';

// Dynamically import NavBar to avoid SSR issues
const NavBar = dynamic(() => import('../components/NavBar').then(mod => mod.NavBar), {
  ssr: false,
  loading: () => null,
});

export default function PastResultsPage() {
  const navItems = ['Home', 'Tournament', 'PastResult', 'Contact', 'About Us', 'FAQ'];

  // ⭐ Past Tournament Results
  const pastResults = [
    {
      id: 1,
      title: 'LegendForge Grand Championship 2025',
      winner: 'Team Aetherstrike',
      date: 'February 12, 2025',
      img: '/lol_join2.jpg',
      description: 'An intense final match featuring the best teams in the region.',
    },
    {
      id: 2,
      title: 'Intermediate Clash Cup 2025',
      winner: 'Shadow Reapers',
      date: 'January 20, 2025',
      img: '/lol_join2.jpg',
      description: 'A strategic and fast-paced tournament ending with a dramatic victory.',
    },
    {
      id: 3,
      title: 'Beginner Starter Cup 2025',
      winner: 'Rising Guardians',
      date: 'January 5, 2025',
      img: '/lol_join2.jpg',
      description: 'New players showcased impressive potential in this thrilling opener.',
    },
    {
      id: 4,
      title: 'Spring Split Playoffs 2024',
      winner: 'Crimson Vanguard',
      date: 'December 18, 2024',
      img: '/lol_join2.jpg',
      description: 'A thrilling playoff battle with unexpected upsets and incredible plays.',
    },
    {
      id: 5,
      title: 'Winter Warriors Tournament',
      winner: 'Frost Legends',
      date: 'December 1, 2024',
      img: '/lol_join2.jpg',
      description: 'Winter championship showcasing exceptional team coordination and strategy.',
    },
    {
      id: 6,
      title: 'Autumn Tournament Series',
      winner: 'Phoenix Rising',
      date: 'November 10, 2024',
      img: '/lol_join2.jpg',
      description: 'An epic series spanning three weekends with memorable matches.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0d12] text-white font-sans">
      {/* Navigation */}
      <NavBar navItems={navItems} />

      {/* Hero Section */}
      <section className="relative flex items-center justify-center w-full h-[50vh] px-6 pt-32 text-center overflow-hidden">
        <Image
          src="/past_results_bg.jpg"
          alt="Past Results Background"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d12]/60 to-[#0a0d12]" />

        <div className="relative z-10">
          <h2 className="text-5xl md:text-6xl font-extrabold">PAST RESULTS</h2>
          <p className="text-emerald-400 font-semibold mt-2">
            <Link href="/">HOME</Link> • PAST RESULTS
          </p>
          <div className="mt-6 h-[6px] w-[120%] bg-purple-500 rotate-[-2deg] mx-auto" />
        </div>
      </section>

      {/* Results List */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h3 className="text-4xl font-extrabold text-center mb-12">
          PREVIOUS TOURNAMENT WINNERS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {pastResults.map((r) => (
            <div
              key={r.id}
              className="bg-[#111827]/60 border border-purple-500/30 rounded-xl shadow-lg hover:border-purple-400 transition overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="relative h-48 w-full">
                <Image src={r.img} alt={r.title} fill className="object-cover" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h4 className="text-xl font-bold text-white mb-2">{r.title}</h4>

                <p className="flex items-center text-gray-300 gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" /> Winner: {r.winner}
                </p>

                <p className="flex items-center text-gray-300 gap-2 mt-1">
                  <Calendar className="w-5 h-5 text-purple-400" /> {r.date}
                </p>

                <p className="text-gray-400 mt-3 text-sm">{r.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0d12] border-t border-purple-500/30 text-gray-400 py-10 text-center">
        © {new Date().getFullYear()} LegendForge. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}
