import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export default function ConversationItem({ conversation, onPress }) {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Card 
      className="bg-white border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => onPress(conversation)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Profile Picture */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">
              {conversation.participant_name ? conversation.participant_name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          
          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {conversation.participant_name || 'Unknown User'}
              </h3>
              <div className="flex items-center space-x-2">
                {conversation.last_message_time && (
                  <span className="text-xs text-gray-500">
                    {formatTime(conversation.last_message_time)}
                  </span>
                )}
                {conversation.unread_count > 0 && (
                  <Badge className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {conversation.unread_count}
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-gray-600 text-sm truncate">
              {conversation.last_message || 'No messages yet'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {conversation.participant_type === 'coach' ? 'Coach' : 'Athlete'} • {conversation.participant_sport || 'General'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}