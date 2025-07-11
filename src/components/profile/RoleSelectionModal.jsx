import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, ShieldCheck } from 'lucide-react';

export default function RoleSelectionModal({ isOpen, onOpenChange, onSelectRole }) {
  const handleSelect = (role) => {
    if (onSelectRole) {
      onSelectRole(role);
    }
    onOpenChange(false); // Close the modal after selection
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Select Your Role</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Choose the role that best describes you on the Coachise platform. This can be changed later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-6">
          {/* Athlete Option */}
          <div 
            onClick={() => handleSelect('athlete')} 
            className="flex items-start space-x-4 p-4 rounded-xl border-2 border-transparent hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Athlete</h4>
              <p className="text-gray-600 text-sm mt-1">
                I'm looking to connect with qualified coaches to improve my skills.
              </p>
            </div>
          </div>

          {/* Coach Option */}
          <div 
            onClick={() => handleSelect('coach')}
            className="flex items-start space-x-4 p-4 rounded-xl border-2 border-transparent hover:border-green-500 hover:bg-green-50 cursor-pointer transition-all"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Coach</h4>
              <p className="text-gray-600 text-sm mt-1">
                I'm a professional offering coaching services to athletes.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}