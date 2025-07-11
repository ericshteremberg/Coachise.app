import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CoachProfileCardsList({ profiles, title }) {
  if (!profiles || profiles.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
        <Card className="bg-gray-50 border-gray-200 rounded-2xl">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No connections yet</p>
            <p className="text-gray-500 text-sm mt-1">Start building your network</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
        {profiles.map((profile) => (
          <Card key={profile.id} className="flex-shrink-0 w-44 bg-white border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">
                  {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm truncate">
                {profile.full_name || 'Unknown User'}
              </h3>
              <p className="text-gray-600 text-xs mb-2 truncate">
                {profile.sport || 'General'}
              </p>
              {profile.location && (
                <div className="flex items-center justify-center text-gray-500 text-xs mb-2">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="truncate">{profile.location}</span>
                </div>
              )}
              {profile.rating && (
                <div className="flex items-center justify-center mb-3">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600 ml-1">{profile.rating}</span>
                </div>
              )}
              <Link to={`${createPageUrl('CoachProfile')}?id=${profile.id}`}>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-3 rounded-lg">
                  View Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}