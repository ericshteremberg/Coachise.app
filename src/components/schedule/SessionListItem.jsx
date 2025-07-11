import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, User, Video } from 'lucide-react';

export default function SessionListItem({ session }) {
  const isVirtual = session.location?.toLowerCase().includes('virtual');
  
  return (
    <Card className="bg-white border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5 flex items-start space-x-4">
        <div className="flex flex-col items-center w-16">
          <span className="font-bold text-gray-900 text-lg">{session.time}</span>
          <span className="text-sm text-gray-500">{session.period}</span>
        </div>
        
        <div className="border-l-2 border-blue-500 pl-4 flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{session.title}</h3>
          
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <Clock className="w-4 h-4 mr-1.5" />
            <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-200 text-xs px-2 py-0.5">
              {session.duration}min
            </Badge>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm mb-2">
            {isVirtual ? (
              <Video className="w-4 h-4 mr-1.5" />
            ) : (
              <MapPin className="w-4 h-4 mr-1.5" />
            )}
            <span>{session.location}</span>
          </div>

          <div className="flex items-center text-gray-600 text-sm">
            <User className="w-4 h-4 mr-1.5" />
            <span>{session.attendee}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}