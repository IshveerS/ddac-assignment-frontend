'use client';

import { RoleGate } from '../components/RoleGate';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useToast } from '../context/ToastContext';
import { ListItemSkeleton } from '../components/Skeleton';

// Dynamically import NavBar with no SSR to avoid provider issues
const NavBar = dynamic(() => import('../components/NavBar').then(mod => mod.NavBar), {
  ssr: false,
  loading: () => null,
});

interface PendingUser {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

function PendingUsersSection() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { accessToken } = useAuth();
  const toast = useToast();

  const fetchPendingUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/api/users/pending`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Failed to fetch pending users');
      }
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Error loading users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
    
    // Auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchPendingUsers();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/api/users/${id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Approve failed');
      toast.success('User approved successfully!');
      await fetchPendingUsers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve user');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Reject this user? This will delete their account.')) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/api/users/${id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Reject failed');
      toast.success('User rejected and removed');
      await fetchPendingUsers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject user');
    }
  };

  return (
    <section className="bg-[#111827]/80 border border-purple-500/30 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Pending Account Approvals</h2>
      {loading && (
        <div className="space-y-4">
          <ListItemSkeleton />
          <ListItemSkeleton />
        </div>
      )}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && users.length === 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-400">No pending user approvals</p>
          <p className="text-sm text-gray-500 mt-1">New registrations will appear here</p>
        </div>
      )}
      {!loading && !error && users.length > 0 && (
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="bg-[#0a0d12]/60 border border-gray-700 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="flex-1">
                <p className="text-white font-semibold">{user.username}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
                <p className="text-xs text-gray-500">Registered: {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <button
                  onClick={() => handleApprove(user.id)}
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md text-sm font-semibold transition w-full sm:w-auto"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(user.id)}
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md text-sm font-semibold transition w-full sm:w-auto"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

interface Registration {
  id: string;
  teamName: string;
  status: string;
  createdAt: string;
  tournamentId: string;
  tournamentName: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

function TournamentRegistrationsSection() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { accessToken } = useAuth();
  const toast = useToast();

  const fetchRegistrations = async () => {
    setLoading(true);
    setError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
      
      // Get all tournaments first
      const tournamentsRes = await fetch(`${apiUrl}/api/tournaments`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      
      if (!tournamentsRes.ok) throw new Error('Failed to fetch tournaments');
      const tournaments = await tournamentsRes.json();
      
      // Fetch pending registrations for each tournament
      const allRegistrations: Registration[] = [];
      for (const tournament of tournaments) {
        const regRes = await fetch(`${apiUrl}/api/tournaments/${tournament.id}/registrations?status=Pending`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          credentials: 'include',
        });
        
        if (regRes.ok) {
          const regs = await regRes.json();
          allRegistrations.push(...regs);
        }
      }
      
      setRegistrations(allRegistrations);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchRegistrations();
      
      // Auto-refresh every 30 seconds
      const intervalId = setInterval(() => {
        fetchRegistrations();
      }, 30000);
      
      return () => clearInterval(intervalId);
    }
  }, [accessToken]);

  const handleApprove = async (id: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/api/registrations/${id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to approve registration');
      toast.success('Registration approved!');
      fetchRegistrations();
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve registration');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/api/registrations/${id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to reject registration');
      toast.success('Registration rejected');
      fetchRegistrations();
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject registration');
    }
  };

  return (
    <section className="bg-[#111827]/80 border border-purple-500/30 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Tournament Registration Approvals</h2>
      {loading && (
        <div className="space-y-4">
          <ListItemSkeleton />
          <ListItemSkeleton />
        </div>
      )}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && registrations.length === 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-400">No pending tournament registrations</p>
          <p className="text-sm text-gray-500 mt-1">Team registrations will appear here for approval</p>
        </div>
      )}
      {!loading && !error && registrations.length > 0 && (
        <div className="space-y-4">
          {registrations.map((reg) => (
            <div key={reg.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-lg">{reg.teamName}</p>
                  <p className="text-sm text-gray-400">Tournament: {reg.tournamentName}</p>
                  <p className="text-sm text-gray-400">User: {reg.user.username} ({reg.user.email})</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Registered: {new Date(reg.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <button
                    onClick={() => handleApprove(reg.id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold transition-colors w-full sm:w-auto"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(reg.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-colors w-full sm:w-auto"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const navItems = ['Home', 'Tournament', 'PastResult', 'Contact', 'About Us', 'FAQ'];
  
  return (
    <RoleGate allowed={['admin']}>
      <NavBar navItems={navItems} />
      <div className="min-h-screen bg-[#0a0d12] text-white">
        <div className="max-w-7xl mx-auto w-full p-8 pt-24">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <div className="space-y-4">
            <PendingUsersSection />
            <TournamentRegistrationsSection />
            <section className="bg-[#111827]/80 border border-purple-500/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-2">Match Result Review</h2>
              <p className="text-gray-300">TODO: surface submitted results for verification.</p>
            </section>
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
