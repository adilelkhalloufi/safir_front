import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  IconCalendar, 
  IconCurrencyEuro, 
  IconUsers, 
  IconClipboardCheck 
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface StatsCardsProps {
  todayBookings: number;
  todayRevenue: number;
  activeClients: number;
  pendingForms: number;
}

export function StatsCards({ 
  todayBookings, 
  todayRevenue, 
  activeClients, 
  pendingForms 
}: StatsCardsProps) {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('dashboard.todayBookings'),
      value: todayBookings,
      icon: IconCalendar,
      description: t('dashboard.bookingsToday'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: t('dashboard.todayRevenue'),
      value: `€${todayRevenue.toFixed(2)}`,
      icon: IconCurrencyEuro,
      description: t('dashboard.revenueToday'),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: t('dashboard.activeClients'),
      value: activeClients,
      icon: IconUsers,
      description: t('dashboard.totalActiveClients'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: t('dashboard.pendingForms'),
      value: pendingForms,
      icon: IconClipboardCheck,
      description: t('dashboard.awaitingReview'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stat.value}</div>
            <p className='text-xs text-muted-foreground mt-1'>
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
