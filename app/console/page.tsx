'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Shield,
  ClipboardList,
  Brackets,
  CheckCircle2,
  Info,
  AlertTriangle,
  Rocket,
  Check,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAuthenticatedFetch } from '../context/useAuthenticatedFetch';

const NavBar = dynamic(() => import('../components/NavBar').then((mod) => mod.NavBar), {
  ssr: false,
  loading: () => null,
});

const cards = {
  admin: [
    { title: 'Account approvals', desc: 'Approve/reject player and team accounts; manage role assignments.', icon: Shield },
    { title: 'Policy & enforcement', desc: 'Handle reports, apply penalties, and review audits.', icon: AlertTriangle },
  ],
  organizer: [
    { title: 'Create tournaments', desc: 'Set formats, rules, seeding, and announcements.', icon: ClipboardList },
    { title: 'Brackets & results', desc: 'Publish brackets, update results, and resolve disputes.', icon: Brackets },
  ],
  shared: [
    { title: 'Comms & updates', desc: 'Send schedules, bracket updates, and performance summaries.', icon: Info },
    { title: 'Fair play', desc: 'Coordinate incident handling and sanctions with admins.', icon: CheckCircle2 },
  ],
};

export default function ConsolePage() {
  const { isAuthenticated, isAdmin, isOrganizer, role } = useAuth();
  const navItems = ['Home', 'Tournament', 'PastResult', 'Contact', 'About Us', 'FAQ'];
  const authedFetch = useAuthenticatedFetch();

  const [accountId, setAccountId] = useState('');
  const [accountAction, setAccountAction] = useState<'approve' | 'reject'>('approve');
  const [tournamentName, setTournamentName] = useState('');
  const [tournamentFormat, setTournamentFormat] = useState('single_elim');
  const [tournamentStatus, setTournamentStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [accountStatus, setAccountStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [loadingTournament, setLoadingTournament] = useState(false);

  // Mock data to simulate real lists; swap with API data when backend is ready.
  const pendingAccounts = useMemo(
    () => [
      { id: 'acct-1001', email: 'player1@example.com', type: 'player' },
      { id: 'acct-2001', email: 'team-admin@example.com', type: 'team' },
    ],
    []
  );

  const pendingRegistrations = useMemo(
    () => [
      { id: 'reg-3001', team: 'Dragons', tournament: 'Winter Cup', status: 'pending' },
      { id: 'reg-3002', team: 'Nova', tournament: 'Winter Cup', status: 'pending' },
    ],
    []
  );

  const handleAccountAction = async () => {
    if (!accountId) return;
    try {
      setLoadingAccount(true);
      // Stub: replace with real endpoint
      await authedFetch(`/api/admin/accounts/${accountId}/${accountAction}`, { method: 'POST' });
      setAccountStatus('ok');
      setTimeout(() => setAccountStatus('idle'), 1500);
    } catch (err) {
      console.error(err);
      setAccountStatus('error');
      setTimeout(() => setAccountStatus('idle'), 2000);
    } finally {
      setLoadingAccount(false);
    }
  };

  const handleCreateTournament = async () => {
    if (!tournamentName) return;
    try {
      setLoadingTournament(true);
      // Stub: replace with real endpoint
      await authedFetch('/api/organizer/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tournamentName,
          format: tournamentFormat,
        }),
      });
      setTournamentStatus('ok');
      setTournamentName('');
      setTimeout(() => setTournamentStatus('idle'), 1500);
    } catch (err) {
      console.error(err);
      setTournamentStatus('error');
      setTimeout(() => setTournamentStatus('idle'), 2000);
    } finally {
      setLoadingTournament(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d12] text-white font-sans overflow-hidden relative">
      <NavBar navItems={navItems} />

      <section className="relative flex items-center justify-center w-full h-[40vh] px-6 pt-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d12] via-[#0a0d12]/90 to-[#0a0d12]" />
        <div className="relative z-10 space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold">Admin + Organizer Console</h1>
          <p className="text-emerald-300 text-sm uppercase tracking-[0.35em]">Control center</p>
          {role && <p className="text-gray-300 text-sm">Signed in as: {role}</p>}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        {!isAuthenticated && (
          <div className="bg-[#111827] border border-red-400/40 text-red-200 p-6 rounded-xl">
            You are not signed in. <Link href="/login" className="text-purple-300 underline">Sign in</Link> to access admin/organizer tools.
          </div>
        )}

        {isAuthenticated && !isAdmin && !isOrganizer && (
          <div className="bg-[#111827] border border-yellow-400/30 text-yellow-200 p-6 rounded-xl">
            You are signed in, but do not have admin or organizer permissions. Ask an admin to grant access.
          </div>
        )}

        {isAuthenticated && isAdmin && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold">Admin actions</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {cards.admin.map((card) => (
                <div key={card.title} className="bg-[#111827]/70 border border-purple-500/30 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <card.icon className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold">{card.title}</h3>
                  </div>
                  <p className="text-gray-300 text-sm">{card.desc}</p>
                </div>
              ))}
              <div className="bg-[#111827]/70 border border-purple-500/30 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Rocket className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold">Approve or reject account</h3>
                  </div>
                  {loadingAccount && <Loader2 className="w-4 h-4 text-emerald-300 animate-spin" />}
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    placeholder="Account ID or email"
                    className="w-full px-3 py-2 rounded-md bg-[#0d1118] border border-gray-700 text-white text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setAccountAction('approve');
                        handleAccountAction();
                      }}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-2 rounded-md transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setAccountAction('reject');
                        handleAccountAction();
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold py-2 rounded-md transition"
                    >
                      Reject
                    </button>
                  </div>
                  {accountStatus === 'ok' && (
                    <p className="text-emerald-300 text-sm flex items-center gap-1">
                      <Check className="w-4 h-4" /> Action sent (stub)
                    </p>
                  )}
                  {accountStatus === 'error' && <p className="text-red-300 text-sm">Action failed (stub)</p>}
                </div>
              </div>
            </div>

            <div className="bg-[#111827]/70 border border-purple-500/30 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold">Pending accounts (mock)</h3>
              </div>
              <div className="space-y-3">
                {pendingAccounts.map((acct) => (
                  <div key={acct.id} className="flex items-center justify-between bg-[#0d1118] border border-gray-800 rounded-md px-3 py-2">
                    <div>
                      <p className="text-white text-sm">{acct.email}</p>
                      <p className="text-gray-400 text-xs">Type: {acct.type}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setAccountId(acct.id);
                          setAccountAction('approve');
                          handleAccountAction();
                        }}
                        className="text-emerald-300 text-xs border border-emerald-400/60 px-2 py-1 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setAccountId(acct.id);
                          setAccountAction('reject');
                          handleAccountAction();
                        }}
                        className="text-red-300 text-xs border border-red-400/60 px-2 py-1 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {isAuthenticated && isOrganizer && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold">Organizer actions</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {cards.organizer.map((card) => (
                <div key={card.title} className="bg-[#111827]/70 border border-purple-500/30 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <card.icon className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold">{card.title}</h3>
                  </div>
                  <p className="text-gray-300 text-sm">{card.desc}</p>
                </div>
              ))}
              <div className="bg-[#111827]/70 border border-purple-500/30 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Rocket className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold">Create tournament</h3>
                  </div>
                  {loadingTournament && <Loader2 className="w-4 h-4 text-emerald-300 animate-spin" />}
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                    placeholder="Tournament name"
                    className="w-full px-3 py-2 rounded-md bg-[#0d1118] border border-gray-700 text-white text-sm"
                  />
                  <select
                    value={tournamentFormat}
                    onChange={(e) => setTournamentFormat(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-[#0d1118] border border-gray-700 text-white text-sm"
                  >
                    <option value="single_elim">Single elimination</option>
                    <option value="double_elim">Double elimination</option>
                    <option value="swiss">Swiss</option>
                    <option value="round_robin">Round robin</option>
                  </select>
                  <button
                    onClick={handleCreateTournament}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold py-2 rounded-md transition"
                  >
                    Create
                  </button>
                  {tournamentStatus === 'ok' && (
                    <p className="text-emerald-300 text-sm flex items-center gap-1">
                      <Check className="w-4 h-4" /> Tournament request sent (stub)
                    </p>
                  )}
                  {tournamentStatus === 'error' && <p className="text-red-300 text-sm">Tournament request failed (stub)</p>}
                </div>
              </div>
            </div>

            <div className="bg-[#111827]/70 border border-purple-500/30 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Brackets className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold">Pending team registrations (mock)</h3>
              </div>
              <div className="space-y-3">
                {pendingRegistrations.map((reg) => (
                  <div key={reg.id} className="flex items-center justify-between bg-[#0d1118] border border-gray-800 rounded-md px-3 py-2">
                    <div>
                      <p className="text-white text-sm">{reg.team}</p>
                      <p className="text-gray-400 text-xs">{reg.tournament}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-emerald-300 text-xs border border-emerald-400/60 px-2 py-1 rounded">
                        Approve
                      </button>
                      <button className="text-red-300 text-xs border border-red-400/60 px-2 py-1 rounded">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {isAuthenticated && (isAdmin || isOrganizer) && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Info className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold">Shared</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {cards.shared.map((card) => (
                <div key={card.title} className="bg-[#111827]/70 border border-purple-500/30 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <card.icon className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold">{card.title}</h3>
                  </div>
                  <p className="text-gray-300 text-sm">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
