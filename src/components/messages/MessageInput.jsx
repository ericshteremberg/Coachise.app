
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Smile } from 'lucide-react';

export default function MessageInput({ onSend, disabled = false }) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3 safe-area-bottom">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-700 flex-shrink-0"
        >
          <Smile className="w-5 h-5" />
        </Button>
        
        <div className="flex-1">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="border-gray-300 rounded-full px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            disabled={disabled}
            autoFocus
          />
        </div>
        
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 flex-shrink-0 disabled:opacity-50"
          size="icon"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
