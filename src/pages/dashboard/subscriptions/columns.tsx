import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye} from 'lucide-react';
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
import i18next from 'i18next';

export interface Subscription {
  id: number;
  user_id: number;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    preferred_language: string;
    address: string | null;
    role: string;
    status: number;
  };
  subscription_plan: {
    id: number;
    service_id: number;
    name: { fr: string; en: string };
    description: { fr: string; en: string };
    total_sessions: number;
    price: number;
    duration_days: number;
    max_members: number;
    is_active: boolean;
    display_order: number;
  };
  name: string | null;
  description: string | null;
  total_sessions: number;
  used_sessions: number;
  remaining_sessions: number | null;
  price_paid: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
  inactive: { label: 'Inactive', variant: 'secondary' as const },
  expired: { label: 'Expired', variant: 'secondary' as const },
  suspended: { label: 'Suspended', variant: 'destructive' as const },
};

const getStatus = (sub: Subscription): keyof typeof statusConfig => {
  if (!sub.is_active) return 'inactive';
  const endDate = new Date(sub.end_date);
  if (endDate < new Date()) return 'expired';
  return 'active';
};

export const GetSubscriptionColumns = ({
  onView,
}: SubscriptionColumnsProps): ColumnDef<Subscription>[] => {
  const lang = (i18next.language || 'fr') as 'fr' | 'en';

  return [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <div className='font-medium'>#{row.getValue('id')}</div>,
  },
  {
    id: 'client',
    header: 'Client',
    cell: ({ row }) => {
      const subscription = row.original;
      return (
        <div>
          <div className='font-medium'>{subscription.user?.name}</div>
          <div className='text-sm text-muted-foreground'>{subscription.user?.email}</div>
        </div>
      );
    },
  },
  {
    id: 'plan',
    header: 'Plan',
    cell: ({ row }) => {
      const subscription = row.original;
      const planName = subscription.name || subscription.subscription_plan?.name?.[lang] || subscription.subscription_plan?.name?.fr || '';
      return (
        <Badge variant='outline'>{planName}</Badge>
      );
    },
  },
  {
    header: 'Sessions',
    cell: ({ row }) => {
      const subscription = row.original;
      const remaining = subscription.remaining_sessions ?? (subscription.total_sessions - subscription.used_sessions);
      const usagePercent = subscription.total_sessions > 0
        ? (subscription.used_sessions / subscription.total_sessions) * 100
        : 0;
      
      return (
        <div className='space-y-1 min-w-[150px]'>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>
              {subscription.used_sessions} / {subscription.total_sessions}
            </span>
            <span className='font-medium'>{remaining} left</span>
          </div>
          <Progress value={usagePercent} className='h-2' />
        </div>
      );
    },
  },
  {
    accessorKey: 'price_paid',
    header: 'Price',
    cell: ({ row }) => <span className='font-medium'>{row.getValue('price_paid')} $</span>,
  },
  {
    accessorKey: 'start_date',
    header: 'Start Date',
    cell: ({ row }) => {
      const val = row.getValue('start_date') as string;
      return val ? format(new Date(val), 'MMM dd, yyyy') : '-';
    },
  },
  {
    accessorKey: 'end_date',
    header: 'End Date',
    cell: ({ row }) => {
      const val = row.getValue('end_date') as string;
      if (!val) return '-';
      const endDate = new Date(val);
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
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = getStatus(row.original);
      const config = statusConfig[status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const subscription = row.original;
      // const status = getStatus(subscription);
      // const canExtend = status === 'active' || status === 'expired';
      // const canSuspend = status === 'active';

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
            {/* {canExtend && onExtend && (
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
            )} */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
};
