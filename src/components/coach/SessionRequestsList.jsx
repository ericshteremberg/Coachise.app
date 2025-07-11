import React from 'react';
import SessionRequestCard from './SessionRequestCard';
import { Card, CardContent } from '@/components/ui/card';
import { Inbox } from 'lucide-react';

export default function SessionRequestsList({ sessions, onAccept, onDecline, onReschedule }) {
  if (!sessions || sessions.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Session Requests</h2>
      <div className="space-y-4">
        {sessions.map((session) => (
          <SessionRequestCard
            key={session.id}
            session={session}
            onAccept={onAccept}
            onDecline={onDecline}
            onReschedule={onReschedule}
          />
        ))}
      </div>
    </div>
  );
}