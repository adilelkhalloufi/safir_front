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
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, List, X } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

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

  useEffect(() => {
    setPageTitle(t('bookings.title', 'Bookings Management'));
    fetchBookings();
  }, [t]);

  const fetchBookings = () => {
    setLoading(true);
    http
      .get(apiRoutes.adminBookings)
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

  const filteredData = useMemo(() => {
    return data.filter((booking) => {
      // Filter by date range
      if (filters.dateFrom || filters.dateTo) {
        const firstItem = booking.booking_items[0];
        if (firstItem) {
          const bookingDate = new Date(firstItem.start_datetime);
          if (filters.dateFrom && bookingDate < filters.dateFrom) return false;
          if (filters.dateTo) {
            const endOfDay = new Date(filters.dateTo);
            endOfDay.setHours(23, 59, 59, 999);
            if (bookingDate > endOfDay) return false;
          }
        }
      }

      // Filter by client
      if (filters.client) {
        const searchLower = filters.client.toLowerCase();
        const clientName = `${booking.client.first_name || ''} ${booking.client.last_name || ''}`.toLowerCase();
        const clientEmail = booking.client.email.toLowerCase();
        const clientPhone = booking.client.phone.toLowerCase();
        if (!clientName.includes(searchLower) && !clientEmail.includes(searchLower) && !clientPhone.includes(searchLower)) {
          return false;
        }
      }

      // Filter by status
      if (filters.status !== 'all' && booking.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [data, filters]);

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
        <div className='grid gap-4 md:grid-cols-4 lg:grid-cols-5'>
          {/* Date From */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'justify-start text-left font-normal',
                  !filters.dateFrom && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {filters.dateFrom ? format(filters.dateFrom, 'PPP') : t('bookings.dateFrom', 'Date From')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={filters.dateFrom}
                onSelect={(date) => setFilters({ ...filters, dateFrom: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Date To */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'justify-start text-left font-normal',
                  !filters.dateTo && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {filters.dateTo ? format(filters.dateTo, 'PPP') : t('bookings.dateTo', 'Date To')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={filters.dateTo}
                onSelect={(date) => setFilters({ ...filters, dateTo: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Client Search */}
          <Input
            placeholder={t('bookings.searchClient', 'Search client...')}
            value={filters.client}
            onChange={(e) => setFilters({ ...filters, client: e.target.value })}
            className='max-w-sm'
          />

          {/* Status Filter */}
          <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder={t('bookings.filterStatus', 'Filter by status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>{t('bookings.allStatus', 'All Status')}</SelectItem>
              <SelectItem value='draft'>{t('bookings.status_draft', 'Draft')}</SelectItem>
              <SelectItem value='confirmed'>{t('bookings.status_confirmed', 'Confirmed')}</SelectItem>
              <SelectItem value='completed'>{t('bookings.status_completed', 'Completed')}</SelectItem>
              <SelectItem value='cancelled'>{t('bookings.status_cancelled', 'Cancelled')}</SelectItem>
              <SelectItem value='no-show'>{t('bookings.status_no-show', 'No-show')}</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {(filters.dateFrom || filters.dateTo || filters.client || filters.status !== 'all') && (
            <Button variant='ghost' onClick={clearFilters} className='gap-2'>
              <X className='h-4 w-4' />
              {t('bookings.clearFilters', 'Clear')}
            </Button>
          )}
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'table' ? (
        <BookingsDataTable columns={columns} data={filteredData} loading={loading} />
      ) : (
        <BookingCalendarView bookings={filteredData} />
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
