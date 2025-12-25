import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { setPageTitle } from '@/utils';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { useTranslation } from 'react-i18next';
import { StatsCards } from './components/stats-cards';
import { QuickActions } from './components/quick-actions';
import { RecentActivityFeed } from './components/recent-activity';
import { BookingStatusChart } from './components/booking-status-chart';
import { ServiceTypeChart } from './components/service-type-chart';
import { Overview } from './components/overview';

interface DashboardStatistics {
  today_bookings: number;
  today_revenue: number;
  active_clients: number;
  pending_health_forms: number;
  bookings_by_status: Array<{ status: string; count: number }>;
  bookings_by_service: Array<{ service_type: string; count: number }>;
  revenue_trend: number[];
  recent_activities: Array<{
    id: number;
    type: 'booking' | 'cancellation' | 'registration';
    title: string;
    description: string;
    user: string;
    timestamp: string;
    status?: string;
  }>;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState<DashboardStatistics>({
    today_bookings: 0,
    today_revenue: 0,
    active_clients: 0,
    pending_health_forms: 0,
    bookings_by_status: [],
    bookings_by_service: [],
    revenue_trend: [],
    recent_activities: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageTitle(t('dashboard.title'));
    fetchDashboardData();
  }, [t]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await http.get(apiRoutes.adminStatistics);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-muted-foreground'>{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>{t('dashboard.title')}</h1>
      </div>

      <Tabs defaultValue='overview' className='space-y-4'>
        <TabsContent value='overview' className='space-y-4'>
          {/* Stats Cards */}
          <StatsCards
            todayBookings={dashboardData.today_bookings}
            todayRevenue={dashboardData.today_revenue}
            activeClients={dashboardData.active_clients}
            pendingForms={dashboardData.pending_health_forms}
          />

          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.revenueTrend')}</CardTitle>
            </CardHeader>
            <CardContent className='pl-2'>
              <Overview monthly_revenue={dashboardData.revenue_trend} />
            </CardContent>
          </Card>

          {/* Charts Row */}
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
            <BookingStatusChart data={dashboardData.bookings_by_status} />
            <ServiceTypeChart data={dashboardData.bookings_by_service} />
          </div>

          {/* Quick Actions and Recent Activity */}
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
            <QuickActions />
            <RecentActivityFeed activities={dashboardData.recent_activities} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

