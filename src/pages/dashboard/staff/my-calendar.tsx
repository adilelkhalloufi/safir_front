import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { apiRoutes } from '@/routes/api';
import BookingCalendarView from '@/pages/dashboard/bookings/calendar-view';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { IconLoader2 } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import http from '@/utils/http';

export default function StaffMyCalendar() {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.admin?.user);
  const staffId = user?.profil?.id;

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['staffBookings', staffId],
    queryFn: () =>
      staffId
        ? http.get(`${apiRoutes.adminBookings}?staff_id=${staffId}`).then(res => res.data?.data || [])
        : Promise.resolve([]),
    enabled: !!staffId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <IconLoader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('staff.calendar', 'My Calendar')}</CardTitle>
      </CardHeader>
      <CardContent>
        <BookingCalendarView bookings={bookings} />
      </CardContent>
    </Card>
  );
}
