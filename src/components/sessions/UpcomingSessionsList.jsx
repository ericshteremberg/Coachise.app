
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, User, ArrowRight, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function UpcomingSessionsList({ sessions }) {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Sessions</h2>
        <Card className="bg-gray-50 border-gray-200 rounded-2xl">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No upcoming sessions</p>
            <p className="text-gray-500 text-sm mt-1">Book a session to get started</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Sessions</h2>
      <div className="space-y-3">
        {sessions.map((session) => (
          <Card key={session.id} className="bg-white border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{session.service_type}</h3>
                    <Badge className={getStatusColor(session.status)}>
                      {getStatusIcon(session.status)}
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <Clock className="w-4 h-4 mr-1" />
                    {format(new Date(session.date), 'MMM d')} at {session.time}
                  </div>
                </div>
                <div className="bg-blue-50 px-3 py-1 rounded-full">
                  <span className="text-blue-600 text-sm font-medium">{session.duration}min</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600 text-sm">
                  <User className="w-4 h-4 mr-1" />
                  <span>
                    {session.athlete?.full_name || session.coach?.full_name || 'Session'}
                  </span>
                </div>
                {session.location && (
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{session.location}</span>
                  </div>
                )}
              </div>
              {session.status === 'pending' && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Waiting for coach confirmation
                  </p>
                </div>
              )}
              {session.status === 'scheduled' && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-green-600 font-medium">
                    ✓ Session confirmed
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <Link
          to={createPageUrl('Schedule')}
          className="text-sm font-medium text-blue-500 hover:text-blue-600 underline flex items-center gap-1 transition-colors"
        >
          See all sessions
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
