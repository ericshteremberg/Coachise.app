import React, { useState, useMemo } from 'react';
import { CalendarDays } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import CalendarStrip from '../components/schedule/CalendarStrip';
import SessionListItem from '../components/schedule/SessionListItem';

// Mock Data
const mockSessions = [
  {
    id: '1',
    date: new Date(),
    title: 'Running Form Analysis',
    time: '07:00',
    period: 'AM',
    duration: 45,
    location: 'Waterfront Trail',
    attendee: 'Mike Chen'
  },
  {
    id: '2',
    date: new Date(),
    title: 'Tennis Fundamentals',
    time: '10:00',
    period: 'AM',
    duration: 60,
    location: 'Golden Gate Park Courts',
    attendee: 'Sarah Johnson'
  },
  {
    id: '3',
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    title: 'Virtual Coaching Call',
    time: '02:00',
    period: 'PM',
    duration: 30,
    location: 'Virtual',
    attendee: 'David Park'
  },
  {
    id: '4',
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    title: 'Stroke Analysis',
    time: '04:30',
    period: 'PM',
    duration: 90,
    location: 'Aquatic Center',
    attendee: 'Emma Rodriguez'
  }
];

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const sessionsForSelectedDay = useMemo(() => {
    return mockSessions.filter(session => isSameDay(session.date, selectedDate))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDate]);

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Schedule</h1>
        <p className="text-gray-600">Manage your upcoming sessions.</p>
      </div>

      {/* Calendar Strip */}
      <CalendarStrip
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        currentWeek={currentWeek}
        setCurrentWeek={setCurrentWeek}
      />

      {/* Sessions for the Day */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Sessions for {format(selectedDate, 'MMMM d')}
        </h2>
        {sessionsForSelectedDay.length > 0 ? (
          <div className="space-y-3">
            {sessionsForSelectedDay.map((session) => (
              <SessionListItem key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No sessions scheduled</p>
            <p className="text-gray-500 text-sm mt-1">Enjoy your free day!</p>
          </div>
        )}
      </div>
    </div>
  );
}