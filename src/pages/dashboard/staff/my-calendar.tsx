import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { apiRoutes } from '@/routes/api';
import BookingCalendarView from '@/pages/dashboard/bookings/calendar-view';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { IconLoader2 } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import http from '@/utils/http';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, List } from 'lucide-react';
import { useState } from 'react';
import { BookingsDataTable } from '@/pages/dashboard/bookings/data-table';
import { Booking } from '@/pages/dashboard/bookings/columns';
import { showNotification, NotificationType } from '@/utils';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Star } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import MagicForm, { MagicFormFieldProps, MagicFormGroupProps } from '@/components/custom/MagicForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type BookingItem = Booking['booking_items'][0];

interface BookingItemWithBooking extends BookingItem {
  booking: Booking;
}

export default function StaffMyCalendar() {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.admin?.user);
  const staffId = user?.profil?.id;
  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar');
  const [reviewDialog, setReviewDialog] = useState<{ open: boolean; item: BookingItemWithBooking | null }>({
    open: false,
    item: null,
  });

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['staffBookings', staffId],
    queryFn: () =>
      staffId
        ? http.get(`${apiRoutes.adminBookings}?staff_id=${staffId}`).then(res => res.data?.data || [])
        : Promise.resolve([]),
    enabled: !!staffId,
  });

  // Flatten bookings to booking items for table view
  const bookingItems: BookingItemWithBooking[] = bookings.flatMap((booking: Booking) =>
    booking.booking_items.map((item: BookingItem) => ({
      ...item,
      booking,
    }))
  );

  const handleWriteReview = (item: BookingItemWithBooking) => {
    setReviewDialog({ open: true, item });
  };

  const handleReviewSubmit = async (data: any) => {
    if (!reviewDialog.item) return;

    try {
      const payload = {
        comment: data.comment,
        rating: data.rating,
        bookingItemId: reviewDialog.item.id,
        staffId: staffId,
      };

      await http.post(apiRoutes.reviewsSubmit, payload);
      showNotification('Review submitted successfully', NotificationType.SUCCESS);
      setReviewDialog({ open: false, item: null });
    } catch (error) {
      console.error('Error submitting review:', error);
      showNotification('Failed to submit review', NotificationType.ERROR);
    }
  };

  const reviewFields: MagicFormFieldProps[] = [
    {
      name: 'rating',
      label: 'Rating',
      type: 'rating',
      required: true,
      defaultValue: 5,
    },
   
    {
      name: 'comment',
      label: 'Comment',
      type: 'textarea',
      placeholder: 'Share your experience...',
      required: true,
    },
  ];

  const reviewGroups: MagicFormGroupProps[] = [
    {
      group: '',
      hideGroupTitle: true,
      fields: reviewFields,
    },
  ];

  const itemColumns: ColumnDef<BookingItemWithBooking>[] = [
    {
      accessorKey: 'start_datetime',
      header: 'Date/Time',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div>
            <div className='font-medium'>{format(new Date(item.start_datetime), 'MMM dd, yyyy')}</div>
            <div className='text-sm text-muted-foreground'>{format(new Date(item.start_datetime), 'HH:mm')}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'service',
      header: 'Service',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div>
            <div className='font-medium'>{item.service?.name?.en || 'Unknown'}</div>
            <div className='text-sm text-muted-foreground'>{item.service?.type?.name?.en || ''}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'booking.client',
      header: 'Client',
      cell: ({ row }) => {
        const item = row.original;
        const client = item.booking.client;
        return (
          <div>
            <div className='font-medium'>{client.name || 'N/A'}</div>
            <div className='text-sm text-muted-foreground'>{client.email}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'booking.status',
      header: 'Status',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className='capitalize'>{item.booking.status}</div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleWriteReview(item)}>
                <Star className='mr-2 h-4 w-4 text-yellow-600' />
                Write Review
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

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
        <CardTitle className="flex items-center justify-between">
          {t('staff.calendar', 'My Calendar')}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <List className="h-4 w-4 mr-2" />
              Table
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {viewMode === 'calendar' ? (
          <BookingCalendarView bookings={bookings} />
        ) : (
          <BookingsDataTable
            data={bookingItems}
            columns={itemColumns}
            loading={false}
          />
        )}
      </CardContent>

      {/* Review Dialog */}
      <Dialog open={reviewDialog.open} onOpenChange={(open) => setReviewDialog({ open, item: null })}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Write Review</DialogTitle>
            <DialogDescription>
              {reviewDialog.item && (
                <div className="space-y-1">
                  <p><strong>Service:</strong> {reviewDialog.item.service?.name?.en}</p>
                  <p><strong>Client:</strong> {reviewDialog.item.booking.client.name}</p>
                  <p><strong>Date:</strong> {format(new Date(reviewDialog.item.start_datetime), 'MMM dd, yyyy HH:mm')}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          {reviewDialog.item && (
            <MagicForm
              fields={reviewGroups}
              title=''
              onSubmit={handleReviewSubmit}
              button="Submit Review"
              loading={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
