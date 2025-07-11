import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Check, X } from 'lucide-react';

export default function ProfileSection({ title, children, onSave, isEditing, setIsEditing }) {
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    onSave();
    setIsEditing(false);
  };

  return (
    <Card className="bg-white border-gray-200 rounded-2xl shadow-sm mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
          {!isEditing ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
            >
              <Edit className="w-4 h-4" />
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full"
              >
                <Check className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}