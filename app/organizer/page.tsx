'use client';

import { RoleGate } from '../components/RoleGate';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useToast } from '../context/ToastContext';
import { ListItemSkeleton, TableRowSkeleton } from '../components/Skeleton';

// Dynamically import NavBar with no SSR to avoid provider issues
const NavBar = dynamic(() => import('../components/NavBar').then(mod => mod.NavBar), {
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
  organizerId: string;
  organizerName: string;
}

function CreateTournamentSection() {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('Single Elimination');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { accessToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      setError('Tournament name is required');
      return;
    }
    if (name.length < 3) {
      setError('Tournament name must be at least 3 characters');
      return;
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError('End date must be after start date');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/api/tournaments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          name,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          type,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to create tournament');
      }
      setSuccess('Tournament created successfully!');
      setName('');
      setStartDate('');
      setEndDate('');
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Error creating tournament');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#111827]/80 border border-purple-500/30 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Create Tournament</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Tournament Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-[#0a0d12]/80 border border-gray-600 text-white focus:border-purple-400 focus:outline-none"
            placeholder="e.g., Summer Championship 2025"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-[#0a0d12]/80 border border-gray-600 text-white focus:border-purple-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-[#0a0d12]/80 border border-gray-600 text-white focus:border-purple-400 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Format</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-[#0a0d12]/80 border border-gray-600 text-white focus:border-purple-400 focus:outline-none"
          >
            <option value="Single Elimination">Single Elimination</option>
            <option value="Double Elimination">Double Elimination</option>
            <option value="Round Robin">Round Robin</option>
          </select>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-md transition disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Tournament'}
        </button>
      </form>
    </section>
  );
}

interface Match {
  id: string;
  status: string;
  createdAt: string;
  tournamentId: string;
  tournamentName: string;
  schedule: {
    scheduledTime: string;
    location: string;
  } | null;
}

function MatchSchedulingSection() {
  const [tournamentId, setTournamentId] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { accessToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!tournamentId.trim()) {
      setError('Tournament ID is required');
      return;
    }
    if (scheduledTime && new Date(scheduledTime) < new Date()) {
      setError('Scheduled time cannot be in the past');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
      const body: any = { tournamentId };
      if (scheduledTime) body.scheduledTime = new Date(scheduledTime).toISOString();
      if (location) body.location = location;

      const res = await fetch(`${apiUrl}/api/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to create match');
      }
      setSuccess('Match scheduled successfully!');
      setTournamentId('');
      setScheduledTime('');
      setLocation('');
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Error scheduling match');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#111827]/80 border border-purple-500/30 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Schedule Match</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Tournament ID</label>
          <input
            type="text"
            value={tournamentId}
            onChange={(e) => setTournamentId(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-[#0a0d12]/80 border border-gray-600 text-white focus:border-purple-400 focus:outline-none"
            placeholder="Enter tournament ID"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Scheduled Time (Optional)</label>
          <input
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-[#0a0d12]/80 border border-gray-600 text-white focus:border-purple-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Location (Optional)</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-[#0a0d12]/80 border border-gray-600 text-white focus:border-purple-400 focus:outline-none"
            placeholder="e.g., Arena A"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-md transition disabled:opacity-50"
        >
          {loading ? 'Scheduling...' : 'Schedule Match'}
        </button>
      </form>
    </section>
  );
}

function UpcomingMatchesSection() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingScore, setSubmittingScore] = useState<string | null>(null);
  const [scores, setScores] = useState<{ [key: string]: { team1Score: string; team2Score: string } }>({});
  const { accessToken } = useAuth();
  const toast = useToast();

  const fetchMatches = async () => {
    setLoading(true);
    setError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/api/matches`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch matches');
      const data = await res.json();
      setMatches(data);
    } catch (err: any) {
      setError(err.message || 'Error loading matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    
    // Auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchMatches();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleUpdateStatus = async (matchId: string, newStatus: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/api/matches/${matchId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update match');
      toast.success('Match status updated!');
      await fetchMatches();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update match');
    }
  };

  const handleSubmitScore = async (matchId: string) => {
    const matchScores = scores[matchId];
    if (!matchScores || !matchScores.team1Score || !matchScores.team2Score) {
      toast.warning('Please enter scores for both teams');
      return;
    }

    const team1Score = parseInt(matchScores.team1Score);
    const team2Score = parseInt(matchScores.team2Score);

    if (isNaN(team1Score) || isNaN(team2Score) || team1Score < 0 || team2Score < 0) {
      toast.warning('Please enter valid positive numbers for scores');
      return;
    }

    try {
      setSubmittingScore(matchId);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
      
      // Submit scores and update status to completed
      const res = await fetch(`${apiUrl}/api/matches/${matchId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          status: 'Completed',
          team1Score,
          team2Score
        }),
      });

      if (!res.ok) throw new Error('Failed to submit scores');
      
      toast.success('Match scores submitted successfully!');
      
      // Clear scores for this match
      setScores(prev => {
        const newScores = { ...prev };
        delete newScores[matchId];
        return newScores;
      });
      
      await fetchMatches();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit scores');
    } finally {
      setSubmittingScore(null);
    }
  };

  const handleScoreChange = (matchId: string, team: 'team1Score' | 'team2Score', value: string) => {
    setScores(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: value
      }
    }));
  };

  return (
    <section className="bg-[#111827]/80 border border-purple-500/30 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Upcoming Matches</h2>
      {loading && (
        <div className="space-y-3">
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
        </div>
      )}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && matches.length === 0 && <p className="text-gray-400">No matches scheduled yet.</p>}
      {!loading && !error && matches.length > 0 && (
        <div className="space-y-3">
          {matches.map((match) => (
            <div key={match.id} className="bg-[#0a0d12]/60 border border-gray-700 rounded-lg p-4">
              <h3 className="text-white font-semibold">{match.tournamentName}</h3>
              <p className="text-sm text-gray-400">
                {match.schedule ? (
                  <>
                    {new Date(match.schedule.scheduledTime).toLocaleString()} - {match.schedule.location}
                  </>
                ) : (
                  'Time TBD'
                )}
              </p>
              <div className="mt-3">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    match.status === 'Scheduled' ? 'bg-blue-600 text-blue-100' :
                    match.status === 'Completed' ? 'bg-green-600 text-green-100' :
                    match.status === 'In Progress' ? 'bg-yellow-600 text-yellow-100' :
                    'bg-gray-600 text-gray-100'
                  }`}>
                    {match.status}
                  </span>
                  {match.status !== 'Completed' && match.status !== 'In Progress' && (
                    <button
                      onClick={() => handleUpdateStatus(match.id, 'In Progress')}
                      className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm font-semibold transition"
                    >
                      Start Match
                    </button>
                  )}
                </div>
                
                {match.status === 'In Progress' && (
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <p className="text-sm font-semibold mb-3 text-gray-300">Submit Match Results</p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Team 1 Score</label>
                        <input
                          type="number"
                          min="0"
                          value={scores[match.id]?.team1Score || ''}
                          onChange={(e) => handleScoreChange(match.id, 'team1Score', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-purple-500"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Team 2 Score</label>
                        <input
                          type="number"
                          min="0"
                          value={scores[match.id]?.team2Score || ''}
                          onChange={(e) => handleScoreChange(match.id, 'team2Score', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-purple-500"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleSubmitScore(match.id)}
                      disabled={submittingScore === match.id}
                      className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm font-semibold transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                      {submittingScore === match.id ? 'Submitting...' : 'Submit & Complete Match'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function TournamentsListSection() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);
      setError('');
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
        const res = await fetch(`${apiUrl}/api/tournaments`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch tournaments');
        const data = await res.json();
        setTournaments(data);
      } catch (err: any) {
        setError(err.message || 'Error loading tournaments');
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  return (
    <section className="bg-[#111827]/80 border border-purple-500/30 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Your Tournaments</h2>
      {loading && (
        <div className="space-y-3">
          <TableRowSkeleton />
          <TableRowSkeleton />
        </div>
      )}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && tournaments.length === 0 && <p className="text-gray-400">No tournaments yet. Create one above!</p>}
      {!loading && !error && tournaments.length > 0 && (
        <div className="space-y-3">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="bg-[#0a0d12]/60 border border-gray-700 rounded-lg p-4">
              <h3 className="text-white font-semibold text-lg">{tournament.name}</h3>
              <p className="text-sm text-gray-400">{tournament.type}</p>
              <p className="text-xs text-gray-500">
                {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
              </p>
              <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                tournament.status === 'Draft' ? 'bg-yellow-600 text-yellow-100' : 'bg-green-600 text-green-100'
              }`}>
                {tournament.status}
              </span>
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

function OrganizerRegistrationsSection() {
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
      
      // Get organizer's tournaments
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
      <h2 className="text-xl font-semibold mb-4">Team Registrations</h2>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-400">No pending registrations</p>
          <p className="text-sm text-gray-500 mt-1">Team registrations for your tournaments will appear here</p>
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

export default function OrganizerPage() {
  const router = useRouter();
  const navItems = ['Home', 'Tournament', 'PastResult', 'Contact', 'About Us', 'FAQ'];
  
  return (
    <RoleGate allowed={['organizer']}>
      <NavBar navItems={navItems} />
      <div className="min-h-screen bg-[#0a0d12] text-white">
        <div className="max-w-7xl mx-auto w-full p-8 pt-24">
          <h1 className="text-3xl font-bold mb-6">Organizer Dashboard</h1>
          <div className="space-y-4">
            <CreateTournamentSection />
            <TournamentsListSection />
            <OrganizerRegistrationsSection />
            <MatchSchedulingSection />
            <UpcomingMatchesSection />
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
