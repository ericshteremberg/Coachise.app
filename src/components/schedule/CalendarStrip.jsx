import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addDays, startOfWeek, isSameDay, isToday } from 'date-fns';

export default function CalendarStrip({ selectedDate, onDateSelect, currentWeek, setCurrentWeek }) {
  const weekStartsOn = 1; // Monday
  const week = Array.from({ length: 7 }).map((_, i) =>
    addDays(startOfWeek(currentWeek, { weekStartsOn }), i)
  );

  const handlePrevWeek = () => {
    setCurrentWeek(addDays(currentWeek, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addDays(currentWeek, 7));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={handlePrevWeek} className="rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h3 className="font-semibold text-gray-900 text-center">
          {format(currentWeek, 'MMMM yyyy')}
        </h3>
        <Button variant="ghost" size="icon" onClick={handleNextWeek} className="rounded-full">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
      <div className="flex justify-between items-center space-x-1">
        {week.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentDay = isToday(day);
          
          return (
            <button
              key={day.toString()}
              onClick={() => onDateSelect(day)}
              className={`flex flex-col items-center justify-center w-12 h-20 rounded-xl transition-all duration-200 ${
                isSelected
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className={`text-xs font-medium ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                {format(day, 'E')}
              </span>
              <span className={`text-xl font-bold mt-1 ${
                  isCurrentDay && !isSelected ? 'text-blue-500' : ''
                }`
              }>
                {format(day, 'd')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}