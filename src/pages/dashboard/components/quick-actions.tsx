import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  IconPlus, 
  IconCalendarEvent, 
  IconClipboardCheck, 
  IconFileText 
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { webRoutes } from '@/routes/web';

export function QuickActions() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const actions = [
    {
      title: t('dashboard.createBooking'),
      description: t('dashboard.createManualBooking'),
      icon: IconPlus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      onClick: () => navigate(webRoutes.booking),
    },
    {
      title: t('dashboard.todaySchedule'),
      description: t('dashboard.viewTodaySchedule'),
      icon: IconCalendarEvent,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      onClick: () => navigate('/dashboard/bookings?date=today'),
    },
    {
      title: t('dashboard.approveForms'),
      description: t('dashboard.reviewHealthForms'),
      icon: IconClipboardCheck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      onClick: () => navigate('/dashboard/health-forms'),
    },
    {
      title: t('dashboard.generateReport'),
      description: t('dashboard.createReport'),
      icon: IconFileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      onClick: () => navigate('/dashboard/reports'),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.quickActions')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid gap-3 sm:grid-cols-2'>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant='outline'
              className={`h-auto flex-col items-start p-4 ${action.bgColor} border-0`}
              onClick={action.onClick}
            >
              <div className='flex w-full items-center gap-3'>
                <div className={`rounded-lg p-2 ${action.color}`}>
                  <action.icon className='h-6 w-6' />
                </div>
                <div className='flex-1 text-left'>
                  <div className='font-semibold text-sm'>{action.title}</div>
                  <div className='text-xs text-muted-foreground mt-1'>
                    {action.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
