// Future Supabase Schema Documentation
// This component contains the SQL schema for future migration reference

export const SupabaseSchema = () => {
  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Future Supabase Schema</h2>
      <p className="mb-4 text-gray-700">
        This schema matches our current data structure exactly and will be used 
        when migrating to Supabase + React Native + Expo.
      </p>
      
      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
        <pre>{`-- Future Supabase Schema (for reference and migration planning)
-- This matches our current data structure exactly

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  dob DATE,
  role TEXT CHECK (role IN ('coach', 'athlete')) NOT NULL,
  address TEXT,
  rate DECIMAL(10,2), -- For coaches
  bio TEXT,
  specialties TEXT[], -- Array of specialties
  sport TEXT,
  rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
  experience_level TEXT CHECK (experience_level IN ('Beginner', 'Intermediate', 'Advanced', 'Professional')),
  goals TEXT[], -- Array of goals for athletes
  profile_image TEXT, -- URL to profile image
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coach availability table
CREATE TABLE public.availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  coach_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  schedule JSONB NOT NULL, -- Flexible schedule structure
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(coach_id)
);

-- Sessions table
CREATE TABLE public.sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  coach_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  date DATE NOT NULL,
  time_block TEXT NOT NULL,
  duration INTEGER DEFAULT 60, -- Duration in minutes
  location TEXT,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  notes TEXT,
  price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('text', 'image', 'file')) DEFAULT 'text',
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_sport ON public.users(sport);
CREATE INDEX idx_sessions_coach ON public.sessions(coach_id);
CREATE INDEX idx_sessions_athlete ON public.sessions(athlete_id);
CREATE INDEX idx_sessions_date ON public.sessions(date);
CREATE INDEX idx_messages_conversation ON public.messages(sender_id, receiver_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can read all profiles, but only update their own
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Coaches can manage their own availability
CREATE POLICY "Coaches can manage own availability" ON public.availability 
  FOR ALL USING (auth.uid() = coach_id);

-- Users can view sessions they're involved in
CREATE POLICY "Users can view own sessions" ON public.sessions 
  FOR SELECT USING (auth.uid() = coach_id OR auth.uid() = athlete_id);

-- Users can create sessions (booking)
CREATE POLICY "Users can create sessions" ON public.sessions 
  FOR INSERT WITH CHECK (auth.uid() = coach_id OR auth.uid() = athlete_id);

-- Users can update sessions they're involved in
CREATE POLICY "Users can update own sessions" ON public.sessions 
  FOR UPDATE USING (auth.uid() = coach_id OR auth.uid() = athlete_id);

-- Users can view messages they're involved in
CREATE POLICY "Users can view own messages" ON public.messages 
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can send messages
CREATE POLICY "Users can send messages" ON public.messages 
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Real-time subscriptions for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;`}</pre>
      </div>
    </div>
  );
};

export default SupabaseSchema;