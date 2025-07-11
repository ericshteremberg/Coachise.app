import React, { useState, useEffect, useRef } from 'react';
import { User } from '@/api/entities';
import { Message } from '@/api/entities';
import { Conversation } from '@/api/entities';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ConversationItem from '../components/messages/ConversationItem';
import MessageBubble from '../components/messages/MessageBubble';
import MessageInput from '../components/messages/MessageInput';
import TypingIndicator from '../components/messages/TypingIndicator';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function Chats() {
  const [currentUser, setCurrentUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);
      await loadConversations(user.id);
    } catch (error) {
      console.error("Failed to load user or conversations", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversations = async (userId) => {
    // This is a simplified conversation loader.
    // In a real app, you'd fetch from a Conversation entity.
    // Here, we'll derive it from messages.
    const allUsers = await User.list();
    const otherUsers = allUsers.filter(u => u.id !== userId);

    const convos = otherUsers.map(u => ({
        id: u.id, // Use user ID as conversation ID for simplicity
        participant_id: u.id,
        participant_name: u.full_name,
        participant_type: u.user_type,
        participant_sport: u.sport,
        last_message: `Start a conversation with ${u.full_name}`,
        last_message_time: new Date().toISOString(),
        unread_count: 0,
    }));
    
    setConversations(convos);
  };

  const openConversation = async (conversation) => {
    setSelectedConversation(conversation);
    setMessages([]); // Clear previous messages
    
    // In a real app, you would fetch messages for this conversation
    // For now, we'll show a placeholder.
    const placeholderMessage = {
      id: '1',
      sender_id: conversation.participant_id,
      content: `This is the start of your conversation with ${conversation.participant_name}.`,
      created_date: new Date().toISOString(),
      is_own: false
    };
    setMessages([placeholderMessage]);
  };

  const sendMessage = async (content) => {
    if (!selectedConversation || !content.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender_id: currentUser?.id,
      content: content.trim(),
      created_date: new Date().toISOString(),
      is_own: true
    };
    
    // In a real app, you'd save this to the Message entity.
    // await Message.create({ sender_id: currentUser.id, receiver_id: selectedConversation.participant_id, content: content.trim() });
    setMessages(prev => [...prev, newMessage]);

    // Simulate a reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyMessage = {
        id: Date.now().toString() + 'r',
        sender_id: selectedConversation.participant_id,
        content: "This is an automated reply.",
        created_date: new Date().toISOString(),
        is_own: false
      };
      setMessages(prev => [...prev, replyMessage]);
    }, 2000);
  };
  
  const filteredConversations = conversations.filter(conv =>
    conv.participant_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ... (keep existing render logic)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (selectedConversation) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 safe-area-top">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedConversation(null)}
              className="text-blue-500 hover:text-blue-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {selectedConversation.participant_name.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {selectedConversation.participant_name}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedConversation.participant_type === 'coach' ? 'Coach' : 'Athlete'} • {selectedConversation.participant_sport}
              </p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.is_own}
              showTime={index === messages.length - 1 || messages[index + 1]?.is_own !== message.is_own}
            />
          ))}
          
          {isTyping && (
            <TypingIndicator userName={selectedConversation.participant_name} />
          )}
          
          {/* Auto-scroll anchor */}
          <div id="messages-end" ref={messagesEndRef}></div>
        </div>

        {/* Message Input */}
        <MessageInput onSend={sendMessage} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Chats</h1>
          <p className="text-gray-600">Stay connected with your coaches and athletes</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-4 w-full bg-white border border-gray-200 rounded-2xl text-base placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
          />
        </div>

        {/* Conversations List */}
        <div className="space-y-3">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                onPress={openConversation}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">
                {searchTerm ? 'No conversations found' : 'No messages yet'}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {searchTerm ? 'Try a different search term' : 'Start a conversation with a coach or athlete'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}