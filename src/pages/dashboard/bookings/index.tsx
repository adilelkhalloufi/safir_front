import { GetBookingColumns, Booking } from './columns';
import { BookingsDataTable } from './data-table';
import { useEffect, useMemo, useState } from 'react';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { webRoutes } from '@/routes/web';
import { useTranslation } from 'react-i18next';
import { setPageTitle } from '@/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function BookingsIndex() {
  const { t } = useTranslation();
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [cancelDialog, setCancelDialog] = useState<{ open: boolean; booking: Booking | null }>({
    open: false,
    booking: null,
  });
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    setPageTitle(t('bookings.title', 'Bookings Management'));
    fetchBookings();
  }, [t]);

  const fetchBookings = () => {
    setLoading(true);
    http
      .get(apiRoutes.adminBookings)
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: t('common.error', 'Error'),
          description: t('bookings.fetchError', 'Failed to fetch bookings'),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleView = (booking: Booking) => {
    navigate(webRoutes.bookings.view.replace(':id', booking.id.toString()));
  };

  const handleComplete = (booking: Booking) => {
    http
      .post(apiRoutes.adminBookingComplete(booking.id), {})
      .then(() => {
        toast({
          title: t('common.success', 'Success'),
          description: t('bookings.completedSuccess', 'Booking marked as completed'),
        });
        fetchBookings();
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: t('common.error', 'Error'),
          description: t('bookings.completeError', 'Failed to mark booking as completed'),
        });
      });
  };

  const handleCancelOpen = (booking: Booking) => {
    setCancelDialog({ open: true, booking });
    setCancelReason('');
  };

  const handleCancelConfirm = () => {
    if (!cancelDialog.booking) return;

    http
      .post(apiRoutes.adminBookingCancel(cancelDialog.booking.id), {
        reason: cancelReason,
      })
      .then(() => {
        toast({
          title: t('common.success', 'Success'),
          description: t('bookings.cancelSuccess', 'Booking cancelled successfully'),
        });
        fetchBookings();
        setCancelDialog({ open: false, booking: null });
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: t('common.error', 'Error'),
          description: t('bookings.cancelError', 'Failed to cancel booking'),
        });
      });
  };

  const handleNoShow = (booking: Booking) => {
    http
      .post(apiRoutes.adminBookingNoShow(booking.id), {})
      .then(() => {
        toast({
          title: t('common.success', 'Success'),
          description: t('bookings.noShowSuccess', 'Booking marked as no-show'),
        });
        fetchBookings();
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: t('common.error', 'Error'),
          description: t('bookings.noShowError', 'Failed to mark booking as no-show'),
        });
      });
  };

  const columns = useMemo(
    () =>
      GetBookingColumns({
        onView: handleView,
        onComplete: handleComplete,
        onCancel: handleCancelOpen,
        onNoShow: handleNoShow,
      }),
    [t]
  );

  return (
    <>
      <div className='mb-4 flex w-full items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>{t('bookings.title', 'Bookings Management')}</h1>
          <p className='text-muted-foreground'>
            {t('bookings.subtitle', 'Manage and track all bookings')}
          </p>
        </div>
        <Button onClick={() => navigate(webRoutes.bookings.add)}>
          {t('bookings.createManual', 'Create Manual Booking')}
        </Button>
      </div>

      <BookingsDataTable columns={columns} data={data} loading={loading} />

      {/* Cancel Dialog */}
      <Dialog open={cancelDialog.open} onOpenChange={(open) => setCancelDialog({ open, booking: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('bookings.cancelTitle', 'Cancel Booking')}</DialogTitle>
            <DialogDescription>
              {t('bookings.cancelDescription', 'Are you sure you want to cancel this booking? This action cannot be undone.')}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='reason'>{t('bookings.cancelReason', 'Cancellation Reason')}</Label>
              <Textarea
                id='reason'
                placeholder={t('bookings.cancelReasonPlaceholder', 'Enter reason for cancellation...')}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setCancelDialog({ open: false, booking: null })}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button variant='destructive' onClick={handleCancelConfirm}>
              {t('bookings.confirmCancel', 'Confirm Cancellation')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
