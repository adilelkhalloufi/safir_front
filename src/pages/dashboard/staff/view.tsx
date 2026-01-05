import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { LayoutSh as Layout } from '@/components/custom/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { IconArrowLeft, IconEdit, IconLoader2, IconMail, IconPhone } from '@tabler/icons-react';

export default function ViewStaff() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: staff, isLoading } = useQuery({
    queryKey: ['staff', id],
    queryFn: () => http.get(apiRoutes.adminStaffById(Number(id))),
    enabled: !!id,
  });



  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? 'default' : 'secondary'}>
        {isActive ? t('staff.active', 'Active') : t('staff.inactive', 'Inactive')}
      </Badge>
    );
  };

  const getTypeBadge = (typeStaff: any) => {
    if (!typeStaff) return <Badge variant="outline">N/A</Badge>;

    const typeName = typeStaff.name?.fr || typeStaff.name?.en || 'N/A';
    return <Badge variant="outline">{typeName}</Badge>;
  };

  const getDayName = (dayOfWeek: number) => {
    const days = [
      t('days.sunday', 'Sunday'),
      t('days.monday', 'Monday'),
      t('days.tuesday', 'Tuesday'),
      t('days.wednesday', 'Wednesday'),
      t('days.thursday', 'Thursday'),
      t('days.friday', 'Friday'),
      t('days.saturday', 'Saturday'),
    ];
    return days[dayOfWeek] || dayOfWeek;
  };

  if (isLoading) {
    return (
      <Layout>
        <Layout.Body>
          <div className="flex items-center justify-center h-full">
            <IconLoader2 className="h-8 w-8 animate-spin" />
          </div>
        </Layout.Body>
      </Layout>
    );
  }

  const staffData = staff?.data?.data;
  console.log('Staff Data:', staffData);

  return (
    <Layout>
      <Layout.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(webRoutes.staff.index)}
            >
              <IconArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {staffData?.user?.first_name && staffData?.user?.last_name
                  ? `${staffData.user.first_name} ${staffData.user.last_name}`
                  : staffData?.user?.email || 'N/A'}
              </h1>
              <p className="text-muted-foreground">{t('staff.subtitle')}</p>
            </div>
          </div>
          <Button onClick={() => navigate(webRoutes.staff.edit.replace(':id', id!))}>
            <IconEdit className="mr-2 h-4 w-4" />
            {t('common.edit')}
          </Button>
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('staff.personalDetails', 'Personal Details')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-base mt-1">
                    {staffData?.user?.name|| 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Staff Type</p>
                  <div className="mt-1">{getTypeBadge(staffData?.type_staff)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2 mt-1">
                    <IconMail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">{staffData?.user?.email || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <div className="flex items-center gap-2 mt-1">
                    <IconPhone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">{staffData?.user?.phone || '-'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(staffData?.is_active)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Specialization</p>
                  <p className="text-base mt-1">{staffData?.specialization || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Certification</p>
                  <p className="text-base mt-1">{staffData?.certification || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Hire Date</p>
                  <p className="text-base mt-1">{staffData?.hire_date || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Default Break (minutes)</p>
                  <p className="text-base mt-1">{staffData?.default_break_minutes || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('staff.services', 'Services')}</CardTitle>
            </CardHeader>
            <CardContent>
              {staffData?.services && staffData.services.length > 0 ? (
                <div className='grid gap-2'>
                  {staffData.services.map((service: any) => (
                    <div
                      key={service.id}
                      className='flex items-center justify-between p-3 border rounded-lg'
                    >
                      <div>
                        <p className='font-medium'>
                          {service.name?.fr || service.name?.en || 'N/A'}
                        </p>
                        {service.description && (
                          <p className='text-sm text-muted-foreground'>
                            {service.description?.fr || service.description?.en || ''}
                          </p>
                        )}
                      </div>
                      <div className='text-right'>
                        <p className='font-medium'>{service.price} $</p>
                        <p className='text-sm text-muted-foreground'>
                          {service.duration_minutes} {t('common.minutes', 'min')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-sm text-muted-foreground'>{t('staff.noServices', 'No services assigned')}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('staff.availability', 'Availability Schedule')}</CardTitle>
            </CardHeader>
            <CardContent>
              {staffData?.availability && staffData.availability.length > 0 ? (
                <div className='grid gap-2'>
                  {staffData.availability.map((avail: any, index: number) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-3 border rounded-lg'
                    >
                      <div className='flex items-center gap-3'>
                        <Badge variant={avail.is_available ? 'default' : 'secondary'}>
                          {getDayName(avail.day_of_week)}
                        </Badge>
                        {avail.is_available ? (
                          <span className='text-sm'>
                            {avail.start_time?.substring(0, 5)} - {avail.end_time?.substring(0, 5)}
                          </span>
                        ) : (
                          <span className='text-sm text-muted-foreground'>
                            {t('staff.unavailable', 'Unavailable')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-sm text-muted-foreground'>{t('staff.noAvailability', 'No availability set')}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </Layout.Body>
    </Layout>
  );
}
