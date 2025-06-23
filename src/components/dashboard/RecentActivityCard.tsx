
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClaimStatus, InsuranceStatus } from '@/models/types';

interface ActivityItem {
  id: string;
  type: 'policy' | 'claim' | 'payment';
  title: string;
  status: InsuranceStatus | ClaimStatus | 'paid' | 'pending' | 'failed';
  date: Date;
  amount?: number;
}

interface RecentActivityCardProps {
  activities: ActivityItem[];
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ activities }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
      case 'cancelled':
      case 'rejected':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest transactions and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{activity.title}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(activity.date)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {activity.amount && (
                  <span className="text-sm font-medium">
                    KES {activity.amount.toLocaleString()}
                  </span>
                )}
                <Badge className={getStatusColor(activity.status)} variant="outline">
                  {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
