'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '@/app/context/ToastContext';
import { User, Mail, Trophy, Calendar } from 'lucide-react';
import { ListItemSkeleton } from '../components/Skeleton';

// Dynamically import NavBar with no SSR to avoid provider issues
const NavBar = dynamic(() => import('../components/NavBar').then(mod => mod.NavBar), {
  ssr: false,
  loading: () => null,
});

interface Registration {
  id: number;
  tournamentId: number;
  tournamentName: string;
  teamName: string;
  status: string;
  registeredAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { accessToken, isAuthenticated, clearAuth, role, isAdmin, isOrganizer } = useAuth();
  const toast = useToast();
  
  const navItems = ['Home', 'Tournament', 'PastResult', 'Contact', 'About Us', 'FAQ'];
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchUserRegistrations();
  }, [isAuthenticated]);

  const fetchUserRegistrations = async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      
      // Decode JWT to get username
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const userName = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'User';
      const userId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      setUsername(userName);
      
      // Fetch all tournaments first
      const tournamentsRes = await fetch('http://localhost:8080/api/tournaments', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      
      // If tournaments fetch fails, just set empty registrations (user may not have any)
      if (!tournamentsRes.ok) {
        console.log('No tournaments available or failed to fetch');
        setRegistrations([]);
        setLoading(false);
        return;
      }

      const tournaments = await tournamentsRes.json();
      
      // If no tournaments exist, that's fine
      if (!tournaments || tournaments.length === 0) {
        setRegistrations([]);
        setLoading(false);
        return;
      }
      
      // Fetch registrations for each tournament
      const allRegistrations: Registration[] = [];
      
      for (const tournament of tournaments) {
        try {
          const registrationsRes = await fetch(
            `http://localhost:8080/api/tournaments/${tournament.id}/registrations`,
            { headers: { 'Authorization': `Bearer ${accessToken}` } }
          );
          
          if (registrationsRes.ok) {
            const tournamentRegistrations = await registrationsRes.json();
            
            // Filter for current user's registrations
            const userRegistrations = tournamentRegistrations
              .filter((r: any) => r.userId === userId)
              .map((r: any) => ({
                id: r.id,
                tournamentId: tournament.id,
                tournamentName: tournament.name,
                teamName: r.teamName,
                status: r.status,
                registeredAt: r.registeredAt
              }));
            
            allRegistrations.push(...userRegistrations);
          }
        } catch (regError) {
          // Silently continue if registration fetch fails for one tournament
          console.log(`Failed to fetch registrations for tournament ${tournament.id}:`, regError);
        }
      }
      
      // Sort by registration date (newest first)
      allRegistrations.sort((a, b) => 
        new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
      );
      
      setRegistrations(allRegistrations);
      
    } catch (error) {
      // Only show error if it's a critical failure (like JWT decode failure)
      console.error('Error in profile page:', error);
      // Don't show toast error - just log it
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  const pendingCount = registrations.filter(r => r.status === 'Pending').length;
  const approvedCount = registrations.filter(r => r.status === 'Approved').length;
  const rejectedCount = registrations.filter(r => r.status === 'Rejected').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <NavBar navItems={navItems} />
      <div className="max-w-7xl mx-auto w-full p-8 pt-24">
        {/* Profile Header */}
        <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold mb-2">{username || 'User'}</h1>
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <p className="text-sm">Email information not available</p>
                </div>
                <p className="text-sm text-purple-400 mt-1">Role: {role || 'User'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-6 text-center">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <p className="text-3xl font-bold mb-1">{approvedCount}</p>
            <p className="text-gray-400">Active Tournaments</p>
          </div>
          <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-6 text-center">
            <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <p className="text-3xl font-bold mb-1">{pendingCount}</p>
            <p className="text-gray-400">Pending Approvals</p>
          </div>
          <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-6 text-center">
            <Trophy className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <p className="text-3xl font-bold mb-1">{registrations.length}</p>
            <p className="text-gray-400">Total Registrations</p>
          </div>
        </div>

        {/* Tournament Registrations */}
        <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6">My Tournament Registrations</h2>
          
          {loading && (
            <div className="space-y-3">
              <ListItemSkeleton />
              <ListItemSkeleton />
              <ListItemSkeleton />
            </div>
          )}

          {!loading && registrations.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800 mb-4">
                <Trophy className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg font-semibold">No tournament registrations yet</p>
              <p className="text-sm text-gray-500 mt-2">Start competing by joining a tournament!</p>
              <button
                onClick={() => router.push('/tournament')}
                className="mt-4 px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
              >
                Browse Tournaments
              </button>
            </div>
          )}

          {!loading && registrations.length > 0 && (
            <div className="space-y-4">
              {registrations.map((reg) => (
                <div
                  key={reg.id}
                  className="bg-gray-700/50 rounded-lg p-5 border border-gray-600 hover:border-purple-500/50 transition cursor-pointer"
                  onClick={() => router.push(`/tournament/${reg.tournamentId}`)}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{reg.tournamentName}</h3>
                      <p className="text-gray-400 mb-2">Team: {reg.teamName}</p>
                      <p className="text-sm text-gray-500">
                        Registered: {new Date(reg.registeredAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        reg.status === 'Approved' ? 'bg-green-600' :
                        reg.status === 'Rejected' ? 'bg-red-600' :
                        'bg-yellow-600'
                      }`}>
                        {reg.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/tournament/${reg.tournamentId}`);
                        }}
                        className="text-sm text-purple-400 hover:text-purple-300 transition"
                      >
                        View Tournament →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-col md:flex-row gap-4">
          {isAdmin && (
            <button
              onClick={() => router.push('/admin')}
              className="flex-1 px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              Go to Admin Dashboard
            </button>
          )}
          {isOrganizer && (
            <button
              onClick={() => router.push('/organizer')}
              className="flex-1 px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              Go to Organizer Dashboard
            </button>
          )}
          <button
            onClick={() => router.push('/tournament')}
            className="flex-1 px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition font-semibold"
          >
            Browse All Tournaments
          </button>
        </div>
      </div>
    </div>
  );
}
