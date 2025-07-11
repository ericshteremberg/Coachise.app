import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { User } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { ArrowLeft, MessageCircle, MapPin, Calendar, Award, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// MOCK DATA for demonstration until real users are invited
const mockAthletes = {
  'athlete-1': {
    id: 'athlete-1',
    full_name: 'Alex Ray',
    email: 'alex.r@test.com',
    user_type: 'athlete',
    sport: 'Tennis',
    location: 'San Francisco, CA',
    experience_level: 'Intermediate',
    date_of_birth: '1995-03-15',
    bio: 'Passionate tennis player looking to improve my technique and compete at higher levels. I love the mental and physical challenge of the game.',
    specialties: ['Forehand', 'Net Play'],
    goals: ['Improve serve technique', 'Compete in local tournaments', 'Build consistency']
  },
  'athlete-2': {
    id: 'athlete-2',
    full_name: 'Jordan Lee',
    email: 'jordan.l@test.com',
    user_type: 'athlete',
    sport: 'Basketball',
    location: 'Los Angeles, CA',
    experience_level: 'Beginner',
    date_of_birth: '1998-07-22',
    bio: 'New to basketball but eager to learn. Looking for a coach to help me develop fundamental skills and build confidence on the court.',
    specialties: ['Defense', 'Hustle'],
    goals: ['Learn basic dribbling', 'Improve shooting form', 'Build endurance']
  },
  'athlete-3': {
    id: 'athlete-3',
    full_name: 'Taylor Swift',
    email: 'taylor.s@test.com',
    user_type: 'athlete',
    sport: 'Swimming',
    location: 'Miami, FL',
    experience_level: 'Advanced',
    date_of_birth: '1992-12-10',
    bio: 'Competitive swimmer with 8+ years of experience. Looking to refine technique and prepare for masters competitions.',
    specialties: ['Freestyle', 'Butterfly'],
    goals: ['Improve stroke efficiency', 'Reduce lap times', 'Masters competition prep']
  }
};

export default function AthleteProfile() {
  const location = useLocation();
  const [athlete, setAthlete] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const urlParams = new URLSearchParams(location.search);
  const athleteId = urlParams.get('id');

  useEffect(() => {
    const loadPageData = async () => {
      setIsLoading(true);
      setError(null);
      setAthlete(null);

      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (err) {
        console.error("Failed to load current user:", err);
      }

      await loadAthleteProfile();
      setIsLoading(false);
    };
    
    loadPageData();
  }, [athleteId]);

  const loadAthleteProfile = async () => {
    if (!athleteId) {
      setError("No athlete ID was provided to load the profile.");
      return;
    }
    
    // Try to find athlete in mock data first
    const selectedAthlete = mockAthletes[athleteId];
    
    if (selectedAthlete) {
      setAthlete(selectedAthlete);
      return;
    }

    // If not in mock data, try to fetch from database
    try {
      const users = await User.list();
      const foundAthlete = users.find(u => u.id === athleteId && u.user_type === 'athlete');
      
      if (foundAthlete) {
        setAthlete(foundAthlete);
      } else {
        setError(`We couldn't find this athlete's profile. Invalid ID: ${athleteId}`);
      }
    } catch (error) {
      console.error('Error fetching athlete:', error);
      setError("Failed to load athlete profile. Please try again.");
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading athlete profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to={createPageUrl('Dashboard')}>
            <Button className="bg-blue-500 hover:bg-blue-600">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return athlete ? (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto pb-24">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 safe-area-top sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <Link to={createPageUrl('Dashboard')}>
              <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Athlete Profile</h1>
          </div>
        </div>

        {/* Profile Header */}
        <div className="bg-white p-6 border-b border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-2xl">
                {getInitials(athlete.full_name)}
              </span>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {athlete.full_name}
              </h2>
              <p className="text-gray-600 mb-2">{athlete.sport} Athlete</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {athlete.location}
                </div>
                {athlete.date_of_birth && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Age {calculateAge(athlete.date_of_birth)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="bg-white p-4 border-b border-gray-200">
          <Button 
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl"
            onClick={() => {
              // Ready to be connected to messaging system
              window.location.href = createPageUrl('Chats') + `?openChat=${athlete.id}&userName=${encodeURIComponent(athlete.full_name)}&userType=athlete&userSport=${encodeURIComponent(athlete.sport)}`;
            }}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Start a Conversation
          </Button>
        </div>

        {/* Bio Section */}
        <div className="bg-white p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">About</h3>
          <p className="text-gray-600 leading-relaxed">
            {athlete.bio || 'No bio available.'}
          </p>
        </div>

        {/* Experience Level */}
        <div className="bg-white p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Experience Level</h3>
          <Badge className="bg-green-100 text-green-800 text-base px-3 py-1">
            {athlete.experience_level}
          </Badge>
        </div>

        {/* Strengths/Specialties */}
        {athlete.specialties && athlete.specialties.length > 0 && (
          <div className="bg-white p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Strengths</h3>
            <div className="flex flex-wrap gap-2">
              {athlete.specialties.map((specialty, index) => (
                <Badge key={index} className="bg-blue-100 text-blue-800">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Goals */}
        {athlete.goals && athlete.goals.length > 0 && (
          <div className="bg-white p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Goals</h3>
            <ul className="space-y-2">
              {athlete.goals.map((goal, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-600">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Personal Details */}
        <div className="bg-white p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Personal Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-800">Date of Birth:</span>
              <span className="text-gray-600">{formatDate(athlete.date_of_birth)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-800">Sport:</span>
              <span className="text-gray-600">{athlete.sport}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-800">Location:</span>
              <span className="text-gray-600">{athlete.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}