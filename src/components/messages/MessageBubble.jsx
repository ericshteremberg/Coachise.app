import React from 'react';
import { format } from 'date-fns';

export default function MessageBubble({ message, isOwn, showTime = false }) {
  return (
    <div className={`mb-3 ${isOwn ? 'flex justify-end' : 'flex justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
        isOwn 
          ? 'bg-blue-500 text-white rounded-br-md' 
          : 'bg-gray-100 text-gray-900 rounded-bl-md'
      }`}>
        <p className="text-sm leading-relaxed">{message.content}</p>
        {showTime && (
          <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
            {format(new Date(message.created_date), 'h:mm a')}
          </p>
        )}
      </div>
    </div>
  );
}