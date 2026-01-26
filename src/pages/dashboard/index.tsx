import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { setPageTitle } from '@/utils';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { useTranslation } from 'react-i18next';
import { StatsCards } from './components/stats-cards';
// import { QuickActions } from './components/quick-actions';
// import { RecentActivityFeed } from './components/recent-activity';
import { BookingStatusChart } from './components/booking-status-chart';
import { ServiceTypeChart } from './components/service-type-chart';
import { Overview } from './components/overview';

interface ServiceTypeData {
  service_type_id: number;
  service_type_name_en: string;
  service_type_name_fr: string;
  bookings_count: number;
  revenue: number;
}

interface DailyBreakdown {
  date: string;
  bookings_count: number;
  revenue: number;
}

interface DashboardStatistics {
  period: {
    start_date: string;
    end_date: string;
  };
  bookings: {
    total: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    no_show: number;
  };
  revenue: {
    total: number;
    average_booking_value: number;
  };
  clients: {
    total: number;
    active_in_period: number;
  };
  subscriptions: {
    total: number;
    active: number;
    sessions_sold: number;
    sessions_used: number;
    revenue: number;
  };
  service_types: ServiceTypeData[];
  services: Array<{
    service_id: number;
    service_name: string;
    service_type_id: number;
    bookings_count: number;
    revenue: number;
  }>;
  daily_breakdown: DailyBreakdown[];
}

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const [dashboardData, setDashboardData] = useState<DashboardStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageTitle(t('dashboard.title'));
    fetchDashboardData();
  }, [t]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Get current month date range
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const params = {
        start_date: firstDay.toISOString().split('T')[0],
        end_date: lastDay.toISOString().split('T')[0],
      };

      const response = await http.get(apiRoutes.adminStatistics, { params });
      setDashboardData(response.data.data || response.data);
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

  // Transform booking status data for the chart
  const bookingStatusData = dashboardData ? [
    { status: 'confirmed', count: dashboardData.bookings.confirmed },
    { status: 'completed', count: dashboardData.bookings.completed },
    { status: 'cancelled', count: dashboardData.bookings.cancelled },
    { status: 'no-show', count: dashboardData.bookings.no_show },
  ] : [];

  // Transform service type data for the chart
  const serviceTypeData = dashboardData?.service_types
    .filter(st => st.bookings_count > 0)
    .map(st => ({
      service_type: currentLang === 'fr' ? st.service_type_name_fr : st.service_type_name_en,
      count: st.bookings_count,
    })) || [];

  // Extract daily revenue for overview chart (last 7 days or available data)
  const dailyRevenue = dashboardData?.daily_breakdown.map(day => day.revenue) || [];

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>{t('dashboard.title')}</h1>
      </div>

      <Tabs defaultValue='overview' className='space-y-4'>
        <TabsContent value='overview' className='space-y-4'>
          {/* Stats Cards */}
          <StatsCards
            todayBookings={dashboardData?.bookings.total || 0}
            todayRevenue={dashboardData?.revenue.total || 0}
            activeClients={dashboardData?.clients.active_in_period || 0}
           />

          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.revenueTrend')}</CardTitle>
            </CardHeader>
            <CardContent className='pl-2'>
              <Overview monthly_revenue={dailyRevenue} />
            </CardContent>
          </Card>

          {/* Charts Row */}
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
            <BookingStatusChart data={bookingStatusData} />
            <ServiceTypeChart data={serviceTypeData} />
          </div>

          {/* Quick Actions and Recent Activity */}
          {/* <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
            <QuickActions />
            <RecentActivityFeed activities={[]} />
          </div> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}

