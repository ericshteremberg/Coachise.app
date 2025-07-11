import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp } from 'lucide-react';

export default function RevenueCard() {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Overview</h2>
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-600" />
            This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">$2,450</p>
              <div className="flex items-center text-green-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+12% from last month</span>
              </div>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>29 sessions completed</p>
              <p>Avg. $84 per session</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}