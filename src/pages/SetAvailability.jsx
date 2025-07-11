import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2, Check, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User } from '@/api/entities';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const timeBlocks = ['Morning (8am-12pm)', 'Afternoon (12pm-5pm)', 'Evening (5pm-9pm)'];

const initialAvailability = daysOfWeek.reduce((acc, day) => {
  acc[day] = { available: false, time_blocks: [] };
  return acc;
}, {});

export default function SetAvailability() {
  const [currentUser, setCurrentUser] = useState(null);
  const [availability, setAvailability] = useState(initialAvailability);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        if (user.availability && Object.keys(user.availability).length > 0) {
          // Ensure data structure is modern
          const migratedAvailability = { ...initialAvailability };
          daysOfWeek.forEach(day => {
            const dayData = user.availability[day];
            if (dayData && dayData.available) {
              migratedAvailability[day] = {
                available: true,
                time_blocks: dayData.time_blocks?.map(block => 
                  typeof block === 'string' 
                  ? { name: block, custom_range: '' } 
                  : block
                ) || []
              };
            }
          });
          setAvailability(migratedAvailability);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, []);

  const toggleDay = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        available: !prev[day].available,
      },
    }));
  };

  const toggleTimeBlock = (day, blockName) => {
    setAvailability(prev => {
      const dayData = { ...(prev[day] || { available: false, time_blocks: [] }) };
      const existingBlockIndex = dayData.time_blocks.findIndex(b => b.name === blockName);

      if (existingBlockIndex > -1) {
        dayData.time_blocks.splice(existingBlockIndex, 1);
      } else {
        dayData.time_blocks.push({ name: blockName, custom_range: '' });
      }
      return { ...prev, [day]: dayData };
    });
  };
  
  const handleCustomTimeChange = (day, blockName, value) => {
    setAvailability(prev => {
        const dayData = { ...prev[day] };
        const blockIndex = dayData.time_blocks.findIndex(b => b.name === blockName);
        if (blockIndex > -1) {
            dayData.time_blocks[blockIndex].custom_range = value;
        }
        return { ...prev, [day]: dayData };
    });
  };

  const saveAvailability = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData({ availability });
      navigate(createPageUrl('Dashboard'));
    } catch (error) {
      console.error('Error saving availability:', error);
      alert('Failed to save availability. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
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
            <h1 className="text-xl font-semibold text-gray-900">Set Weekly Availability</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Select Available Days (Recurring)</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center flex-wrap gap-2 px-2">
              {daysOfWeek.map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`flex flex-col items-center justify-center w-12 h-16 rounded-xl transition-all duration-200 ${
                    availability[day]?.available ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="font-bold">{day}</span>
                  {availability[day]?.available ? <Check className="w-5 h-5 mt-1" /> : <X className="w-5 h-5 mt-1 text-gray-400" />}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Select Available Time Blocks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {daysOfWeek.filter(day => availability[day]?.available).length > 0 ? (
                daysOfWeek.filter(day => availability[day]?.available).map(day => (
                  <div key={day}>
                    <h3 className="font-semibold text-gray-800 mb-2">{day}</h3>
                    <div className="space-y-3">
                      {timeBlocks.map(blockName => {
                        const isSelected = availability[day]?.time_blocks?.some(b => b.name === blockName);
                        const customRange = availability[day]?.time_blocks?.find(b => b.name === blockName)?.custom_range || '';
                        
                        return (
                          <div key={blockName}>
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => toggleTimeBlock(day, blockName)}
                                className={`flex items-center justify-center w-6 h-6 rounded-md transition-colors ${
                                  isSelected ? 'bg-blue-500' : 'border border-gray-300 bg-white'
                                }`}
                              >
                                {isSelected && <Check className="w-4 h-4 text-white" />}
                              </button>
                              <span className="flex-1 text-gray-700">{blockName.split(' (')[0]}</span>
                              <span className="text-sm text-gray-500">({blockName.split(' (')[1]}</span>
                            </div>
                            {isSelected && (
                              <div className="mt-2 ml-9 flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <Input
                                  type="text"
                                  placeholder="e.g., 9am-11:30am"
                                  value={customRange}
                                  onChange={(e) => handleCustomTimeChange(day, blockName, e.target.value)}
                                  className="h-9"
                                />
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">Select a day to set time blocks.</p>
              )}
            </CardContent>
          </Card>
          
          <div className="pt-4">
            <Button 
              onClick={saveAvailability} 
              disabled={isSaving} 
              className="w-full text-lg py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Confirm Availability
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}