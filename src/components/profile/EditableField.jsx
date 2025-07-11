import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EditableField({ 
  label, 
  value, 
  onChange, 
  isEditing, 
  type = 'text',
  options = null,
  placeholder = ''
}) {
  if (!isEditing) {
    return (
      <div className="mb-4">
        <Label className="text-sm font-medium text-gray-600 mb-1 block">{label}</Label>
        <p className="text-gray-900 font-medium">{value || 'Not set'}</p>
      </div>
    );
  }

  if (type === 'select' && options) {
    return (
      <div className="mb-4">
        <Label className="text-sm font-medium text-gray-600 mb-2 block">{label}</Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <Label className="text-sm font-medium text-gray-600 mb-2 block">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}