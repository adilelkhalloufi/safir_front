import { GetStaffColumns, Staff } from './columns';
import { StaffDataTable } from './data-table';
import { useEffect, useMemo, useState } from 'react';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { webRoutes } from '@/routes/web';
import { useTranslation } from 'react-i18next';
import { setPageTitle } from '@/utils';

export default function StaffIndex() {
  const { t } = useTranslation();
  const [data, setData] = useState<Staff[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle(t('staff.title', 'Staff Management'));
    fetchStaff();
  }, [t]);

  const fetchStaff = () => {
    setLoading(true);
    http
      .get(apiRoutes.adminStaff)
      .then((res) => {
        setData(res.data.data || res.data);
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: t('common.error', 'Error'),
          description: t('staff.fetchError', 'Failed to fetch staff'),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleView = (staff: Staff) => {
    navigate(webRoutes.staff.view.replace(':id', staff.id.toString()));
  };

  const handleEdit = (staff: Staff) => {
    navigate(webRoutes.staff.edit.replace(':id', staff.id.toString()));
  };

  const handleSchedule = (staff: Staff) => {
    // Navigate to schedule management or open modal
    navigate(webRoutes.staff.view.replace(':id', staff.id.toString()) + '?tab=schedule');
  };

  const columns = useMemo(
    () =>
      GetStaffColumns({
        onView: handleView,
        onEdit: handleEdit,
        onSchedule: handleSchedule,
      }),
    [t]
  );

  return (
    <>
      <div className='mb-4 flex w-full items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>{t('staff.title', 'Staff Management')}</h1>
          <p className='text-muted-foreground'>
            {t('staff.subtitle', 'Manage team members and schedules')}
          </p>
        </div>
        <Button onClick={() => navigate(webRoutes.staff.add)}>
          {t('staff.addNew', 'Add New Staff')}
        </Button>
      </div>

      <StaffDataTable columns={columns} data={data} loading={loading} />
    </>
  );
}
