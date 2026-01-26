import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, CheckCircle, XCircle, Ban, CreditCard } from 'lucide-react';
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
import { IconMail, IconPhone } from '@tabler/icons-react';

export interface Booking {
  id: number;
  reference?: string;
  client: {
    id: number;
    name: string | null;
    email: string;
    phone: string;
  };
  status: 'draft' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  language: string;
  group_size: number;
  total_duration_minutes: number;
  total_price: number;
  notes: string | null;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  booking_items: Array<{
    id: number;
    service: {
      id: number;
      type: {
        id: number;
        name: { en: string; fr: string };
        color: string;
        is_active: boolean;
        icon: string;
        display_order: number;
        created_at: string;
        updated_at: string;
      };
      name: { en: string; fr: string };
      description: { en: string | null; fr: string | null };
      duration_minutes: number;
      price: number;
      is_active: boolean;
    };
    staff: {
      id: number;
      user: {
        id: number;
        name: string | null;

        email: string;
        phone: string;
      };
      type_staff: string | null;
      specialization: string;
      certification: string | null;
      is_active: boolean;
    } | null;
    start_datetime: string;
    end_datetime: string;
    duration_minutes: number;
    price: number;
    order_index: number;
    notes: string | null;
  }>;
  created_at: string;
  updated_at: string;
}

interface BookingColumnsProps {
  onView?: (booking: Booking) => void;
  onComplete?: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
  onNoShow?: (booking: Booking) => void;
  onPayment?: (booking: Booking) => void;
}

const statusConfig = {
  draft: { label: 'Draft', variant: 'secondary' as const, color: 'text-gray-600' },
  confirmed: { label: 'Confirmed', variant: 'default' as const, color: 'text-green-600' },
  completed: { label: 'Completed', variant: 'outline' as const, color: 'text-blue-600' },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const, color: 'text-red-600' },
  'no-show': { label: 'No-show', variant: 'secondary' as const, color: 'text-orange-600' },
};

export const GetBookingColumns = ({
  onView,
  onComplete,
  onCancel,
  onNoShow,
  onPayment,
}: BookingColumnsProps): ColumnDef<Booking>[] => [
    {
      accessorKey: 'reference',
      header: 'ID',
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <Button
            variant="link"
            className="p-0 h-auto font-medium"
            onClick={() => onView?.(booking)}
          >
            #{row.getValue('reference')}
          </Button>
        );
      },
    },
    {
      accessorKey: 'booking_items',
      header: 'Date/Time',
      cell: ({ row }) => {
        const booking = row.original;
        const firstItem = booking.booking_items[0];
        if (!firstItem) return <div>-</div>;
        return (
          <div>
            <div className='font-medium'>{format(new Date(firstItem.start_datetime), 'MMM dd, yyyy')}</div>
            <div className='text-sm text-muted-foreground'>{format(new Date(firstItem.start_datetime), 'HH:mm')}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'client',
      header: 'Client',
      cell: ({ row }) => {
        const { client } = row.original;

        return (
          <div>
            <div className='font-medium'>{client.name || 'N/A'}</div>
            <div className='text-sm text-muted-foreground flex flex-row items-center'><IconMail size={15} /> {client.email}</div>
            <div className='text-sm text-muted-foreground flex flex-row items-center'><IconPhone size={15} /> {client.phone}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'booking_items',
      header: 'Services',
      cell: ({ row }) => {
        const { booking_items } = row.original;
        return (
          <div className='flex flex-wrap gap-1'>
            {booking_items.map((item, idx) => (
              <Badge key={idx} variant='outline' className='text-xs'>
                {item.service.name.en}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'group_size',
      header: 'Group',
      cell: ({ row }) => (
        <div className='text-center'>{row.getValue('group_size')}</div>
      ),
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
      accessorKey: 'total_price',
      header: 'Total',
      cell: ({ row }) => {
        const amount = row.getValue('total_price') as number;
        return <div className='font-medium'>{amount} $</div>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const booking = row.original;
        const canComplete = booking.status === 'confirmed';
        const canCancel = ['draft', 'confirmed'].includes(booking.status);
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
              {onPayment && (
                <DropdownMenuItem onClick={() => onPayment(booking)}>
                  <CreditCard className='mr-2 h-4 w-4 text-blue-600' />
                  Add Payment
                </DropdownMenuItem>
              )}
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
