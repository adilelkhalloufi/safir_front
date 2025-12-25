import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Edit, Plus, Ban, RefreshCw } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';

export interface Subscription {
  id: number;
  client_name: string;
  client_email: string;
  package_type: string;
  sessions_total: number;
  sessions_used: number;
  sessions_remaining: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'suspended';
}

interface SubscriptionColumnsProps {
  onView?: (subscription: Subscription) => void;
  onEdit?: (subscription: Subscription) => void;
  onExtend?: (subscription: Subscription) => void;
  onAddSessions?: (subscription: Subscription) => void;
  onSuspend?: (subscription: Subscription) => void;
}

const statusConfig = {
  active: { label: 'Active', variant: 'default' as const },
  expired: { label: 'Expired', variant: 'secondary' as const },
  suspended: { label: 'Suspended', variant: 'destructive' as const },
};

export const GetSubscriptionColumns = ({
  onView,
  onEdit,
  onExtend,
  onAddSessions,
  onSuspend,
}: SubscriptionColumnsProps): ColumnDef<Subscription>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <div className='font-medium'>#{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'client_name',
    header: 'Client',
    cell: ({ row }) => {
      const subscription = row.original;
      return (
        <div>
          <div className='font-medium'>{subscription.client_name}</div>
          <div className='text-sm text-muted-foreground'>{subscription.client_email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'package_type',
    header: 'Package',
    cell: ({ row }) => (
      <Badge variant='outline'>{row.getValue('package_type')}</Badge>
    ),
  },
  {
    header: 'Sessions',
    cell: ({ row }) => {
      const subscription = row.original;
      const usagePercent = (subscription.sessions_used / subscription.sessions_total) * 100;
      
      return (
        <div className='space-y-1 min-w-[150px]'>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>
              {subscription.sessions_used} / {subscription.sessions_total}
            </span>
            <span className='font-medium'>{subscription.sessions_remaining} left</span>
          </div>
          <Progress value={usagePercent} className='h-2' />
        </div>
      );
    },
  },
  {
    accessorKey: 'start_date',
    header: 'Start Date',
    cell: ({ row }) => format(new Date(row.getValue('start_date')), 'MMM dd, yyyy'),
  },
  {
    accessorKey: 'end_date',
    header: 'End Date',
    cell: ({ row }) => {
      const endDate = new Date(row.getValue('end_date'));
      const today = new Date();
      const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const isExpiringSoon = daysLeft <= 7 && daysLeft > 0;
      
      return (
        <div>
          <div>{format(endDate, 'MMM dd, yyyy')}</div>
          {isExpiringSoon && (
            <div className='text-xs text-orange-600'>Expires in {daysLeft} days</div>
          )}
        </div>
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
    id: 'actions',
    cell: ({ row }) => {
      const subscription = row.original;
      const canExtend = subscription.status === 'active' || subscription.status === 'expired';
      const canSuspend = subscription.status === 'active';

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
              <DropdownMenuItem onClick={() => onView(subscription)}>
                <Eye className='mr-2 h-4 w-4' />
                View Details
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {canExtend && onExtend && (
              <DropdownMenuItem onClick={() => onExtend(subscription)}>
                <RefreshCw className='mr-2 h-4 w-4 text-blue-600' />
                Extend Expiry
              </DropdownMenuItem>
            )}
            {onAddSessions && (
              <DropdownMenuItem onClick={() => onAddSessions(subscription)}>
                <Plus className='mr-2 h-4 w-4 text-green-600' />
                Add Bonus Sessions
              </DropdownMenuItem>
            )}
            {canSuspend && onSuspend && (
              <DropdownMenuItem onClick={() => onSuspend(subscription)}>
                <Ban className='mr-2 h-4 w-4 text-red-600' />
                Suspend
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(subscription)}>
                <Edit className='mr-2 h-4 w-4' />
                Edit
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
