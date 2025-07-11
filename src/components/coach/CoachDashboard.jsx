
import React from 'react';
import SearchBar from '../shared/SearchBar';
import UpcomingSessionsList from '../sessions/UpcomingSessionsList';
import SuggestedMatchesList from '../matches/SuggestedMatchesList';
import RevenueCard from './RevenueCard';
import AvailabilityCard from './AvailabilityCard';
import SessionRequestsList from './SessionRequestsList';

export default function CoachDashboard({
  currentUser,
  sessions,
  pendingSessions,
  matches,
  onAcceptSession,
  onDeclineSession,
  onRescheduleSession,
  onConnect,
  searchTerm,
  setSearchTerm,
  setIsFilterModalOpen
}) {
  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {currentUser?.full_name || 'Coach'}!
        </h1>
        <p className="text-gray-600">
          Ready to inspire today?
        </p>
      </div>

      <SearchBar 
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        onFilterClick={() => setIsFilterModalOpen(true)}
        placeholder="Search for athletes..."
      />

      <div className="space-y-8">
        <SessionRequestsList 
          sessions={pendingSessions} 
          onAccept={onAcceptSession}
          onDecline={onDeclineSession}
          onReschedule={onRescheduleSession}
        />
        <RevenueCard />
        <AvailabilityCard availability={currentUser?.availability} />
        <UpcomingSessionsList sessions={sessions} />
        <SuggestedMatchesList 
          matches={matches} 
          onConnect={onConnect}
          title="Suggested Athletes"
        />
      </div>
    </div>
  );
}
