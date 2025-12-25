import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { FileText, FileSpreadsheet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';

export default function ReportsPage() {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState({
    from: '',
    to: '',
  });

  // Fetch analytics data
  const { data: revenueData = [] } = useQuery<any[]>({
    queryKey: ['revenueAnalytics', dateRange],
    queryFn: async () => {
      const response = await http.get(apiRoutes.adminReports, { params: dateRange });
      return response.data || [];
    },
  });

  const { data: staffPerformance = [] } = useQuery<any[]>({
    queryKey: ['staffPerformance', dateRange],
    queryFn: async () => {
      const response = await http.get(apiRoutes.adminStaffPerformance, { params: dateRange });
      return response.data || [];
    },
  });

  const { data: servicePopularity = [] } = useQuery<any[]>({
    queryKey: ['servicePopularity', dateRange],
    queryFn: async () => {
      const response = await http.get(apiRoutes.adminServiceStats, { params: dateRange });
      return response.data || [];
    },
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const handleExportPDF = () => {
    console.log('Exporting as PDF...');
    // TODO: Implement PDF export
  };

  const handleExportExcel = () => {
    console.log('Exporting as Excel...');
    // TODO: Implement Excel export
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>{t('reports.title', 'Reports & Statistics')}</h2>
          <p className='text-muted-foreground'>{t('reports.subtitle', 'Business insights and analytics')}</p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={handleExportPDF}>
            <FileText className='mr-2 h-4 w-4' />
            {t('reports.exportPDF', 'Export PDF')}
          </Button>
          <Button variant='outline' onClick={handleExportExcel}>
            <FileSpreadsheet className='mr-2 h-4 w-4' />
            {t('reports.exportExcel', 'Export Excel')}
          </Button>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle>{t('reports.dateRange', 'Date Range')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-3 gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='from'>{t('reports.from', 'From')}</Label>
              <Input
                id='from'
                type='date'
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='to'>{t('reports.to', 'To')}</Label>
              <Input
                id='to'
                type='date'
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              />
            </div>
            <div className='flex items-end'>
              <Button>{t('reports.apply', 'Apply')}</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>{t('reports.revenueAnalytics', 'Revenue Analytics')}</CardTitle>
          <CardDescription>Daily revenue over selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='date' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='revenue' fill='#8884d8' />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Staff Performance & Service Popularity */}
      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>{t('reports.staffPerformance', 'Staff Performance')}</CardTitle>
            <CardDescription>Total bookings by staff member</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={staffPerformance}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='bookings' fill='#82ca9d' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('reports.servicePopularity', 'Service Popularity')}</CardTitle>
            <CardDescription>Booking distribution by service</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={servicePopularity}
                  dataKey='bookings'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  outerRadius={100}
                  label
                >
                  {servicePopularity.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
