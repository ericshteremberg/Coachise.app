
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { User } from '@/api/entities';
import { Session } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { ArrowLeft, MessageCircle, MapPin, Calendar, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BookingModal from '../components/booking/BookingModal';
import BookingConfirmationModal from '../components/booking/BookingConfirmationModal';

// MOCK DATA for demonstration until real users are invited
const mockUsers = {
    'coach-1': { 
        id: 'coach-1', 
        full_name: 'Sarah Johnson', 
        email: 'sarah.j@test.com', 
        user_type: 'coach', 
        sport: 'Tennis', 
        location: 'San Francisco, CA', 
        rating: 4.8, 
        price_per_session: 75, 
        bio: 'Professional tennis coach with 10+ years of experience. I focus on technique analysis and mental resilience to help athletes reach their full potential.', 
        specialties: ['Technique Analysis', 'Mental Training'], 
        profile_picture_url: 'https://images.unsplash.com/photo-1544005313-91ddf3d7a8c3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        availability: {
            Monday: { available: true, time_blocks: [{ name: 'Morning (9am-12pm)', custom_range: '9:00 AM - 12:00 PM' }] },
            Tuesday: { available: true, time_blocks: [{ name: 'Afternoon (1pm-5pm)', custom_range: '1:00 PM - 5:00 PM' }] },
            Wednesday: { available: false },
            Thursday: { available: true, time_blocks: [{ name: 'Evening (6pm-9pm)', custom_range: '6:00 PM - 9:00 PM' }] },
            Friday: { available: true, time_blocks: [{ name: 'Morning (9am-1pm)', custom_range: '9:00 AM - 1:00 PM' }, { name: 'Afternoon (2pm-6pm)', custom_range: '2:00 PM - 6:00 PM' }] },
            Saturday: { available: false },
            Sunday: { available: true, time_blocks: [{ name: 'All Day', custom_range: '10:00 AM - 4:00 PM' }] },
        }
    },
    'coach-2': { 
        id: 'coach-2', 
        full_name: 'Mike Chen', 
        email: 'mike.c@test.com', 
        user_type: 'coach', 
        sport: 'Basketball', 
        location: 'Los Angeles, CA', 
        rating: 4.2, 
        price_per_session: 65, 
        bio: 'Former college basketball player turned coach, passionate about developing strong fundamentals and game strategy.', 
        specialties: ['Shooting Technique', 'Defense'], 
        profile_picture_url: 'https://images.unsplash.com/photo-1507003211169-0a6dd7228e27?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        availability: {
            Monday: { available: false },
            Tuesday: { available: true, time_blocks: [{ name: 'Morning (10am-1pm)', custom_range: '10:00 AM - 1:00 PM' }] },
            Wednesday: { available: true, time_blocks: [{ name: 'Afternoon (2pm-5pm)', custom_range: '2:00 PM - 5:00 PM' }] },
            Thursday: { available: false },
            Friday: { available: true, time_blocks: [{ name: 'Evening (5pm-8pm)', custom_range: '5:00 PM - 8:00 PM' }] },
            Saturday: { available: true, time_blocks: [{ name: 'Morning (9am-12pm)', custom_range: '9:00 AM - 12:00 PM' }] },
            Sunday: { available: false },
        }
    },
    'coach-3': { 
        id: 'coach-3', 
        full_name: 'Emma Rodriguez', 
        email: 'emma.r@test.com', 
        user_type: 'coach', 
        sport: 'Swimming', 
        location: 'Miami, FL', 
        rating: 4.9, 
        price_per_session: 80, 
        bio: 'Olympic swimming coach, bringing elite training techniques to all levels. Focus on stroke analysis and endurance.', 
        specialties: ['Stroke Analysis', 'Endurance'], 
        profile_picture_url: 'https://images.unsplash.com/photo-1534528736603-cdcd7de385e0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        availability: {
            Monday: { available: true, time_blocks: [{ name: 'Afternoon (1pm-4pm)', custom_range: '1:00 PM - 4:00 PM' }] },
            Tuesday: { available: false },
            Wednesday: { available: true, time_blocks: [{ name: 'Morning (8am-11am)', custom_range: '8:00 AM - 11:00 AM' }] },
            Thursday: { available: true, time_blocks: [{ name: 'Evening (6pm-9pm)', custom_range: '6:00 PM - 9:00 PM' }] },
            Friday: { available: false },
            Saturday: { available: true, time_blocks: [{ name: 'Afternoon (1pm-5pm)', custom_range: '1:00 PM - 5:00 PM' }] },
            Sunday: { available: false },
        }
    },
};

export default function CoachProfile() {
  const location = useLocation();
  const [coach, setCoach] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [lastBookedSession, setLastBookedSession] = useState(null);
  const [error, setError] = useState(null);

  const urlParams = new URLSearchParams(location.search);
  const coachId = urlParams.get('id');

  useEffect(() => {
    if (!coachId) {
      setError("No coach ID provided in URL.");
      setIsLoading(false);
      return;
    }
    loadPageData(coachId);
  }, [coachId]);

  const loadPageData = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await User.me();
      setCurrentUser(user);

      // Fetch coach data from our mock object
      const coachData = mockUsers[id];
      if (!coachData) {
        throw new Error("Coach not found with the provided ID.");
      }
      setCoach(coachData);

    } catch (err) {
      console.error("Failed to load profile data:", err);
      setError(err.message || "Could not load coach profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookSession = async (sessionDetails) => {
    if (!currentUser || !coach) return;
    try {
        const newSessionData = {
            coach_id: coach.id,
            athlete_id: currentUser.id,
            service_type: sessionDetails.sessionType,
            date: sessionDetails.date,
            time: sessionDetails.time,
            duration: 60, // Default duration
            location: sessionDetails.location,
            notes: sessionDetails.notes,
            status: 'pending',
            price: coach.price_per_session || 50,
        };
        await Session.create(newSessionData);

        setLastBookedSession(sessionDetails);
        setIsBookingModalOpen(false);
        setIsConfirmationModalOpen(true);
    } catch (error) {
      console.error('Error booking session:', error);
      alert('Failed to book session. Please try again.');
    }
  };
  
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const formatAvailability = (availability) => {
    if (!availability || typeof availability !== 'object') return [];
    return Object.entries(availability).map(([day, details]) => {
      if (!details?.available) return { day, times: ['Unavailable'] };
      const times = details.time_blocks?.map(block => block.custom_range || block.name.split(' (')[0]);
      return { day, times: times?.length > 0 ? times : ['Available'] };
    });
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-600">Loading coach profile...</p>
            </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center">
                <h2 className="text-xl font-bold text-red-600">Error!</h2>
                <p className="text-gray-600">{error}</p>
                <Link to={createPageUrl('Dashboard')} className="mt-4 inline-block">
                    <Button>Back to Dashboard</Button>
                </Link>
            </div>
        </div>
    );
  }

  return coach ? (
    <>
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        coach={coach}
        onBookSession={handleBookSession}
      />
      
      <BookingConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        coachName={coach.full_name}
        sessionDetails={lastBookedSession}
      />

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
                <h1 className="text-xl font-semibold text-gray-900">Coach Profile</h1>
                </div>
            </div>

            {/* Profile Header */}
            <div className="bg-white p-6 border-b border-gray-200">
                <div className="flex items-start space-x-4">
                    {coach.profile_picture_url ? (
                        <img src={coach.profile_picture_url} alt={`${coach.full_name}'s profile`} className="w-20 h-20 rounded-full object-cover shadow-md flex-shrink-0" />
                    ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                            <span className="text-white font-bold text-2xl">
                                {getInitials(coach.full_name)}
                            </span>
                        </div>
                    )}
                    
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                            {coach.full_name}
                        </h2>
                        <p className="text-gray-600 mb-2">{coach.sport} Coach</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {coach.location}
                            </div>
                            <div className="flex items-center">
                                <Award className="w-4 h-4 mr-1" />
                                {coach.rating ? coach.rating.toFixed(1) : 'N/A'} ★
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white p-4 border-b border-gray-200 space-y-3">
                <Button 
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl"
                >
                    <Calendar className="w-5 h-5 mr-2" />
                    Book a Session
                </Button>
                
                <Button 
                    variant="outline" 
                    className="w-full border-gray-300 py-3 rounded-xl"
                    onClick={() => {
                        window.location.href = createPageUrl('Chats') + `?openChat=${coach.id}&userName=${encodeURIComponent(coach.full_name)}&userType=coach&userSport=${encodeURIComponent(coach.sport)}`;
                    }}
                >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Send Message
                </Button>
            </div>

            {/* Bio Section */}
            <div className="bg-white p-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-600 leading-relaxed">
                    {coach.bio || 'No bio available.'}
                </p>
            </div>

            {/* Specialties */}
            {coach.specialties && coach.specialties.length > 0 && (
                <div className="bg-white p-6 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                        {coach.specialties?.map((specialty, index) => (
                            <Badge key={index} className="bg-blue-100 text-blue-800">
                                {specialty}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Pricing */}
            <div className="bg-white p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900">Session Rate</h3>
                        <p className="text-gray-600">Per hour</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                            ${coach.price_per_session || 50}
                        </p>
                    </div>
                </div>
            </div>

            {/* Availability */}
            <div className="bg-white p-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
                <div className="space-y-2">
                    {formatAvailability(coach.availability).map((dayData, index) => (
                        <div key={index} className="flex justify-between items-start text-sm">
                            <span className="font-medium text-gray-800">{dayData.day}:</span>
                            <div className="text-right text-gray-600">
                                {dayData.times.map((time, timeIdx) => (
                                    <p key={timeIdx}>{time}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </>
  ) : (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">Profile not found.</h2>
            <p className="text-gray-600">The profile you are looking for may not exist or there was an error.</p>
            <Link to={createPageUrl('Dashboard')} className="mt-4 inline-block">
                <Button>Back to Dashboard</Button>
            </Link>
        </div>
    </div>
  );
}
