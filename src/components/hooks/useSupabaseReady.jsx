// Custom hooks that will make Supabase migration seamless
import { useState, useEffect } from 'react';
import { dataService } from '../services/DataService';

// Hook for user management (will map directly to Supabase auth + profiles)
export const useUser = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await dataService.users.getById(userId);
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const updateUser = async (updates) => {
    try {
      const updatedUser = await dataService.users.update(userId, updates);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { user, loading, error, updateUser };
};

// Hook for coach availability (will map to Supabase availability table)
export const useAvailability = (coachId) => {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!coachId) {
      setLoading(false);
      return;
    }

    const fetchAvailability = async () => {
      try {
        setLoading(true);
        const availabilityData = await dataService.availability.getByCoachId(coachId);
        setAvailability(availabilityData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [coachId]);

  const updateAvailability = async (schedule) => {
    try {
      const updatedAvailability = await dataService.availability.upsert(coachId, schedule);
      setAvailability(updatedAvailability);
      return updatedAvailability;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { availability, loading, error, updateAvailability };
};

// Hook for real-time messaging (will map to Supabase realtime subscriptions)
export const useMessages = (userId, partnerId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !partnerId) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const messageData = await dataService.messages.getConversation(userId, partnerId);
        setMessages(messageData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    
    // In Supabase, this would be replaced with:
    // const subscription = supabase
    //   .from('messages')
    //   .on('INSERT', payload => {
    //     setMessages(prev => [...prev, payload.new]);
    //   })
    //   .subscribe();
    
    // return () => supabase.removeSubscription(subscription);
  }, [userId, partnerId]);

  const sendMessage = async (content) => {
    try {
      const message = await dataService.messages.create({
        sender_id: userId,
        receiver_id: partnerId,
        content,
        message_type: 'text'
      });
      setMessages(prev => [...prev, message]);
      return message;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { messages, loading, error, sendMessage };
};

// Hook for session management (will map to Supabase sessions table)
export const useSessions = (userId, role) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !role) {
      setLoading(false);
      return;
    }

    const fetchSessions = async () => {
      try {
        setLoading(true);
        const sessionData = await dataService.sessions.getByUserId(userId, role);
        setSessions(sessionData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [userId, role]);

  const createSession = async (sessionData) => {
    try {
      const session = await dataService.sessions.create(sessionData);
      setSessions(prev => [...prev, session]);
      return session;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateSession = async (sessionId, updates) => {
    try {
      const updatedSession = await dataService.sessions.update(sessionId, updates);
      setSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s));
      return updatedSession;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { sessions, loading, error, createSession, updateSession };
};