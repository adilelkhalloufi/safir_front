import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, CheckCircle, XCircle, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export interface Booking {
  id: number;
  booking_number: string;
  date: string;
  time: string;
  client_name: string;
  client_email: string;
  services: string[];
  staff_name: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  total: number;
  payment_status: string;
}

interface BookingColumnsProps {
  onView?: (booking: Booking) => void;
  onComplete?: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
  onNoShow?: (booking: Booking) => void;
}

const statusConfig = {
  pending: { label: 'Pending', variant: 'secondary' as const, color: 'text-yellow-600' },
  confirmed: { label: 'Confirmed', variant: 'default' as const, color: 'text-green-600' },
  completed: { label: 'Completed', variant: 'outline' as const, color: 'text-blue-600' },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const, color: 'text-red-600' },
  'no-show': { label: 'No-show', variant: 'secondary' as const, color: 'text-gray-600' },
};

export const GetBookingColumns = ({
  onView,
  onComplete,
  onCancel,
  onNoShow,
}: BookingColumnsProps): ColumnDef<Booking>[] => [
  {
    accessorKey: 'booking_number',
    header: 'Booking ID',
    cell: ({ row }) => (
      <div className='font-medium'>#{row.getValue('booking_number')}</div>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Date/Time',
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div>
          <div className='font-medium'>{format(new Date(booking.date), 'MMM dd, yyyy')}</div>
          <div className='text-sm text-muted-foreground'>{booking.time}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'client_name',
    header: 'Client',
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div>
          <div className='font-medium'>{booking.client_name}</div>
          <div className='text-sm text-muted-foreground'>{booking.client_email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'services',
    header: 'Services',
    cell: ({ row }) => {
      const services = row.getValue('services') as string[];
      return (
        <div className='flex flex-wrap gap-1'>
          {services.map((service, idx) => (
            <Badge key={idx} variant='outline' className='text-xs'>
              {service}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'staff_name',
    header: 'Staff',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as keyof typeof statusConfig;
      const config = statusConfig[status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('total'));
      return <div className='font-medium'>€{amount.toFixed(2)}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const booking = row.original;
      const canComplete = booking.status === 'confirmed';
      const canCancel = ['pending', 'confirmed'].includes(booking.status);
      const canNoShow = booking.status === 'confirmed';

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
            {onView && (
              <DropdownMenuItem onClick={() => onView(booking)}>
                <Eye className='mr-2 h-4 w-4' />
                View Details
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {canComplete && onComplete && (
              <DropdownMenuItem onClick={() => onComplete(booking)}>
                <CheckCircle className='mr-2 h-4 w-4 text-green-600' />
                Mark Completed
              </DropdownMenuItem>
            )}
            {canNoShow && onNoShow && (
              <DropdownMenuItem onClick={() => onNoShow(booking)}>
                <Ban className='mr-2 h-4 w-4 text-gray-600' />
                Mark No-show
              </DropdownMenuItem>
            )}
            {canCancel && onCancel && (
              <DropdownMenuItem onClick={() => onCancel(booking)}>
                <XCircle className='mr-2 h-4 w-4 text-red-600' />
                Cancel Booking
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
