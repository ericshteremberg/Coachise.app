import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, User, Calendar, FileText, Check, X, Send } from 'lucide-react';
import { format } from 'date-fns';

export default function SessionRequestCard({ session, onAccept, onDecline, onReschedule }) {
  const { athlete, service_type, date, time, location, notes } = session;

  const formatTime = (timeStr) => {
    if (!timeStr.includes(':') || timeStr.includes(' ')) return timeStr;
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${displayHour}:${minutes} ${period}`;
  };

  return (
    <Card className="bg-white border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">
              {athlete?.full_name ? athlete.full_name.charAt(0).toUpperCase() : 'A'}
            </span>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              New request from {athlete?.full_name || 'an athlete'}
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                <span>{service_type}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <span>{format(new Date(date), 'EEEE, MMM d')}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                <span>{formatTime(time)}</span>
              </div>
              {location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{location}</span>
                </div>
              )}
              {notes && (
                <div className="flex items-start pt-2 mt-2 border-t border-gray-100">
                  <FileText className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                  <p className="italic">"{notes}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <div className="bg-gray-50 px-5 py-3 flex justify-end items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => onDecline(session.id)} className="text-red-600 hover:bg-red-50 hover:text-red-600">
          <X className="w-4 h-4 mr-1" />
          Decline
        </Button>
        <Button variant="outline" size="sm" onClick={() => onReschedule(session)}>
          <Send className="w-4 h-4 mr-1" />
          Message
        </Button>
        <Button size="sm" onClick={() => onAccept(session.id)} className="bg-green-600 hover:bg-green-700">
          <Check className="w-4 h-4 mr-1" />
          Accept
        </Button>
      </div>
    </Card>
  );
}