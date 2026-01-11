import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';

interface ServiceTypeData {
  service_type: string;
  count: number;
}

interface ServiceTypeChartProps {
  data: ServiceTypeData[];
}

export function ServiceTypeChart({ data }: ServiceTypeChartProps) {
  const { t } = useTranslation();

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];

  const chartData = (data || []).map((item, index) => ({
    name: t(`dashboard.serviceTypes.${item.service_type.toLowerCase()}`, item.service_type),
    value: item.count,
    fill: COLORS[index % COLORS.length],
  }));

  const renderLabel = (entry: any) => {
    return `${entry.value}`;
  };

  return (
    <Card className='col-span-1 lg:col-span-3'>
      <CardHeader>
        <CardTitle>{t('dashboard.bookingsByService')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={renderLabel}
              outerRadius={100}
              fill='#8884d8'
              dataKey='value'
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
