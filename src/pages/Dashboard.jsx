
import React, { useState, useEffect, useMemo } from 'react';
import { User } from '@/api/entities';
import { Session } from '@/api/entities';
import { createPageUrl } from '@/utils';
import FilterModal from '../components/shared/FilterModal';
import CoachDashboard from '../components/coach/CoachDashboard';
import AthleteDashboard from '../components/athlete/AthleteDashboard';

// MOCK DATA for demonstration until real users are invited
const mockUsers = [
    { id: 'coach-1', full_name: 'Sarah Johnson', email: 'sarah.j@test.com', user_type: 'coach', sport: 'Tennis', location: 'San Francisco, CA', rating: 4.8, price_per_session: 75, bio: 'Professional tennis coach with 10+ years of experience.', specialties: ['Technique Analysis', 'Mental Training'] },
    { id: 'coach-2', full_name: 'Mike Chen', email: 'mike.c@test.com', user_type: 'coach', sport: 'Basketball', location: 'Los Angeles, CA', rating: 4.2, price_per_session: 65, bio: 'Former college basketball player turned coach.', specialties: ['Shooting Technique', 'Defense'] },
    { id: 'coach-3', full_name: 'Emma Rodriguez', email: 'emma.r@test.com', user_type: 'coach', sport: 'Swimming', location: 'Miami, FL', rating: 4.9, price_per_session: 80, bio: 'Olympic swimming coach.', specialties: ['Stroke Analysis', 'Endurance'] },
    { id: 'athlete-1', full_name: 'Alex Ray', email: 'alex.r@test.com', user_type: 'athlete', sport: 'Tennis', location: 'San Francisco, CA', experience_level: 'Intermediate' },
    { id: 'athlete-2', full_name: 'Jordan Lee', email: 'jordan.l@test.com', user_type: 'athlete', sport: 'Basketball', location: 'Los Angeles, CA', experience_level: 'Beginner' }
];

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [pendingSessions, setPendingSessions] = useState([]);
  const [allMatches, setAllMatches] = useState([]);
  const [connections, setConnections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    sport: 'all',
    gender: 'all',
    skillLevel: 'all',
    ageRange: [18, 80],
    availability: [],
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const user = await User.me();
      setCurrentUser(user);

      if (user.user_type === 'coach') {
        await loadCoachData(user);
      } else {
        await loadAthleteData(user);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const hydrateSessions = async (sessions, userType) => {
    if (!sessions || sessions.length === 0) return [];
    
    try {
      const participantIds = sessions.map(s => userType === 'coach' ? s.athlete_id : s.coach_id);
      const uniqueIds = [...new Set(participantIds)];
      
      if (uniqueIds.length === 0) return sessions;

      // Only try to fetch real user data if we have valid ObjectIds
      const validIds = uniqueIds.filter(id => id && typeof id === 'string' && id.length === 24);
      
      if (validIds.length === 0) {
        // If no valid IDs, return sessions as-is
        return sessions;
      }

      const participants = await User.filter({ id: { '$in': validIds } });
      const participantsMap = new Map(participants.map(p => [p.id, p]));

      return sessions.map(session => {
        const participant = participantsMap.get(userType === 'coach' ? session.athlete_id : session.coach_id);
        return {
          ...session,
          [userType === 'coach' ? 'athlete' : 'coach']: participant
        };
      });
    } catch (error) {
      console.error('Error hydrating sessions:', error);
      // Return sessions without hydration if there's an error
      return sessions;
    }
  };

  const loadCoachData = async (coach) => {
    try {
      // Only try to fetch sessions if the coach has a valid ObjectId
      if (coach.id && typeof coach.id === 'string' && coach.id.length === 24) {
        const allSessions = await Session.filter({ coach_id: coach.id });
        const hydratedSessions = await hydrateSessions(allSessions, 'coach');
        
        setPendingSessions(hydratedSessions.filter(s => s.status === 'pending'));
        setSessions(hydratedSessions.filter(s => s.status === 'scheduled'));
      } else {
        // No valid sessions for this user yet
        setPendingSessions([]);
        setSessions([]);
      }
    } catch (error) {
      console.error('Error loading coach sessions:', error);
      setPendingSessions([]);
      setSessions([]);
    }
    
    // Use mock data for display purposes
    const athletes = mockUsers.filter(u => u.user_type === 'athlete');
    setAllMatches(athletes);
    setConnections(athletes.slice(0, 5));
  };

  const loadAthleteData = async (athlete) => {
    try {
      // Only try to fetch sessions if the athlete has a valid ObjectId
      if (athlete.id && typeof athlete.id === 'string' && athlete.id.length === 24) {
        const allSessions = await Session.filter({ athlete_id: athlete.id });
        const hydratedSessions = await hydrateSessions(allSessions, 'athlete');
        
        setPendingSessions(hydratedSessions.filter(s => s.status === 'pending'));
        setSessions(hydratedSessions.filter(s => s.status === 'scheduled'));
      } else {
        // No valid sessions for this user yet
        setPendingSessions([]);
        setSessions([]);
      }
    } catch (error) {
      console.error('Error loading athlete sessions:', error);
      setPendingSessions([]);
      setSessions([]);
    }
    
    // Use mock data for display purposes
    const coaches = mockUsers.filter(u => u.user_type === 'coach');
    setAllMatches(coaches);
    setConnections(coaches.slice(0, 5));
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) return null;
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredMatches = useMemo(() => {
    if (!currentUser) return [];

    return allMatches.filter(match => {
      const searchTermMatch = match.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (match.sport && match.sport.toLowerCase().includes(searchTerm.toLowerCase()));
      const sportMatch = filters.sport === 'all' || match.sport === filters.sport;
      return searchTermMatch && sportMatch;
    });
  }, [allMatches, searchTerm, filters, currentUser]);

  const handleConnect = (userId) => {
    const userToConnect = allMatches.find(match => match.id === userId);
    if (userToConnect) {
      if (userToConnect.user_type === 'coach') {
        window.location.href = createPageUrl('CoachProfile') + `?id=${userId}`;
      } else {
        window.location.href = createPageUrl('AthleteProfile') + `?id=${userId}`;
      }
    }
  };
  
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setIsFilterModalOpen(false);
  };
  
  const handleAcceptSession = async (sessionId) => {
    try {
      await Session.update(sessionId, { status: 'scheduled' });
      await loadDashboardData();
    } catch (error) {
        console.error("Failed to accept session:", error);
    }
  };

  const handleDeclineSession = async (sessionId) => {
    try {
      await Session.update(sessionId, { status: 'cancelled' });
      await loadDashboardData();
    } catch(error) {
        console.error("Failed to decline session:", error);
    }
  };

  const handleRescheduleSession = (session) => {
    const participant = currentUser.user_type === 'coach' ? session.athlete : session.coach;
    if (participant) {
      const message = `Hi ${participant.full_name}, regarding our session on ${session.date}, I'd like to reschedule.`;
      window.location.href = createPageUrl('Chats') + 
        `?openChat=${participant.id}&userName=${encodeURIComponent(participant.full_name)}&userType=${participant.user_type}&message=${encodeURIComponent(message)}`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const dashboardProps = {
    currentUser,
    sessions,
    connections,
    matches: filteredMatches,
    pendingSessions,
    onAcceptSession: handleAcceptSession,
    onDeclineSession: handleDeclineSession,
    onRescheduleSession: handleRescheduleSession,
    onConnect: handleConnect,
    searchTerm,
    setSearchTerm,
    setIsFilterModalOpen,
  };

  return (
    <>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        initialFilters={filters}
        onApplyFilters={handleApplyFilters}
      />
      {currentUser?.user_type === 'coach' ? (
        <CoachDashboard {...dashboardProps} />
      ) : (
        <AthleteDashboard {...dashboardProps} />
      )}
    </>
  );
}
