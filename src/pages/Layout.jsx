

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { User } from '@/api/entities';
import BottomNav from './components/navigation/BottomNav';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function Layout({ children }) {
  const [authStatus, setAuthStatus] = useState('checking');
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await User.me();
        setAuthStatus('loggedIn');
      } catch (error) {
        setAuthStatus('loggedOut');
      }
    };
    checkAuth();
  }, [location.key]);

  const pagesWithoutNav = [
    createPageUrl('SetAvailability'),
    createPageUrl('CoachProfile'),
  ];
  const showNav = !pagesWithoutNav.includes(location.pathname);

  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (authStatus === 'loggedOut') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Coachise</h1>
        <p className="text-gray-600 mb-6">Please log in to manage your coaching and training.</p>
        <Button onClick={() => User.loginWithRedirect(window.location.href)} size="lg" className="bg-blue-500 hover:bg-blue-600">
          <LogIn className="mr-2 h-5 w-5" />
          Log In / Sign Up
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      <main className={showNav ? "pb-24" : ""}>
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}

