import React from 'react';
import SearchBar from '../shared/SearchBar';
import UpcomingSessionsList from '../sessions/UpcomingSessionsList';
import CoachProfileCardsList from '../coach/CoachProfileCardsList';
import SuggestedMatchesList from '../matches/SuggestedMatchesList';

export default function AthleteDashboard({
  currentUser,
  sessions,
  connections,
  matches,
  onConnect,
  searchTerm,
  setSearchTerm,
  setIsFilterModalOpen
}) {
  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {currentUser?.full_name || 'Athlete'}!
        </h1>
        <p className="text-gray-600">
          Ready to train today?
        </p>
      </div>

      <SearchBar 
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        onFilterClick={() => setIsFilterModalOpen(true)}
        placeholder="Search for coaches..."
      />

      <div className="space-y-8">
        <UpcomingSessionsList sessions={sessions} />
        
        <CoachProfileCardsList 
          profiles={connections} 
          title="Your Coaches"
        />
        
        <SuggestedMatchesList 
          matches={matches} 
          onConnect={onConnect}
          title="Suggested Coaches"
        />
      </div>
    </div>
  );
}