import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { setPageTitle } from '@/utils';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { webRoutes } from '@/routes/web';
import { Skeleton } from '@/components/ui/skeleton';

interface StaffSchedule {
  staff_id: number;
  staff_name: string;
  specialization: string;
  type_staff: {
    id: number;
    name_en: string;
    name_fr: string;
  };
  start_time: string;
  end_time: string;
}

interface DaySchedule {
  day_number: number;
  day_name: string;
  staff_count: number;
  staff: StaffSchedule[];
}

export default function StaffCalendar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    setPageTitle(t('staff.calendarTitle', 'Staff Weekly Calendar'));
  }, [t]);

  // Fetch weekly calendar
  const { data: weeklyData, isLoading: isLoadingWeekly } = useQuery({
    queryKey: ['calendar', 'weekly'],
    queryFn: () => http.get(apiRoutes.calendarWeekly).then(res => res.data?.data || []),
  });

  // Fetch specific day schedule
  const { data: dayData, isLoading: isLoadingDay } = useQuery({
    queryKey: ['calendar', 'day', selectedDay],
    queryFn: () => http.get(`${apiRoutes.calendarDay}?day=${selectedDay}`).then(res => res.data?.data),
    enabled: selectedDay !== null,
  });

  const daysOfWeek = [
    { number: 0, name: t('calendar.sunday', 'Sunday'), short: t('calendar.sun', 'Sun') },
    { number: 1, name: t('calendar.monday', 'Monday'), short: t('calendar.mon', 'Mon') },
    { number: 2, name: t('calendar.tuesday', 'Tuesday'), short: t('calendar.tue', 'Tue') },
    { number: 3, name: t('calendar.wednesday', 'Wednesday'), short: t('calendar.wed', 'Wed') },
    { number: 4, name: t('calendar.thursday', 'Thursday'), short: t('calendar.thu', 'Thu') },
    { number: 5, name: t('calendar.friday', 'Friday'), short: t('calendar.fri', 'Fri') },
    { number: 6, name: t('calendar.saturday', 'Saturday'), short: t('calendar.sat', 'Sat') },
  ];

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const getDaySchedule = (dayNumber: number): DaySchedule | undefined => {
    return weeklyData?.find((day: DaySchedule) => day.day_number === dayNumber);
  };

  if (isLoadingWeekly) {
    return (
      <div className='space-y-4'>
        <div className='mb-4'>
          <Skeleton className='h-10 w-64' />
          <Skeleton className='mt-2 h-5 w-96' />
        </div>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className='h-48' />
          ))}
        </div>
      </div>
    );
  }

  // Day detail view
  if (selectedDay !== null && dayData) {
    return (
      <div className='space-y-4'>
        <div className='mb-4 flex items-center justify-between'>
          <div>
            <div className='flex items-center gap-2'>
              <Button variant='ghost' size='icon' onClick={() => setSelectedDay(null)}>
                <ChevronLeft className='h-5 w-5' />
              </Button>
              <div>
                <h1 className='text-3xl font-bold'>
                  {daysOfWeek.find(d => d.number === selectedDay)?.name} {t('calendar.schedule', 'Schedule')}
                </h1>
                <p className='text-muted-foreground'>
                  {dayData.staff_count} {t('calendar.staffMembers', 'staff members available')}
                </p>
              </div>
            </div>
          </div>
          <Button onClick={() => navigate(webRoutes.staff.index)}>
            {t('common.back', 'Back to Staff')}
          </Button>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          {dayData.staff?.map((staff: any) => (
            <Card key={staff.staff_id} className='hover:shadow-md transition-shadow'>
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div>
                    <CardTitle className='flex items-center gap-2'>
                      <User className='h-5 w-5' />
                      {staff.staff_name}
                    </CardTitle>
                    <CardDescription>{staff.specialization}</CardDescription>
                  </div>
                  <Badge variant='secondary'>
                    {i18n.language === 'fr' ? staff.type_staff?.name_fr : staff.type_staff?.name_en}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex items-center gap-2 text-sm'>
                  <Clock className='h-4 w-4 text-muted-foreground' />
                  <span>
                    {formatTime(staff.start_time)} - {formatTime(staff.end_time)}
                  </span>
                </div>
                {staff.email && (
                  <div className='text-sm text-muted-foreground'>
                    <span className='font-medium'>{t('common.email', 'Email')}:</span> {staff.email}
                  </div>
                )}
                {staff.phone && (
                  <div className='text-sm text-muted-foreground'>
                    <span className='font-medium'>{t('common.phone', 'Phone')}:</span> {staff.phone}
                  </div>
                )}
                {staff.services && staff.services.length > 0 && (
                  <div>
                    <div className='text-sm font-medium mb-1'>{t('calendar.services', 'Services')}:</div>
                    <div className='flex flex-wrap gap-1'>
                      {staff.services.map((service: any) => (
                        <Badge key={service.id} variant='outline' className='text-xs'>
                          {i18n.language === 'fr' ? service.name_fr : service.name_en}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Weekly overview
  return (
    <div className='space-y-4'>
      <div className='mb-4 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold flex items-center gap-2'>
            <Calendar className='h-8 w-8' />
            {t('staff.calendarTitle', 'Staff Weekly Calendar')}
          </h1>
          <p className='text-muted-foreground'>
            {t('staff.calendarSubtitle', 'View staff availability throughout the week')}
          </p>
        </div>
        <Button onClick={() => navigate(webRoutes.staff.index)}>
          {t('common.back', 'Back to Staff')}
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {daysOfWeek.map((day) => {
          const daySchedule = getDaySchedule(day.number);
          const hasStaff = daySchedule && daySchedule.staff_count > 0;

          return (
            <Card
              key={day.number}
              className={`cursor-pointer transition-all hover:shadow-md ${
                hasStaff ? 'hover:border-primary' : 'opacity-60'
              }`}
              onClick={() => hasStaff && setSelectedDay(day.number)}
            >
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  <span>{day.name}</span>
                  {hasStaff && (
                    <Badge variant='default' className='ml-2'>
                      {daySchedule.staff_count}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {hasStaff
                    ? `${daySchedule.staff_count} ${t('calendar.staffMembers', 'staff members')}`
                    : t('calendar.noStaff', 'No staff scheduled')}
                </CardDescription>
              </CardHeader>
              {hasStaff && (
                <CardContent>
                  <div className='space-y-2'>
                    {daySchedule.staff.slice(0, 3).map((staff) => (
                      <div
                        key={staff.staff_id}
                        className='flex items-start justify-between text-sm border-l-2 border-primary/20 pl-2 py-1'
                      >
                        <div className='flex-1'>
                          <div className='font-medium'>{staff.staff_name}</div>
                          <div className='text-xs text-muted-foreground flex items-center gap-1'>
                            <Clock className='h-3 w-3' />
                            {formatTime(staff.start_time)} - {formatTime(staff.end_time)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {daySchedule.staff.length > 3 && (
                      <div className='text-xs text-center text-muted-foreground pt-2 border-t'>
                        +{daySchedule.staff.length - 3} {t('calendar.more', 'more')}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
