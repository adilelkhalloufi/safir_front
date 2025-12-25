import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';
import { 
  IconCalendar, 
  IconX, 
  IconUserPlus 
} from '@tabler/icons-react';

interface RecentActivity {
  id: number;
  type: 'booking' | 'cancellation' | 'registration';
  title: string;
  description: string;
  user: string;
  timestamp: string;
  status?: string;
}

interface RecentActivityFeedProps {
  activities: RecentActivity[];
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  const { t } = useTranslation();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <IconCalendar className='h-4 w-4' />;
      case 'cancellation':
        return <IconX className='h-4 w-4' />;
      case 'registration':
        return <IconUserPlus className='h-4 w-4' />;
      default:
        return <IconCalendar className='h-4 w-4' />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'bg-blue-100 text-blue-600';
      case 'cancellation':
        return 'bg-red-100 text-red-600';
      case 'registration':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      confirmed: { variant: 'default', label: t('dashboard.confirmed') },
      pending: { variant: 'secondary', label: t('dashboard.pending') },
      cancelled: { variant: 'destructive', label: t('dashboard.cancelled') },
      completed: { variant: 'outline', label: t('dashboard.completed') },
    };

    const config = statusConfig[status] || { variant: 'secondary' as const, label: status };
    return <Badge variant={config.variant} className='ml-2 text-xs'>{config.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {activities.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              {t('dashboard.noRecentActivity')}
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className='flex items-start gap-4'>
                <div className={`rounded-full p-2 ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className='flex-1 space-y-1'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <p className='text-sm font-medium leading-none'>
                        {activity.title}
                      </p>
                      {getStatusBadge(activity.status)}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      {activity.timestamp}
                    </p>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    {activity.description}
                  </p>
                  <div className='flex items-center gap-2 pt-1'>
                    <Avatar className='h-6 w-6'>
                      <AvatarFallback className='text-xs'>
                        {activity.user.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className='text-xs text-muted-foreground'>
                      {activity.user}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
