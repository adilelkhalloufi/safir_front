import { useEffect, useState } from 'react';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { webRoutes } from '@/routes/web';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { setPageTitle } from '@/utils';
import { Plus } from 'lucide-react';
import { GetBlockedTimeSlotsColumns } from './columns';
import { BlockedTimeSlotsDataTable } from './data-table';
import { BlockedTimeSlot, BlockedTimeSlotsResponse } from '@/interfaces/models/blockedTimeSlot';

export default function BlockedTimeSlotsIndex() {
  const { t } = useTranslation();
  const [data, setData] = useState<BlockedTimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle(t('blockedSlots.title', 'Blocked Time Slots'));
    fetchBlockedSlots();
  }, [t]);

  const fetchBlockedSlots = () => {
    setLoading(true);
    http
      .get<BlockedTimeSlotsResponse>(apiRoutes.adminBlockedTimeSlots)
      .then((res) => {
        setData(res.data?.data || []);
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: t('common.error', 'Error'),
          description: t('blockedSlots.fetchError', 'Failed to fetch blocked slots'),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (slot: BlockedTimeSlot) => {
    if (confirm(t('blockedSlots.deleteConfirm', 'Are you sure you want to delete this blocked slot?'))) {
      http
        .delete(`${apiRoutes.adminBlockedTimeSlots}/${slot.id}`)
        .then(() => {
          toast({
            title: t('common.success', 'Success'),
            description: t('blockedSlots.deleteSuccess', 'Blocked slot deleted successfully'),
          });
          fetchBlockedSlots();
        })
        .catch(() => {
          toast({
            variant: 'destructive',
            title: t('common.error', 'Error'),
            description: t('blockedSlots.deleteError', 'Failed to delete blocked slot'),
          });
        });
    }
  };

  const columns = GetBlockedTimeSlotsColumns({
    onView: (slot) => navigate(webRoutes.blockedSlots.view.replace(':id', slot.id.toString())),
    onEdit: (slot) => navigate(webRoutes.blockedSlots.edit.replace(':id', slot.id.toString())),
    onDelete: handleDelete,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('blockedSlots.title', 'Blocked Time Slots')}
          </h1>
          <p className="text-muted-foreground">
            {t('blockedSlots.subtitle', 'Manage unavailable time periods for staff and services')}
          </p>
        </div>
        <Button onClick={() => navigate(webRoutes.blockedSlots.add)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('blockedSlots.addNew', 'Add Blocked Slot')}
        </Button>
      </div>

      <BlockedTimeSlotsDataTable columns={columns} data={data} isLoading={loading} />
    </div>
  );
}
