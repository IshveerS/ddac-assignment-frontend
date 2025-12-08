'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useToast } from '@/app/context/ToastContext';
import { ArrowLeft } from 'lucide-react';

interface Tournament {
  id: number;
  name: string;
  game: string;
  startDate: string;
  endDate: string;
  maxTeams: number;
  prizePool: number;
  rules: string;
  status: string;
}

interface Registration {
  id: number;
  userId: number;
  userName: string;
  teamName: string;
  status: string;
  registeredAt: string;
}

interface Match {
  id: number;
  tournamentId: number;
  team1: string;
  team2: string;
  scheduledTime: string;
  status: string;
}

export default function TournamentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { session } = useAuth();
  const { toast } = useToast();
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [userRegistration, setUserRegistration] = useState<Registration | null>(null);

  useEffect(() => {
    fetchTournamentDetails();
  }, [id]);

  const fetchTournamentDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch tournament details
      const tournamentRes = await fetch(`http://localhost:8080/api/tournaments/${id}`, {
        headers: { 'Authorization': `Bearer ${session?.accessToken}` }
      });
      
      if (tournamentRes.ok) {
        const tournamentData = await tournamentRes.json();
        setTournament(tournamentData);
      }

      // Fetch registrations
      const registrationsRes = await fetch(`http://localhost:8080/api/tournaments/${id}/registrations`, {
        headers: { 'Authorization': `Bearer ${session?.accessToken}` }
      });
      
      if (registrationsRes.ok) {
        const registrationsData = await registrationsRes.json();
        setRegistrations(registrationsData);
        
        // Check if current user is registered
        if (session?.userId) {
          const userReg = registrationsData.find((r: Registration) => r.userId === session.userId);
          setUserRegistration(userReg || null);
        }
      }

      // Fetch matches
      const matchesRes = await fetch(`http://localhost:8080/api/matches?tournamentId=${id}`, {
        headers: { 'Authorization': `Bearer ${session?.accessToken}` }
      });
      
      if (matchesRes.ok) {
        const matchesData = await matchesRes.json();
        setMatches(matchesData);
      }
      
    } catch (error) {
      toast.error('Failed to load tournament details');
      console.error('Error fetching tournament details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    const teamName = prompt('Enter your team name:');
    if (!teamName || teamName.trim() === '') {
      toast.warning('Team name is required');
      return;
    }

    try {
      setRegistering(true);
      const response = await fetch(`http://localhost:8080/api/tournaments/${id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({ teamName: teamName.trim() })
      });

      if (response.ok) {
        toast.success('Registration submitted! Waiting for approval.');
        fetchTournamentDetails();
      } else {
        const errorText = await response.text();
        toast.error(errorText || 'Registration failed');
      }
    } catch (error) {
      toast.error('Failed to register for tournament');
      console.error('Registration error:', error);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
        <div className="container mx-auto px-6 py-20">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-700 rounded w-3/4 mb-8"></div>
            <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-32 bg-gray-700 rounded w-full mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold mb-4">Tournament not found</p>
          <button
            onClick={() => router.push('/tournament')}
            className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
          >
            Back to Tournaments
          </button>
        </div>
      </div>
    );
  }

  const approvedRegistrations = registrations.filter(r => r.status === 'Approved');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-6 py-10">
        {/* Back Button */}
        <button
          onClick={() => router.push('/tournament')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Tournaments
        </button>

        {/* Tournament Header */}
        <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-extrabold mb-2">{tournament.name}</h1>
              <p className="text-xl text-gray-300">{tournament.game}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                tournament.status === 'Active' ? 'bg-green-600' :
                tournament.status === 'Completed' ? 'bg-gray-600' :
                'bg-yellow-600'
              }`}>
                {tournament.status}
              </span>
              {userRegistration && (
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  userRegistration.status === 'Approved' ? 'bg-green-600' :
                  userRegistration.status === 'Rejected' ? 'bg-red-600' :
                  'bg-yellow-600'
                }`}>
                  Your Status: {userRegistration.status}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-400">Start Date</p>
              <p className="text-lg font-semibold">{new Date(tournament.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">End Date</p>
              <p className="text-lg font-semibold">{new Date(tournament.endDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Teams</p>
              <p className="text-lg font-semibold">{approvedRegistrations.length} / {tournament.maxTeams}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Prize Pool</p>
              <p className="text-lg font-semibold">${tournament.prizePool.toLocaleString()}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Rules</h3>
            <p className="text-gray-300 whitespace-pre-line">{tournament.rules}</p>
          </div>

          {/* Registration Button */}
          {session && !userRegistration && tournament.status === 'Active' && (
            <button
              onClick={handleRegister}
              disabled={registering || approvedRegistrations.length >= tournament.maxTeams}
              className="w-full md:w-auto px-8 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed font-semibold"
            >
              {registering ? 'Registering...' : 
               approvedRegistrations.length >= tournament.maxTeams ? 'Tournament Full' : 
               'Register for Tournament'}
            </button>
          )}

          {!session && tournament.status === 'Active' && (
            <button
              onClick={() => router.push('/login')}
              className="w-full md:w-auto px-8 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              Login to Register
            </button>
          )}
        </div>

        {/* Registered Teams */}
        <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Registered Teams ({approvedRegistrations.length})</h2>
          {approvedRegistrations.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No teams registered yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedRegistrations.map((reg) => (
                <div key={reg.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <p className="font-semibold text-lg">{reg.teamName}</p>
                  <p className="text-sm text-gray-400">Captain: {reg.userName}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Registered: {new Date(reg.registeredAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Match Schedule */}
        <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Match Schedule ({matches.length})</h2>
          {matches.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No matches scheduled yet</p>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <div key={match.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{match.team1} vs {match.team2}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(match.scheduledTime).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    match.status === 'Completed' ? 'bg-green-600' :
                    match.status === 'InProgress' ? 'bg-yellow-600' :
                    'bg-gray-600'
                  }`}>
                    {match.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
