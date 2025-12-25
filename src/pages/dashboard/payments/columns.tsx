import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, RefreshCw } from 'lucide-react';
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

export interface Payment {
  id: number;
  transaction_id: string;
  client_name: string;
  amount: number;
  payment_method: 'card' | 'cash' | 'bank_transfer';
  status: 'success' | 'pending' | 'failed' | 'refunded';
  booking_ref?: string;
  created_at: string;
}

interface PaymentColumnsProps {
  onView?: (payment: Payment) => void;
  onRefund?: (payment: Payment) => void;
}

const methodConfig = {
  card: { label: 'Card', color: 'bg-blue-100 text-blue-800' },
  cash: { label: 'Cash', color: 'bg-green-100 text-green-800' },
  bank_transfer: { label: 'Bank Transfer', color: 'bg-purple-100 text-purple-800' },
};

const statusConfig = {
  success: { label: 'Success', variant: 'default' as const },
  pending: { label: 'Pending', variant: 'secondary' as const },
  failed: { label: 'Failed', variant: 'destructive' as const },
  refunded: { label: 'Refunded', variant: 'outline' as const },
};

export const GetPaymentColumns = ({ onView, onRefund }: PaymentColumnsProps): ColumnDef<Payment>[] => [
  {
    accessorKey: 'transaction_id',
    header: 'Transaction ID',
    cell: ({ row }) => <div className='font-mono text-sm'>{row.getValue('transaction_id')}</div>,
  },
  {
    accessorKey: 'client_name',
    header: 'Client',
    cell: ({ row }) => <div className='font-medium'>{row.getValue('client_name')}</div>,
  },
  {
    accessorKey: 'booking_ref',
    header: 'Booking',
    cell: ({ row }) => <div className='text-sm'>{row.getValue('booking_ref') || '-'}</div>,
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      return <div className='font-medium'>€{amount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: 'payment_method',
    header: 'Method',
    cell: ({ row }) => {
      const method = row.getValue('payment_method') as keyof typeof methodConfig;
      const config = methodConfig[method];
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
      const status = row.getValue('status') as keyof typeof statusConfig;
      const config = statusConfig[status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'));
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
            {payment.status === 'success' && onRefund && (
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
