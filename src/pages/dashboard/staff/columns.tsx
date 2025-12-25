import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Edit, Calendar } from 'lucide-react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export interface Staff {
  id: number;
  name: string;
  type: 'massage' | 'coiffure' | 'hammam';
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  total_bookings: number;
}

interface StaffColumnsProps {
  onView?: (staff: Staff) => void;
  onEdit?: (staff: Staff) => void;
  onSchedule?: (staff: Staff) => void;
}

const staffTypeConfig = {
  massage: { label: 'Massage Therapist', color: 'bg-blue-100 text-blue-800' },
  coiffure: { label: 'Hair Stylist', color: 'bg-purple-100 text-purple-800' },
  hammam: { label: 'Hammam Attendant', color: 'bg-green-100 text-green-800' },
};

export const GetStaffColumns = ({
  onView,
  onEdit,
  onSchedule,
}: StaffColumnsProps): ColumnDef<Staff>[] => [
  {
    accessorKey: 'name',
    header: 'Staff Member',
    cell: ({ row }) => {
      const staff = row.original;
      const initials = staff.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();

      return (
        <div className='flex items-center gap-3'>
          <Avatar className='h-8 w-8'>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className='font-medium'>{staff.name}</div>
            <div className='text-sm text-muted-foreground'>{staff.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as keyof typeof staffTypeConfig;
      const config = staffTypeConfig[type];
      return (
        <Badge variant='outline' className={config.color}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'total_bookings',
    header: 'Total Bookings',
    cell: ({ row }) => {
      const count = row.getValue('total_bookings') as number;
      return <div className='text-center font-medium'>{count}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const staff = row.original;

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
              <DropdownMenuItem onClick={() => onView(staff)}>
                <Eye className='mr-2 h-4 w-4' />
                View Details
              </DropdownMenuItem>
            )}
            {onSchedule && (
              <DropdownMenuItem onClick={() => onSchedule(staff)}>
                <Calendar className='mr-2 h-4 w-4' />
                Manage Schedule
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(staff)}>
                <Edit className='mr-2 h-4 w-4' />
                Edit Staff
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
