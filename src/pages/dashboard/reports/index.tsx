import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Calendar, DollarSign, Users, FileText, TrendingUp, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { AnalyticsResponse } from '@/interfaces/models/analytics';
import { setPageTitle } from '@/utils';

export default function ReportsPage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  // Set initial date range to current month
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [dateRange, setDateRange] = useState({
    start_date: firstDay.toISOString().split('T')[0],
    end_date: lastDay.toISOString().split('T')[0],
  });

  useEffect(() => {
    setPageTitle(t('reports.title'));
  }, [t]);

  useEffect(() => {
    setPageTitle(t('reports.title'));
  }, [t]);

  // Fetch analytics data
  const { data: analytics, isLoading, refetch } = useQuery<AnalyticsResponse>({
    queryKey: ['analytics', dateRange],
    queryFn: async () => {
      const response = await http.get(apiRoutes.adminAnalytics, { params: dateRange });
      return response.data.data || response.data;
    },
    enabled: !!dateRange.start_date && !!dateRange.end_date,
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B9D', '#C44569', '#00D2D3'];

  const handleApplyFilter = () => {
    refetch();
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(amount);
  };

  // Prepare chart data for service types
  const serviceTypeChartData = analytics?.service_types
    .filter(st => st.bookings_count > 0)
    .map(st => ({
      name: currentLang === 'fr' ? st.service_type_name_fr : st.service_type_name_en,
      bookings: st.bookings_count,
      revenue: st.revenue,
    })) || [];

  // Prepare chart data for daily breakdown
  const dailyChartData = analytics?.daily_breakdown.map(day => ({
    date: new Date(day.date).toLocaleDateString(currentLang === 'fr' ? 'fr-CA' : 'en-CA', { month: 'short', day: 'numeric' }),
    bookings: day.bookings_count,
    revenue: day.revenue,
  })) || [];

  // Top services by bookings
  const topServices = analytics?.services
    .filter(s => s.bookings_count > 0)
    .sort((a, b) => b.bookings_count - a.bookings_count)
    .slice(0, 10) || [];

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-muted-foreground'>{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>{t('reports.title')}</h2>
          <p className='text-muted-foreground'>{t('reports.subtitle')}</p>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle>{t('reports.dateRange')}</CardTitle>
          <CardDescription>{t('reports.selectPeriod')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='start_date'>{t('reports.startDate')}</Label>
              <Input
                id='start_date'
                type='date'
                value={dateRange.start_date}
                onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='end_date'>{t('reports.endDate')}</Label>
              <Input
                id='end_date'
                type='date'
                value={dateRange.end_date}
                onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
              />
            </div>
            <div className='flex items-end'>
              <Button onClick={handleApplyFilter} className='w-full'>
                {t('reports.apply')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {analytics && (
        <>
          {/* Key Metrics Cards */}
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{t('reports.totalBookings')}</CardTitle>
                <Calendar className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{analytics.bookings.total}</div>
                <p className='text-xs text-muted-foreground'>
                  {t('reports.completed')}: {analytics.bookings.completed} | {t('reports.cancelled')}: {analytics.bookings.cancelled}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{t('reports.totalRevenue')}</CardTitle>
                <DollarSign className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{formatCurrency(analytics.revenue.total)}</div>
                <p className='text-xs text-muted-foreground'>
                  {t('reports.avgBookingValue')}: {formatCurrency(analytics.revenue.average_booking_value)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{t('reports.activeClients')}</CardTitle>
                <Users className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{analytics.clients.active_in_period}</div>
                <p className='text-xs text-muted-foreground'>
                  {t('reports.totalClients')}: {analytics.clients.total}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{t('reports.subscriptions')}</CardTitle>
                <FileText className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{analytics.subscriptions.active}</div>
                <p className='text-xs text-muted-foreground'>
                  {t('reports.revenue')}: {formatCurrency(analytics.subscriptions.revenue)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Booking Status Breakdown */}
          <div className='grid gap-4 md:grid-cols-5'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{t('dashboard.confirmed')}</CardTitle>
                <CheckCircle2 className='h-4 w-4 text-green-600' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{analytics.bookings.confirmed}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{t('dashboard.completed')}</CardTitle>
                <CheckCircle2 className='h-4 w-4 text-blue-600' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{analytics.bookings.completed}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{t('dashboard.cancelled')}</CardTitle>
                <XCircle className='h-4 w-4 text-red-600' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{analytics.bookings.cancelled}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{t('reports.noShow')}</CardTitle>
                <Clock className='h-4 w-4 text-orange-600' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{analytics.bookings.no_show}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{t('reports.total')}</CardTitle>
                <TrendingUp className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{analytics.bookings.total}</div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Trend Chart */}
          {dailyChartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('reports.dailyTrend')}</CardTitle>
                <CardDescription>{t('reports.dailyTrendDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={350}>
                  <LineChart data={dailyChartData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='date' />
                    <YAxis yAxisId='left' />
                    <YAxis yAxisId='right' orientation='right' />
                    <Tooltip formatter={(value: any) => typeof value === 'number' && value > 100 ? formatCurrency(value) : value} />
                    <Legend />
                    <Line yAxisId='left' type='monotone' dataKey='bookings' stroke='#8884d8' name={t('reports.bookings')} />
                    <Line yAxisId='right' type='monotone' dataKey='revenue' stroke='#82ca9d' name={t('reports.revenue')} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Service Type Analytics */}
          <div className='grid gap-4 md:grid-cols-2'>
            {serviceTypeChartData.length > 0 && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>{t('reports.bookingsByServiceType')}</CardTitle>
                    <CardDescription>{t('reports.bookingDistribution')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width='100%' height={300}>
                      <PieChart>
                        <Pie
                          data={serviceTypeChartData}
                          dataKey='bookings'
                          nameKey='name'
                          cx='50%'
                          cy='50%'
                          outerRadius={100}
                          label={(entry) => `${entry.name}: ${entry.bookings}`}
                        >
                          {serviceTypeChartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('reports.revenueByServiceType')}</CardTitle>
                    <CardDescription>{t('reports.revenueDistribution')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width='100%' height={300}>
                      <BarChart data={serviceTypeChartData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                        <Legend />
                        <Bar dataKey='revenue' fill='#82ca9d' name={t('reports.revenue')} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Top Services Table */}
          {topServices.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('reports.topServices')}</CardTitle>
                <CardDescription>{t('reports.topServicesDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('reports.serviceName')}</TableHead>
                      <TableHead className='text-right'>{t('reports.bookings')}</TableHead>
                      <TableHead className='text-right'>{t('reports.revenue')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topServices.map((service) => (
                      <TableRow key={service.service_id}>
                        <TableCell className='font-medium'>{service.service_name}</TableCell>
                        <TableCell className='text-right'>{service.bookings_count}</TableCell>
                        <TableCell className='text-right'>{formatCurrency(service.revenue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
