'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NavBar = dynamic(() => import('../components/NavBar').then((mod) => mod.NavBar), {
  ssr: false,
  loading: () => null,
});

export default function FAQPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const { isAdmin, isOrganizer } = useAuth();

  const navItems = ['Home', 'Tournament', 'PastResult', 'Contact', 'About Us', 'FAQ'];

  const roles = [
    {
      name: 'Admin',
      focus: 'System authority and policy guardrail',
      duties: [
        'Approve or reject player and team account creation plus role assignments.',
        'Set and enforce platform rules, permissions, and escalation paths.',
        'Audit compliance, handle reports, and apply penalties for misconduct.',
        'Maintain data integrity: access reviews, backups, retention, and exports.'
      ]
    },
    {
      name: 'Organizer',
      focus: 'Tournament operations owner',
      duties: [
        'Create tournaments, set formats and rules, and publish announcements.',
        'Approve or reject team registrations; enforce caps and eligibility.',
        'Seed brackets, publish schedules, and update brackets after results.',
        'Verify match results, resolve disputes, and post official standings.'
      ]
    },
    {
      name: 'Shared',
      focus: 'Collaboration zone',
      duties: [
        'Coordinate communications for schedules, bracket updates, and results.',
        'Manage fair-play incidents and sanctions across events.',
        'Archive results and performance reports for teams and players.'
      ]
    }
  ];

  const faqs = [
    {
      q: 'How do I join the LegendForge Tournament?',
      a: 'Register an account, build a full team, then head to the Tournament tab to enroll.'
    },
    {
      q: 'Is participation free?',
      a: 'Yes. Joining LegendForge tournaments is completely free for all players.'
    },
    {
      q: 'What are the tournament rules?',
      a: 'Rules live on the Tournament page and cover match structure, penalties, and fair play.'
    },
    {
      q: 'Can I join without a team?',
      a: 'You currently need a full 5-player team. Solo-queue events will come later.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0d12] text-white font-sans overflow-hidden relative">
      {/* ===== Navbar ===== */}
      <NavBar navItems={navItems} />

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
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
            {(isAdmin || isOrganizer) ? 'Admin + Organizer FAQ' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-emerald-400 font-semibold">
            <Link href="/" className="hover:text-purple-400">Home</Link> / FAQ
          </p>
          <div className="mt-6 h-[6px] w-[120%] bg-purple-500 rotate-[-2deg] mx-auto" />
        </div>
      </section>

      {/* ===== Admin + Organizer Roles ===== */}
      {(isAdmin || isOrganizer) && (
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Admin + Organizer</p>
            <h3 className="text-4xl font-extrabold text-white mt-2">Who owns what?</h3>
            <p className="text-gray-300 mt-3 max-w-2xl">
              Clear boundaries keep tournaments smooth. Use this quick playbook to see how platform authority
              (Admin) and operations (Organizer) divide and share work.
            </p>
          </div>
          <div className="bg-[#0f1623] border border-purple-500/30 rounded-2xl px-5 py-4 text-sm text-gray-200 shadow-lg">
            <p className="font-semibold text-white">Context snapshot</p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Admin governs accounts, permissions, and compliance.</li>
              <li>Organizer runs tournaments end-to-end and validates results.</li>
              <li>Both align on comms, fair play, and historical records.</li>
            </ul>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {roles.map((role) => (
            <div
              key={role.name}
              className="bg-gradient-to-br from-[#111827] to-[#0d1118] border border-purple-500/30 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-2xl font-bold text-white">{role.name}</h4>
                <span className="text-xs text-emerald-300 border border-emerald-400/50 px-2 py-1 rounded-full uppercase tracking-wide">
                  {role.focus}
                </span>
              </div>
              <ul className="mt-4 space-y-3 text-gray-200 text-sm">
                {role.duties.map((duty, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-purple-400">-</span>
                    <span>{duty}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* ===== FAQ Section ===== */}
      {!(isAdmin || isOrganizer) && (
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
      )}

      {/* ===== Submit Question Form ===== */}
      {!(isAdmin || isOrganizer) && (
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h3 className="text-4xl font-bold text-white mb-10">Drop your question</h3>

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
      )}

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
            {['PRIVACY POLICY', 'TERMS OF SERVICE', 'RULES OF CONDUCT'].map((label) => (
              <a key={label} href="#" className="hover:text-emerald-400">
                {label}
              </a>
            ))}
          </div>

          <p className="text-xs text-gray-500">
            (c) {new Date().getFullYear()} LegendForge. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
