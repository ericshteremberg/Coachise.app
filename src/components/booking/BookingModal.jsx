import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { X, AlertTriangle } from 'lucide-react';
import { format, getDay, parse } from 'date-fns';

const dayMap = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function BookingModal({ isOpen, onClose, coach, onBookSession }) {
  const [date, setDate] = useState(undefined);
  const [time, setTime] = useState('');
  const [sessionType, setSessionType] = useState(coach?.specialties?.[0] || 'General Session');
  const [location, setLocation] = useState(coach?.location || '');
  const [notes, setNotes] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  
  const coachAvailability = coach?.availability || {};

  useEffect(() => {
    if (!date || !coachAvailability) {
      setAvailableTimeSlots([]);
      return;
    }

    const dayName = dayMap[getDay(date)];
    const dayData = coachAvailability[dayName];

    if (!dayData || !dayData.available) {
      setAvailableTimeSlots([]);
      return;
    }

    const parseTime12h = (timeStr) => {
        let cleanTime = timeStr.trim().toLowerCase();
        cleanTime = cleanTime.replace(/(\d)(am|pm)/, '$1 $2');
        const formats = ['h:mm a', 'h a', 'H:mm', 'H'];
        for (const fmt of formats) {
            const parsedDate = parse(cleanTime, fmt, new Date());
            if (parsedDate.toString() !== 'Invalid Date') return parsedDate;
        }
        return null;
    };

    let allSlots = [];
    dayData.time_blocks?.forEach(block => {
      let rangeStr = '';
      if (block.custom_range && block.custom_range.trim().includes('-')) {
        rangeStr = block.custom_range;
      } else {
        const match = block.name.match(/\(([^)]+)\)/);
        rangeStr = match ? match[1] : '';
      }
      
      if (!rangeStr || !rangeStr.includes('-')) return;

      const [startStr, endStr] = rangeStr.split('-').map(s => s.trim());
      const startTime = parseTime12h(startStr);
      const endTime = parseTime12h(endStr);
      
      if (!startTime || !endTime) return;

      let currentTime = new Date(startTime);
      while (currentTime < endTime) {
        allSlots.push(format(currentTime, 'h:mm a'));
        currentTime.setHours(currentTime.getHours() + 1);
      }
    });

    setAvailableTimeSlots([...new Set(allSlots)]);

  }, [date, coachAvailability]);


  const disabledDays = (d) => {
    const dayName = dayMap[getDay(d)];
    const dayAvailability = coachAvailability[dayName];
    return !dayAvailability || !dayAvailability.available;
  };

  const handleBooking = () => {
    if (!date || !time) {
      alert('Please select a date and time.');
      return;
    }
    const sessionTime = time;
    onBookSession({ date: format(date, 'yyyy-MM-dd'), time: sessionTime, sessionType, location, notes });
  };
  
  useEffect(() => {
    setTime('');
  }, [date]);

  useEffect(() => {
      setLocation(coach?.location || '');
      setSessionType(coach?.specialties?.[0] || 'General Session');
  }, [coach]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Book a Session</DialogTitle>
          <DialogDescription>
            Schedule a session with {coach?.full_name}. Please choose an available time slot.
          </DialogDescription>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto px-1">
          <div>
            <Label className="font-semibold">1. Select a Date</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={disabledDays}
              className="rounded-md border mt-2"
              fromDate={new Date()}
            />
          </div>

          {date && (
            <div>
              <Label className="font-semibold">2. Select a Time</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableTimeSlots.length > 0 ? (
                  availableTimeSlots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={time === slot ? 'default' : 'outline'}
                      onClick={() => setTime(slot)}
                    >
                      {slot}
                    </Button>
                  ))
                ) : (
                  <div className="flex items-center text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg w-full">
                     <AlertTriangle className="w-4 h-4 mr-2" />
                    <span>No time slots available for this day.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="sessionType" className="font-semibold">3. Session Details</Label>
            <Input id="sessionType" value={sessionType} onChange={(e) => setSessionType(e.target.value)} placeholder="e.g., Technique Analysis" className="mt-2" />
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="mt-2" />
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes for the coach (optional)" className="mt-2" />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleBooking} disabled={!date || !time} className="bg-blue-500 hover:bg-blue-600 w-full">
            Request Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}