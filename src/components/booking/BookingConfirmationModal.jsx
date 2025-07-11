import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Clock, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';

export default function BookingConfirmationModal({ 
  isOpen, 
  onClose, 
  coachName, 
  sessionDetails 
}) {
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl p-0">
        <DialogHeader className="p-6 pb-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Session Request Sent!
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Your session request has been sent to {coachName}. 
            You'll be notified once they respond.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3">Session Details</h3>
            
            <div className="flex items-center text-gray-700">
              <User className="w-4 h-4 mr-3 text-gray-500" />
              <span className="font-medium">{sessionDetails.sessionType}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Calendar className="w-4 h-4 mr-3 text-gray-500" />
              <span>{format(new Date(sessionDetails.date), 'EEEE, MMMM d, yyyy')}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Clock className="w-4 h-4 mr-3 text-gray-500" />
              <span>{formatTime(sessionDetails.time)}</span>
            </div>
            
            {sessionDetails.location && (
              <div className="flex items-center text-gray-700">
                <MapPin className="w-4 h-4 mr-3 text-gray-500" />
                <span>{sessionDetails.location}</span>
              </div>
            )}
            
            {sessionDetails.notes && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Notes:</strong> {sessionDetails.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-6 bg-gray-50 border-t rounded-b-2xl">
          <Button 
            onClick={onClose} 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}