import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AvailabilityCard({ availability }) {
  const getAvailableDaysCount = () => {
    if (!availability) return 0;
    return Object.values(availability).filter(day => day && day.available).length;
  };

  const getDayInitial = (day) => {
    switch(day) {
        case "Mon": return "M";
        case "Tue": return "T";
        case "Wed": return "W";
        case "Thu": return "T";
        case "Fri": return "F";
        case "Sat": return "S";
        case "Sun": return "S";
        default: return "";
    }
  };

  const getTimeBlockBadge = (block) => {
    const displayName = block.custom_range || block.name.split(' (')[0];
    if (block.name.startsWith('Morning')) return <Badge className="bg-yellow-100 text-yellow-800 text-xs">{displayName}</Badge>;
    if (block.name.startsWith('Afternoon')) return <Badge className="bg-orange-100 text-orange-800 text-xs">{displayName}</Badge>;
    if (block.name.startsWith('Evening')) return <Badge className="bg-indigo-100 text-indigo-800 text-xs">{displayName}</Badge>;
    return <Badge className="bg-gray-100 text-gray-800 text-xs">{displayName}</Badge>;
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Your Availability</h2>
      <Card className="bg-blue-50 border-blue-200 rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Weekly Schedule
          </CardTitle>
          <div className="text-sm text-gray-600 font-medium">
            {getAvailableDaysCount()}/7 days available
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-around mb-4">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  availability && availability[day] && availability[day].available
                    ? 'bg-green-200 text-green-800'
                    : 'bg-gray-200 text-gray-500'
                }`}
                title={day}
              >
                {getDayInitial(day)}
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-4 max-h-24 overflow-y-auto">
             {daysOfWeek.map(day => (
                availability && availability[day] && availability[day].available && availability[day].time_blocks && availability[day].time_blocks.length > 0 ? (
                  <div key={day} className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 w-10">{day}:</span>
                    <div className="flex flex-wrap gap-1">
                      {availability[day].time_blocks.map((block, index) => (
                        <span key={index}>{getTimeBlockBadge(block)}</span>
                      ))}
                    </div>
                  </div>
                ) : null
             ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-blue-200">
            <Link to={createPageUrl('SetAvailability')}>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                <Settings className="w-4 h-4 mr-2" />
                Set Availability
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}