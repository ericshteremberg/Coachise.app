import React from 'react';
import { Home, MessageSquare, Calendar, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function BottomNav() {
  const location = useLocation();
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, pageName: 'Dashboard' },
    { id: 'chats', label: 'Chats', icon: MessageSquare, pageName: 'Chats' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, pageName: 'Schedule' },
    { id: 'profile', label: 'Profile', icon: User, pageName: 'Profile' },
  ];

  const getActiveTab = () => {
    const path = location.pathname;
    const active = tabs.find(tab => path === createPageUrl(tab.pageName));
    if (active) return active.id;
    // Handle cases where the path is a sub-path of chats
    if (path.startsWith(createPageUrl('Chats'))) return 'chats';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-bottom z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            to={createPageUrl(tab.pageName)}
            className={`flex flex-col items-center py-2 px-3 rounded-xl transition-colors duration-200 w-20 ${
              activeTab === tab.id
                ? 'text-blue-500 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}