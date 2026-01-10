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
import MagicForm from '@/components/custom/MagicForm';
import BookingCalendarView from './calendar-view';
import { Calendar as CalendarIcon, List, X } from 'lucide-react';
import { format } from 'date-fns';

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
  const [paymentDialog, setPaymentDialog] = useState<{ open: boolean; booking: Booking | null }>({
    open: false,
    booking: null,
  });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [filters, setFilters] = useState({
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
    client: '',
    status: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setPageTitle(t('bookings.title', 'Bookings Management'));
    fetchBookings();
  }, [t]);

  const fetchBookings = (filterParams?: any) => {
    setLoading(true);

    // Build query parameters
    const params: any = {};
    if (filterParams) {
      if (filterParams.date_from) {
        params.date_from = format(new Date(filterParams.date_from), 'yyyy-MM-dd');
      }
      if (filterParams.date_to) {
        params.date_to = format(new Date(filterParams.date_to), 'yyyy-MM-dd');
      }
      if (filterParams.client) {
        params.client = filterParams.client;
      }
      if (filterParams.status && filterParams.status !== 'all') {
        params.status = filterParams.status;
      }
    }

    http
      .get(apiRoutes.adminBookings, { params })
      .then((res) => {
        setData(res.data.data);
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

  const handlePaymentOpen = (booking: Booking) => {
    setPaymentDialog({ open: true, booking });
  };

  const handlePaymentSubmit = (data: any) => {
    if (!paymentDialog.booking) return;

    setPaymentLoading(true);
    http
      .post(apiRoutes.adminPayments, {
        ...data,
        booking_id: paymentDialog.booking.id,
      })
      .then(() => {
        toast({
          title: t('common.success', 'Success'),
          description: t('bookings.paymentSuccess', 'Payment created successfully'),
        });
        fetchBookings();
        setPaymentDialog({ open: false, booking: null });
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: t('common.error', 'Error'),
          description: t('bookings.paymentError', 'Failed to create payment'),
        });
      })
      .finally(() => {
        setPaymentLoading(false);
      });
  };

  const handleFilterSubmit = (filterData: any) => {
    setFilters({
      dateFrom: filterData.date_from ? new Date(filterData.date_from) : undefined,
      dateTo: filterData.date_to ? new Date(filterData.date_to) : undefined,
      client: filterData.client || '',
      status: filterData.status || 'all',
    });
    fetchBookings(filterData);
    setShowFilters(false);
  };

  const columns = useMemo(
    () =>
      GetBookingColumns({
        onView: handleView,
        onComplete: handleComplete,
        onCancel: handleCancelOpen,
        onNoShow: handleNoShow,
        onPayment: handlePaymentOpen,
      }),
    [t]
  );

  const clearFilters = () => {
    setFilters({
      dateFrom: undefined,
      dateTo: undefined,
      client: '',
      status: 'all',
    });
  };

  return (
    <>
      <div className='mb-6 space-y-4'>
        <div className='flex w-full items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>{t('bookings.title', 'Bookings Management')}</h1>
            <p className='text-muted-foreground'>
              {t('bookings.subtitle', 'Manage and track all bookings')}
            </p>
          </div>
          <div className='flex gap-2'>
            <div className='flex rounded-md border'>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => setViewMode('table')}
                className='rounded-r-none'
              >
                <List className='h-4 w-4 mr-2' />
                {t('bookings.tableView', 'Table')}
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => setViewMode('calendar')}
                className='rounded-l-none'
              >
                <CalendarIcon className='h-4 w-4 mr-2' />
                {t('bookings.calendarView', 'Calendar')}
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Button variant='outline' onClick={() => setShowFilters(!showFilters)}>
              <CalendarIcon className='mr-2 h-4 w-4' />
              {t('bookings.filters', 'Filters')}
              {(filters.dateFrom || filters.dateTo || filters.client || filters.status !== 'all') && (
                <span className='ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground'>
                  Active
                </span>
              )}
            </Button>
            {(filters.dateFrom || filters.dateTo || filters.client || filters.status !== 'all') && (
              <Button variant='ghost' onClick={clearFilters} className='gap-2'>
                <X className='h-4 w-4' />
                {t('bookings.clearFilters', 'Clear')}
              </Button>
            )}
          </div>

          {showFilters && (
            <div className='rounded-lg border bg-card p-4'>
              <MagicForm
                title=''
                fields={[
                  {
                    group: 'filters',
                    fields: [
                      {
                        name: 'date_from',
                        label: t('bookings.dateFrom', 'Date From'),
                        type: 'date',
                        placeholder: t('bookings.selectDateFrom', 'Select start date'),
                        width: 'half',
                        defaultValue: filters.dateFrom ? format(filters.dateFrom, 'yyyy-MM-dd') : undefined,
                      },
                      {
                        name: 'date_to',
                        label: t('bookings.dateTo', 'Date To'),
                        type: 'date',
                        placeholder: t('bookings.selectDateTo', 'Select end date'),
                        width: 'half',
                        defaultValue: filters.dateTo ? format(filters.dateTo, 'yyyy-MM-dd') : undefined,
                      },
                      {
                        name: 'client',
                        label: t('bookings.client', 'Client'),
                        type: 'text',
                        placeholder: t('bookings.searchClient', 'Search by name, email or phone...'),
                        width: 'half',
                        defaultValue: filters.client,
                      },
                      {
                        name: 'status',
                        label: t('bookings.status', 'Status'),
                        type: 'select',
                        placeholder: t('bookings.selectStatus', 'Select status'),
                        width: 'half',
                        defaultValue: filters.status,
                        options: [
                          { value: 'all', name: t('bookings.allStatus', 'All Status') },
                          { value: 'draft', name: t('bookings.status_draft', 'Draft') },
                          { value: 'confirmed', name: t('bookings.status_confirmed', 'Confirmed') },
                          { value: 'completed', name: t('bookings.status_completed', 'Completed') },
                          { value: 'cancelled', name: t('bookings.status_cancelled', 'Cancelled') },
                          { value: 'no-show', name: t('bookings.status_no-show', 'No-show') },
                        ],
                      },
                    ],
                  },
                ]}
                onSubmit={handleFilterSubmit}
                button={t('bookings.applyFilters', 'Apply Filters')}
                loading={loading}
              />
            </div>
          )}
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'table' ? (
        <BookingsDataTable columns={columns} data={data} loading={loading} />
      ) : (
        <BookingCalendarView bookings={data} />
      )}

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

      {/* Payment Dialog */}
      <Dialog open={paymentDialog.open} onOpenChange={(open) => setPaymentDialog({ open, booking: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('bookings.addPayment', 'Add Payment')}</DialogTitle>
            <DialogDescription>
              {t('bookings.addPaymentDescription', `Create a payment for booking #${paymentDialog.booking?.id}`)}
              {paymentDialog.booking && (
                <div className="mt-2 text-sm">
                  <p><strong>Total:</strong> {paymentDialog.booking.total_price} DH</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          {paymentDialog.booking && (
            <MagicForm
              fields={[
                {
                  group: 'payment',
                  fields: [
                    {
                      name: 'amount',
                      label: t('payments.amount', 'Amount'),
                      type: 'number',
                      required: true,
                      placeholder: t('payments.amountPlaceholder', 'Enter amount'),
                      defaultValue: paymentDialog.booking.total_price,
                      width: 'full',
                    },
                    {
                      name: 'payment_method',
                      label: t('payments.method', 'Payment Method'),
                      type: 'select',
                      required: true,
                      options: [
                        { value: 'cash', name: 'Cash' },
                        { value: 'card', name: 'Card' },
                        { value: 'bank_transfer', name: 'Bank Transfer' },
                        { value: 'online', name: 'Online' },
                      ],
                      width: 'full',
                    },
                    {
                      name: 'transaction_id',
                      label: t('payments.transactionId', 'Transaction ID'),
                      type: 'text',
                      placeholder: t('payments.transactionIdPlaceholder', 'Optional'),
                      width: 'full',
                    },
                    {
                      name: 'notes',
                      label: t('payments.notes', 'Notes'),
                      type: 'textarea',
                      placeholder: t('payments.notesPlaceholder', 'Additional notes...'),
                      width: 'full',
                    },
                  ],
                },
              ]}
              onSubmit={handlePaymentSubmit}
              button={t('common.submit', 'Submit')}
              loading={paymentLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
