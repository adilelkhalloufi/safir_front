import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Edit, Users, XCircle } from 'lucide-react';
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

export interface HammamSession {
  id: number;
  date: string;
  time_slot: string;
  session_type: 'women_only' | 'men_only' | 'mixed';
  capacity: number;
  booked: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

interface HammamSessionColumnsProps {
  onView?: (session: HammamSession) => void;
  onEdit?: (session: HammamSession) => void;
  onCancel?: (session: HammamSession) => void;
  onViewBookings?: (session: HammamSession) => void;
}

const sessionTypeConfig = {
  women_only: { label: 'Women Only', color: 'bg-pink-100 text-pink-800' },
  men_only: { label: 'Men Only', color: 'bg-blue-100 text-blue-800' },
  mixed: { label: 'Mixed', color: 'bg-purple-100 text-purple-800' },
};

const statusConfig = {
  scheduled: { label: 'Scheduled', variant: 'default' as const },
  ongoing: { label: 'Ongoing', variant: 'secondary' as const },
  completed: { label: 'Completed', variant: 'outline' as const },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const },
};

export const GetHammamSessionColumns = ({
  onView,
  onEdit,
  onCancel,
  onViewBookings,
}: HammamSessionColumnsProps): ColumnDef<HammamSession>[] => [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      return <div className='font-medium'>{format(date, 'MMM dd, yyyy')}</div>;
    },
  },
  {
    accessorKey: 'time_slot',
    header: 'Time Slot',
    cell: ({ row }) => <div>{row.getValue('time_slot')}</div>,
  },
  {
    accessorKey: 'session_type',
    header: 'Session Type',
    cell: ({ row }) => {
      const type = row.getValue('session_type') as keyof typeof sessionTypeConfig;
      const config = sessionTypeConfig[type];
      return (
        <Badge variant='outline' className={config.color}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'capacity',
    header: 'Capacity',
    cell: ({ row }) => {
      const session = row.original;
      const percentage = Math.round((session.booked / session.capacity) * 100);
      return (
        <div className='space-y-1'>
          <div className='flex items-center justify-between text-sm'>
            <span>
              {session.booked} / {session.capacity}
            </span>
            <span className='text-muted-foreground'>{percentage}%</span>
          </div>
          <Progress value={percentage} className='h-2' />
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
      const session = row.original;

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
              <DropdownMenuItem onClick={() => onView(session)}>
                <Eye className='mr-2 h-4 w-4' />
                View Details
              </DropdownMenuItem>
            )}
            {onViewBookings && (
              <DropdownMenuItem onClick={() => onViewBookings(session)}>
                <Users className='mr-2 h-4 w-4' />
                View Bookings
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {session.status === 'scheduled' && onEdit && (
              <DropdownMenuItem onClick={() => onEdit(session)}>
                <Edit className='mr-2 h-4 w-4' />
                Edit Session
              </DropdownMenuItem>
            )}
            {session.status === 'scheduled' && onCancel && (
              <DropdownMenuItem onClick={() => onCancel(session)} className='text-red-600'>
                <XCircle className='mr-2 h-4 w-4' />
                Cancel Session
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
