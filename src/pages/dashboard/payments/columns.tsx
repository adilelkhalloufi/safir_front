import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, MoreHorizontal, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export interface Payment {
  id: number;
  booking_id: number | null;
  client: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  processed_by: {
    id: number;
    name: string;
    email: string;
    phone: string;
  } | null;
  amount: number;
  currency: string;
  payment_method: string;
  payment_type: string;
  status: string;
  square_payment_id: string | null;
  square_receipt_url: string | null;
  notes: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}



const methodConfig: Record<string, { label: string; color: string }> = {
  card: { label: 'Card', color: 'bg-blue-100 text-blue-800' },
  cash: { label: 'Cash', color: 'bg-green-100 text-green-800' },
  bank_transfer: { label: 'Bank Transfer', color: 'bg-purple-100 text-purple-800' },
  check: { label: 'Check', color: 'bg-yellow-100 text-yellow-800' },
  other: { label: 'Other', color: 'bg-gray-100 text-gray-800' },
};

const statusConfig: Record<string, { label: string; variant: any }> = {
  completed: { label: 'Completed', variant: 'default' },
  pending: { label: 'Pending', variant: 'secondary' },
  failed: { label: 'Failed', variant: 'destructive' },
  refunded: { label: 'Refunded', variant: 'outline' },
};

interface PaymentColumnsProps {
  onView: (payment: Payment) => void;
  onRefund: (payment: Payment) => void;
}

export const GetPaymentColumns = ({ onView, onRefund }: PaymentColumnsProps): ColumnDef<Payment>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <div className='font-mono text-sm'>#{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'client',
    header: 'Client',
    cell: ({ row }) => {
      const client = row.getValue('client') as Payment['client'];
      return (
        <div>
          <div className='font-medium'>{client.name}</div>
          <div className='text-xs text-muted-foreground'>{client.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'booking_id',
    header: 'Booking',
    cell: ({ row }) => {
      const bookingId = row.getValue('booking_id') as number | null;
      return <div className='text-sm'>{bookingId ? `#${bookingId}` : '-'}</div>;
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      const currency = row.original.currency || 'CAD';
      return <div className='font-medium'>{currency} ${amount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: 'payment_method',
    header: 'Method',
    cell: ({ row }) => {
      const method = row.getValue('payment_method') as string;
      const config = methodConfig[method] || { label: method, color: 'bg-gray-100 text-gray-800' };
      return (
        <Badge variant='outline' className={config.color}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const config = statusConfig[status] || { label: status, variant: 'secondary' };
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: 'paid_at',
    header: 'Paid At',
    cell: ({ row }) => {
      const paidAt = row.getValue('paid_at') as string | null;
      if (!paidAt) return <div className='text-sm text-muted-foreground'>-</div>;
      const date = new Date(paidAt);
      return <div className='text-sm'>{format(date, 'MMM dd, yyyy HH:mm')}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original;

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
              <DropdownMenuItem onClick={() => onView(payment)}>
                <Eye className='mr-2 h-4 w-4' />
                View Details
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {payment.status === 'completed' && onRefund && (
              <DropdownMenuItem onClick={() => onRefund(payment)}>
                <RefreshCw className='mr-2 h-4 w-4' />
                Process Refund
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
