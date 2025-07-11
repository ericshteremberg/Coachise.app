import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';

const sports = ['Tennis', 'Basketball', 'Swimming', 'Soccer', 'Running', 'Yoga', 'Golf'];
const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function FilterModal({ isOpen, onClose, initialFilters, onApplyFilters }) {
  const [filters, setFilters] = useState(initialFilters);

  const handleValueChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const handleAvailabilityChange = (day, checked) => {
    setFilters(prev => {
        const newAvailability = checked 
            ? [...prev.availability, day]
            : prev.availability.filter(d => d !== day);
        return { ...prev, availability: newAvailability };
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onApplyFilters(initialFilters);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Filters</DialogTitle>
          <DialogDescription>
            Refine your search to find the perfect match.
          </DialogDescription>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto px-1">
          <div className="space-y-2">
            <Label htmlFor="sport">Sport</Label>
            <Select value={filters.sport} onValueChange={(value) => handleValueChange('sport', value)}>
              <SelectTrigger id="sport">
                <SelectValue placeholder="Select a sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                {sports.map(sport => <SelectItem key={sport} value={sport}>{sport}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Gender</Label>
             <RadioGroup defaultValue={filters.gender} value={filters.gender} onValueChange={(value) => handleValueChange('gender', value)} className="flex space-x-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="all" id="gender-all" /><Label htmlFor="gender-all">All</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="male" id="gender-male" /><Label htmlFor="gender-male">Male</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="female" id="gender-female" /><Label htmlFor="gender-female">Female</Label></div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Skill Level</Label>
            <RadioGroup defaultValue={filters.skillLevel} value={filters.skillLevel} onValueChange={(value) => handleValueChange('skillLevel', value)} className="flex flex-wrap gap-x-4 gap-y-2">
               <div className="flex items-center space-x-2"><RadioGroupItem value="all" id="skill-all" /><Label htmlFor="skill-all">All</Label></div>
              {skillLevels.map(level => (
                 <div key={level} className="flex items-center space-x-2"><RadioGroupItem value={level} id={`skill-${level}`} /><Label htmlFor={`skill-${level}`}>{level}</Label></div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}</Label>
            <Slider
              value={filters.ageRange}
              onValueChange={(value) => handleValueChange('ageRange', value)}
              min={18} max={80} step={1}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Availability</Label>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
                {days.map(day => (
                    <div key={day} className="flex items-center space-x-2">
                        <Checkbox 
                            id={`day-${day}`} 
                            checked={filters.availability.includes(day)}
                            onCheckedChange={(checked) => handleAvailabilityChange(day, checked)}
                        />
                        <Label htmlFor={`day-${day}`}>{day}</Label>
                    </div>
                ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between">
          <Button variant="ghost" onClick={handleReset}>Reset Filters</Button>
          <Button onClick={handleApply} className="bg-blue-500 hover:bg-blue-600">Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}