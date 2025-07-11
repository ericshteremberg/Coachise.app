import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function SearchBar({ onSearch, onFilterClick, searchTerm, placeholder = "Search..." }) {
  return (
    <div className="flex items-center gap-2 w-full mb-6">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-12 pr-4 py-4 w-full bg-white border border-gray-200 rounded-2xl text-base placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
        />
      </div>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onFilterClick} 
        className="h-14 w-14 flex-shrink-0 rounded-2xl bg-white border-gray-200"
      >
        <SlidersHorizontal className="h-5 w-5 text-gray-500" />
      </Button>
    </div>
  );
}