// Universal Data Service Layer
// This simulates Supabase queries now, but can be easily swapped to real Supabase calls later

// Mock Data with Supabase-compatible structure
const mockUsers = {
  'coach-001': {
    id: 'coach-001',
    name: 'Sarah Johnson',
    email: 'sarah.j@test.com',
    dob: '1988-05-15',
    role: 'coach',
    address: 'San Francisco, CA',
    rate: 75,
    bio: 'Professional tennis coach with 10+ years of experience.',
    specialties: ['Technique Analysis', 'Mental Training'],
    sport: 'Tennis',
    rating: 4.8,
    profile_image: 'https://images.unsplash.com/photo-1544005313-91ddf3d7a8c3?q=80&w=1974',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  'coach-002': {
    id: 'coach-002',
    name: 'Mike Chen',
    email: 'mike.c@test.com',
    dob: '1985-09-22',
    role: 'coach',
    address: 'Los Angeles, CA',
    rate: 65,
    bio: 'Former college basketball player turned coach.',
    specialties: ['Shooting Technique', 'Defense'],
    sport: 'Basketball',
    rating: 4.2,
    profile_image: 'https://images.unsplash.com/photo-1507003211169-0a6dd7228e27?q=80&w=1974',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  'athlete-001': {
    id: 'athlete-001',
    name: 'Alex Ray',
    email: 'alex.r@test.com',
    dob: '1995-03-15',
    role: 'athlete',
    address: 'San Francisco, CA',
    bio: 'Passionate tennis player looking to improve technique.',
    sport: 'Tennis',
    experience_level: 'Intermediate',
    goals: ['Improve serve technique', 'Compete in tournaments'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  }
};

const mockAvailability = {
  'coach-001': {
    id: 'avail-001',
    coach_id: 'coach-001',
    schedule: {
      monday: { available: true, time_blocks: [{ name: 'Morning', range: '9:00 AM - 12:00 PM' }] },
      tuesday: { available: true, time_blocks: [{ name: 'Afternoon', range: '1:00 PM - 5:00 PM' }] },
      wednesday: { available: false, time_blocks: [] },
      thursday: { available: true, time_blocks: [{ name: 'Evening', range: '6:00 PM - 9:00 PM' }] },
      friday: { available: true, time_blocks: [{ name: 'Morning', range: '9:00 AM - 1:00 PM' }] },
      saturday: { available: false, time_blocks: [] },
      sunday: { available: true, time_blocks: [{ name: 'All Day', range: '10:00 AM - 4:00 PM' }] }
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  }
};

const mockSessions = [];
const mockMessages = [];

// Generate UUID-like IDs for mock data
const generateId = () => {
  return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Simulated Supabase-style API calls
export const dataService = {
  // User operations (equivalent to supabase.from('users'))
  users: {
    async getById(id) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
      return mockUsers[id] || null;
    },

    async getByRole(role) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return Object.values(mockUsers).filter(user => user.role === role);
    },

    async getAll() {
      await new Promise(resolve => setTimeout(resolve, 100));
      return Object.values(mockUsers);
    },

    async create(userData) {
      await new Promise(resolve => setTimeout(resolve, 100));
      const id = generateId();
      const newUser = {
        id,
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockUsers[id] = newUser;
      return newUser;
    },

    async update(id, updates) {
      await new Promise(resolve => setTimeout(resolve, 100));
      if (mockUsers[id]) {
        mockUsers[id] = {
          ...mockUsers[id],
          ...updates,
          updated_at: new Date().toISOString()
        };
        return mockUsers[id];
      }
      throw new Error('User not found');
    }
  },

  // Availability operations (equivalent to supabase.from('availability'))
  availability: {
    async getByCoachId(coachId) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockAvailability[coachId] || null;
    },

    async upsert(coachId, schedule) {
      await new Promise(resolve => setTimeout(resolve, 100));
      const availabilityData = {
        id: mockAvailability[coachId]?.id || generateId(),
        coach_id: coachId,
        schedule,
        created_at: mockAvailability[coachId]?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockAvailability[coachId] = availabilityData;
      return availabilityData;
    }
  },

  // Session operations (equivalent to supabase.from('sessions'))
  sessions: {
    async create(sessionData) {
      await new Promise(resolve => setTimeout(resolve, 100));
      const session = {
        id: generateId(),
        ...sessionData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockSessions.push(session);
      return session;
    },

    async getByUserId(userId, role) {
      await new Promise(resolve => setTimeout(resolve, 100));
      const filterKey = role === 'coach' ? 'coach_id' : 'athlete_id';
      return mockSessions.filter(session => session[filterKey] === userId);
    },

    async update(id, updates) {
      await new Promise(resolve => setTimeout(resolve, 100));
      const sessionIndex = mockSessions.findIndex(s => s.id === id);
      if (sessionIndex !== -1) {
        mockSessions[sessionIndex] = {
          ...mockSessions[sessionIndex],
          ...updates,
          updated_at: new Date().toISOString()
        };
        return mockSessions[sessionIndex];
      }
      throw new Error('Session not found');
    }
  },

  // Message operations (equivalent to supabase.from('messages'))
  messages: {
    async create(messageData) {
      await new Promise(resolve => setTimeout(resolve, 100));
      const message = {
        id: generateId(),
        ...messageData,
        created_at: new Date().toISOString(),
        is_read: false
      };
      mockMessages.push(message);
      return message;
    },

    async getConversation(userId1, userId2) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockMessages.filter(message => 
        (message.sender_id === userId1 && message.receiver_id === userId2) ||
        (message.sender_id === userId2 && message.receiver_id === userId1)
      ).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    },

    async markAsRead(messageId) {
      await new Promise(resolve => setTimeout(resolve, 100));
      const messageIndex = mockMessages.findIndex(m => m.id === messageId);
      if (messageIndex !== -1) {
        mockMessages[messageIndex].is_read = true;
        return mockMessages[messageIndex];
      }
      throw new Error('Message not found');
    }
  }
};

// Helper functions for common queries
export const queryHelpers = {
  async getCoachesInSport(sport) {
    const coaches = await dataService.users.getByRole('coach');
    return coaches.filter(coach => coach.sport === sport);
  },

  async getAvailableCoaches(sport, day) {
    const coaches = await this.getCoachesInSport(sport);
    const availableCoaches = [];
    
    for (const coach of coaches) {
      const availability = await dataService.availability.getByCoachId(coach.id);
      if (availability?.schedule[day]?.available) {
        availableCoaches.push({
          ...coach,
          availability: availability.schedule[day]
        });
      }
    }
    
    return availableCoaches;
  },

  async getUserConversations(userId) {
    const conversationMap = new Map();

    mockMessages.forEach(message => {
      const partnerId = message.sender_id === userId ? message.receiver_id : message.sender_id;
      if (message.sender_id === userId || message.receiver_id === userId) {
        if (!conversationMap.has(partnerId) || 
            new Date(message.created_at) > new Date(conversationMap.get(partnerId).last_message_time)) {
          conversationMap.set(partnerId, {
            partner_id: partnerId,
            last_message: message.content,
            last_message_time: message.created_at,
            unread_count: 0 // Would calculate this properly in real implementation
          });
        }
      }
    });

    return Array.from(conversationMap.values());
  }
};