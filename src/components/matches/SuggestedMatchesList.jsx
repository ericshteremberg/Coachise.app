import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SuggestedMatchesList({ matches, onConnect, title = "Suggested Matches" }) {
  if (!matches || matches.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
        <Card className="bg-gray-50 border-gray-200 rounded-2xl">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No suggestions available</p>
            <p className="text-gray-500 text-sm mt-1">Complete your profile to get better matches</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-3">
        {matches.map((match) => (
          <Card key={match.id} className="bg-white border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    match.user_type === 'coach' 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                      : 'bg-gradient-to-br from-green-500 to-blue-600'
                  }`}>
                    <span className="text-white font-bold">
                      {match.full_name ? match.full_name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`${createPageUrl(match.user_type === 'coach' ? 'CoachProfile' : 'AthleteProfile')}?id=${match.id}`}>
                      <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors truncate">
                        {match.full_name || 'Unknown User'}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-2">
                      {match.user_type === 'coach' ? 'Coach' : 'Athlete'} • {match.sport || 'General'}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 flex-wrap">
                      {match.location && (
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{match.location}</span>
                        </div>
                      )}
                      {match.rating && (
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current mr-1 flex-shrink-0" />
                          <span>{match.rating}</span>
                        </div>
                      )}
                      {match.experience_level && (
                        <div className="flex items-center">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                            {match.experience_level}
                          </span>
                        </div>
                      )}
                    </div>
                    {match.bio && (
                      <p className="text-gray-600 text-sm line-clamp-2 mt-2">{match.bio}</p>
                    )}
                  </div>
                </div>
                <div className="ml-3 flex-shrink-0">
                  <Button
                    onClick={() => onConnect(match.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    Connect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}