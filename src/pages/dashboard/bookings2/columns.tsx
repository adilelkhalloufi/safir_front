import { ColumnDef } from '@tanstack/react-table';
 import { Button } from '@/components/ui/button';
 
import { Badge } from '@/components/ui/badge';
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
  status: 'draft' | 'confirmed' | 'deposit_paid' | 'completed' | 'cancelled' | 'no-show';
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
  payments?: Array<{
    id: number;
    booking_id: number;
    amount: number;
    currency: string;
    payment_method: string;
    payment_type: string;
    status: string;
    square_payment_id?: string;
    square_receipt_url?: string;
    notes?: string;
    paid_at: string;
    created_at: string;
    updated_at: string;
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
  onWriteReview?: (booking: Booking) => void;
}

const statusConfig = {
  draft: { label: 'Draft', variant: 'secondary' as const, color: 'text-gray-600' },
  confirmed: { label: 'Confirmed', variant: 'default' as const, color: 'text-green-600' },
  deposit_paid: { label: 'Deposit Paid', variant: 'default' as const, color: 'text-emerald-600' },
  completed: { label: 'Completed', variant: 'outline' as const, color: 'text-blue-600' },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const, color: 'text-red-600' },
  'no-show': { label: 'No-show', variant: 'secondary' as const, color: 'text-orange-600' },
};

export const GetBookingColumns = ({
  onView,
 
}: BookingColumnsProps): ColumnDef<Booking>[] => [
    {
      accessorKey: 'reference',
      header: 'ID',
      cell: ({ row }) => {
        const booking = row.original;
        const reference = row.getValue('reference') as string;
        const displayRef = reference && reference.length > 3 
          ? `${reference.substring(0, 3)}..` 
          : reference;
        return (
          <Button
            variant="link"
            className="p-0 h-auto font-medium"
            onClick={() => onView?.(booking)}
          >
            #{displayRef}
          </Button>
        );
      },
    },
    {
      id: 'dateTime',
      accessorKey: 'booking_items',
      header: 'Date/Time',
      cell: ({ row }) => {
        const booking = row.original;
        const firstItem = booking.booking_items[0];
        if (!firstItem) return <div>-</div>;
        return (
          <div>
            <div className='font-medium'>{new Date(firstItem.start_datetime).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</div>
            <div className='text-sm text-muted-foreground'>{new Date(firstItem.start_datetime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
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
      accessorKey: 'services',
      id: 'services',
      header: 'Services',
      cell: ({ row }) => {
        const booking = row.original;
        const items = booking?.booking_items || [];
        if (!Array.isArray(items) || items.length === 0) {
          return <div className='text-muted-foreground'>-</div>;
        }
        return (
          <div className='flex flex-wrap gap-1'>
            {items.map((item) => {
              if (!item?.id || !item?.service?.name?.en) return null;
              return (
                <Badge key={item.id} variant='outline' className='text-xs'>
                  {item.service.name.en}
                </Badge>
              );
            })}
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
        const config = statusConfig[status] || { label: status || 'Unknown', variant: 'secondary' as const };
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
    } 
  ];
