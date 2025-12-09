'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { TournamentCardSkeleton } from '../components/Skeleton';

const NavBar = dynamic(() => import('../components/NavBar').then((mod) => mod.NavBar), {
  ssr: false,
  loading: () => null,
});

interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
}

interface TeamMember {
  fullName: string;
  age: string;
  email: string;
  contactNumber: string;
  role: string;
}

export default function TournamentPage() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState('');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { fullName: '', age: '', email: '', contactNumber: '', role: '' },
  ]);
  const [registering, setRegistering] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { isAuthenticated, accessToken } = useAuth();
  const toast = useToast();

  const navItems = ['Home', 'Tournament', 'PastResult', 'Contact', 'About Us', 'FAQ'];

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/api/tournaments`);
      if (!res.ok) throw new Error('Failed to fetch tournaments');
      const data = await res.json();
      setTournaments(data);
    } catch (err) {
      console.error('Error fetching tournaments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClick = (tournament: Tournament) => {
    if (!isAuthenticated) {
      toast.warning('Please login to register for tournaments');
      return;
    }
    setSelectedTournament(tournament);
    setShowRegisterModal(true);
  };

  const handleRegister = async () => {
    if (!teamName.trim()) {
      toast.warning('Please enter a team name');
      return;
    }

    const sanitizedMembers = teamMembers.map((member) => ({
      fullName: member.fullName.trim(),
      age: member.age.trim(),
      email: member.email.trim(),
      contactNumber: member.contactNumber.trim(),
      role: member.role.trim(),
    }));

    if (sanitizedMembers.some((m) => !m.fullName || !m.age || !m.email || !m.contactNumber || !m.role)) {
      toast.warning('Please complete all player fields');
      return;
    }

    setRegistering(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/api/tournaments/${selectedTournament?.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          teamName,
          members: sanitizedMembers.map((m) => ({
            ...m,
            age: Number(m.age) || m.age,
          })),
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Registration failed');
      }

      setShowRegisterModal(false);
      setTeamName('');
      setTeamMembers([{ fullName: '', age: '', email: '', contactNumber: '', role: '' }]);
      toast.success(`Successfully registered for ${selectedTournament?.name}!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to register');
    } finally {
      setRegistering(false);
    }
  };

  const getTournamentImage = (index: number) => {
    const images = ['/lol_worldcup.jpg', '/lol.jpg', '/lol_worldtrailer.jpg'];
    return images[index % images.length];
  };

  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tournament.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#0a0d12] text-white font-sans">

      {/* ===== Navbar ===== */}
      <NavBar navItems={navItems} />

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

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search tournaments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {!loading && tournaments.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800 mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg font-semibold">No tournaments available</p>
            <p className="text-sm text-gray-500 mt-2">Check back soon for upcoming tournaments!</p>
          </div>
        )}

        {!loading && tournaments.length > 0 && filteredTournaments.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800 mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg font-semibold">No tournaments found</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filter</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading && (
            <>
              <TournamentCardSkeleton />
              <TournamentCardSkeleton />
              <TournamentCardSkeleton />
            </>
          )}
          
          {!loading && filteredTournaments.map((t, index) => (
            <div
              key={t.id}
              className="bg-[#111827]/60 border border-purple-500/30 rounded-xl shadow-lg hover:border-purple-400 transition hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] overflow-hidden"
            >
              <div className="relative h-40 w-full">
                <Image src={getTournamentImage(index)} alt={t.name} fill className="object-cover" />
              </div>

              <div className="p-6">
                <h4 className="text-xl font-bold mb-2">{t.name}</h4>

                <p className="flex items-center text-gray-300 gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  {new Date(t.startDate).toLocaleDateString()}
                </p>

                <p className="flex items-center text-gray-300 gap-2 text-sm mt-1">
                  <Clock className="w-4 h-4 text-purple-400" />
                  {new Date(t.startDate).toLocaleTimeString()}
                </p>

                <p className="flex items-center text-gray-300 gap-2 text-sm mt-1">
                  <Users className="w-4 h-4 text-purple-400" />
                  {t.type || 'Single Elimination'}
                </p>

                <p className={`mt-2 text-sm font-semibold ${
                  t.status === 'Draft' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  Status: {t.status}
                </p>

                <div className="mt-6 flex flex-col gap-2">
                  <button
                    onClick={() => router.push(`/tournament/${t.id}`)}
                    className="w-full py-3 rounded-md font-bold transition bg-gray-700 hover:bg-gray-600"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleJoinClick(t)}
                    className="w-full py-3 rounded-md font-bold transition bg-purple-600 hover:bg-purple-500"
                  >
                    Register Team
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Registration Modal ===== */}
      {showRegisterModal && selectedTournament && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999] animate-fadeIn">
          <div className="bg-[#111827] border border-purple-400 rounded-xl p-8 w-[90%] max-w-md shadow-xl">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">Register for Tournament</h3>
            <p className="text-gray-300 mb-4">{selectedTournament.name}</p>

            <input
              type="text"
              placeholder="Team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white mb-4 focus:outline-none focus:border-purple-500"
            />

            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="rounded-lg border border-gray-700 p-4 bg-gray-900/60 space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-purple-300">Player {idx + 1}</p>
                    {teamMembers.length > 1 && (
                      <button
                        type="button"
                        className="text-xs text-red-300 hover:text-red-200"
                        onClick={() => setTeamMembers((prev) => prev.filter((_, i) => i !== idx))}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Full name"
                      value={member.fullName}
                      onChange={(e) => setTeamMembers((prev) => prev.map((m, i) => i === idx ? { ...m, fullName: e.target.value } : m))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                    <input
                      type="number"
                      placeholder="Age"
                      min={10}
                      value={member.age}
                      onChange={(e) => setTeamMembers((prev) => prev.map((m, i) => i === idx ? { ...m, age: e.target.value } : m))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="email"
                      placeholder="Email"
                      value={member.email}
                      onChange={(e) => setTeamMembers((prev) => prev.map((m, i) => i === idx ? { ...m, email: e.target.value } : m))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                    <input
                      type="tel"
                      placeholder="Contact number"
                      value={member.contactNumber}
                      onChange={(e) => setTeamMembers((prev) => prev.map((m, i) => i === idx ? { ...m, contactNumber: e.target.value } : m))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <select
                    value={member.role}
                    onChange={(e) => setTeamMembers((prev) => prev.map((m, i) => i === idx ? { ...m, role: e.target.value } : m))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select role</option>
                    <option value="Jungle">Jungle</option>
                    <option value="Middle">Middle</option>
                    <option value="Marksman">Marksman</option>
                    <option value="Supporter">Supporter</option>
                    <option value="Top">Top</option>
                  </select>
                </div>
              ))}

              {teamMembers.length < 7 && (
                <button
                  type="button"
                  onClick={() => setTeamMembers((prev) => [...prev, { fullName: '', age: '', email: '', contactNumber: '', role: '' }])}
                  className="w-full py-2 rounded-md border border-dashed border-purple-400 text-purple-300 hover:bg-purple-400/10 transition"
                >
                  + Add player
                </button>
              )}
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={handleRegister}
                disabled={registering}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-md transition disabled:opacity-50"
              >
                {registering ? 'Registering...' : 'Submit'}
              </button>
              <button
                onClick={() => {
                  setShowRegisterModal(false);
                  setTeamName('');
                  setTeamMembers([{ fullName: '', age: '', email: '', contactNumber: '', role: '' }]);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-md transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
