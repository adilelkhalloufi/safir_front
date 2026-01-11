import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface BookingStatusData {
  status: string;
  count: number;
}

interface BookingStatusChartProps {
  data: BookingStatusData[];
}

export function BookingStatusChart({ data }: BookingStatusChartProps) {
  const { t } = useTranslation();

  const chartData = (data || []).map(item => ({
    status: t(`dashboard.status.${item.status.toLowerCase()}`, item.status),
    count: item.count,
  }));

  return (
    <Card className='col-span-1 lg:col-span-4'>
      <CardHeader>
        <CardTitle>{t('dashboard.bookingsByStatus')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={chartData}>
            <XAxis
              dataKey='status'
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip />
            <Bar
              dataKey='count'
              fill='#3b82f6'
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
