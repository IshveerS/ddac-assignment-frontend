'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const NavBar = dynamic(() => import('../../components/NavBar').then((mod) => mod.NavBar), {
  ssr: false,
  loading: () => null,
});

export default function DevSessionPage() {
  const { setSession, clearAuth, role, accessToken, isAuthenticated } = useAuth();
  const navItems = ['Home', 'Tournament', 'Contact', 'About Us', 'FAQ'];
  const [accountId, setAccountId] = useState('');
  const [accountStatus, setAccountStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [tournamentName, setTournamentName] = useState('');
  const [tournamentFormat, setTournamentFormat] = useState('single_elim');
  const [tournamentStatus, setTournamentStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showOrganizerPanel, setShowOrganizerPanel] = useState(false);

  const setRole = (targetRole: string) => {
    // For local/dev only: set a dummy token and role so you can see gated UI.
    setSession('dev-token', targetRole);
  };

  const mockPendingAccounts = [
    { id: 'acct-1001', email: 'player1@example.com', type: 'player' },
    { id: 'acct-2001', email: 'team-admin@example.com', type: 'team' }
  ];

  const mockRegistrations = [
    { id: 'reg-3001', team: 'Dragons', tournament: 'Winter Cup' },
    { id: 'reg-3002', team: 'Nova', tournament: 'Winter Cup' }
  ];

  const handleAccountAction = (action: 'approve' | 'reject', id: string) => {
    setAccountId(id);
    setAccountStatus('ok');
    setTimeout(() => setAccountStatus('idle'), 1200);
  };

  const handleCreateTournament = () => {
    if (!tournamentName) return;
    setTournamentStatus('ok');
    setTimeout(() => setTournamentStatus('idle'), 1200);
    setTournamentName('');
  };

  return (
    <div className="min-h-screen bg-[#0a0d12] text-white font-sans">
      <NavBar navItems={navItems} />

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-16 space-y-6">
        <h1 className="text-3xl font-bold">Dev Session Helper</h1>
        <p className="text-gray-300 text-sm">
          Local-only helper to set an auth session with a chosen role. Use your real login in production.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => setRole('admin')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-md transition"
          >
            Set Admin Session
          </button>
          <button
            onClick={() => setRole('organizer')}
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-md transition"
          >
            Set Organizer Session
          </button>
          <button
            onClick={() => setRole('player')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-md transition"
          >
            Set Player Session
          </button>
          <button
            onClick={clearAuth}
            className="bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-md transition"
          >
            Clear Session
          </button>
        </div>

        <div className="bg-[#111827] border border-purple-500/30 rounded-xl p-4">
          <p className="text-sm text-gray-300">
            Status: {isAuthenticated ? 'Authenticated' : 'Signed out'}
          </p>
          <p className="text-sm text-gray-300">Role: {role ?? 'none'}</p>
          <p className="text-xs text-gray-500 truncate">Token: {accessToken ?? 'none'}</p>
        </div>

        {isAuthenticated && role === 'admin' && (
          <div className="bg-[#111827] border border-purple-500/30 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Admin quick actions (dev-only)</h2>
              <button
                onClick={() => setShowAdminPanel((v) => !v)}
                className="text-sm text-emerald-300 underline"
              >
                {showAdminPanel ? 'Hide' : 'Show'}
              </button>
            </div>
            {!showAdminPanel ? (
              <p className="text-gray-400 text-sm">Click “Show” to reveal admin mock actions.</p>
            ) : (
              <>
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
                      onClick={() => handleAccountAction('approve', accountId || 'manual')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-2 rounded-md transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAccountAction('reject', accountId || 'manual')}
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold py-2 rounded-md transition"
                    >
                      Reject
                    </button>
                  </div>
                  {accountStatus === 'ok' && (
                    <p className="text-emerald-300 text-sm">Action recorded (dev mode)</p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-300">Mock pending accounts:</p>
                  {mockPendingAccounts.map((acct) => (
                    <div key={acct.id} className="flex items-center justify-between bg-[#0d1118] border border-gray-800 rounded-md px-3 py-2">
                      <div>
                        <p className="text-white text-sm">{acct.email}</p>
                        <p className="text-gray-400 text-xs">Type: {acct.type}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccountAction('approve', acct.id)}
                          className="text-emerald-300 text-xs border border-emerald-400/60 px-2 py-1 rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAccountAction('reject', acct.id)}
                          className="text-red-300 text-xs border border-red-400/60 px-2 py-1 rounded"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {isAuthenticated && role === 'organizer' && (
          <div className="bg-[#111827] border border-purple-500/30 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Organizer quick actions (dev-only)</h2>
              <button
                onClick={() => setShowOrganizerPanel((v) => !v)}
                className="text-sm text-emerald-300 underline"
              >
                {showOrganizerPanel ? 'Hide' : 'Show'}
              </button>
            </div>
            {!showOrganizerPanel ? (
              <p className="text-gray-400 text-sm">Click “Show” to reveal organizer mock actions.</p>
            ) : (
              <>
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
                    Create (dev mock)
                  </button>
                  {tournamentStatus === 'ok' && (
                    <p className="text-emerald-300 text-sm">Tournament recorded (dev mode)</p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-300">Mock pending team registrations:</p>
                  {mockRegistrations.map((reg) => (
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
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
