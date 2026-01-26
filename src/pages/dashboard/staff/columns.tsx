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
  user: {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string;
    phone: string;
  };
  type_staff: {
    id: number;
    name: {
      en: string;
      fr: string;
    };
    is_active: boolean;
  };
  specialization: string | null;
  certification: string | null;
  hire_date: string;
  default_break_minutes: number;
  is_active: boolean;
  services: any[];
  availability: any[];
}

interface StaffColumnsProps {
  onView?: (staff: Staff) => void;
  onEdit?: (staff: Staff) => void;
  onSchedule?: (staff: Staff) => void;
}


export const GetStaffColumns = ({
  onView,
  onEdit,
  onSchedule,
}: StaffColumnsProps): ColumnDef<Staff>[] => [
    {
      accessorKey: 'user.email',
      id: 'name',
      header: 'Staff Member',
      cell: ({ row }) => {
        const staff = row.original;
        const firstName = staff.user?.first_name || '';
        const lastName = staff.user?.last_name || '';
        const fullName = [firstName, lastName].filter(Boolean).join(' ') || staff.user?.email?.split('@')[0] || 'N/A';
        const initials = fullName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase();

        return (
          <Button
            variant="ghost"
            className="p-0 h-auto justify-start"
            onClick={() => onView?.(staff)}
          >
            <div className='flex items-center gap-3'>
              <Avatar className='h-8 w-8'>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className='font-medium'>{fullName}</div>
                <div className='text-sm text-muted-foreground'>{staff.user?.email || 'N/A'}</div>
              </div>
            </div>
          </Button>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        console.log('Filtering staff with value:', columnId);
        const staff = row.original;
        const firstName = staff.user?.first_name?.toLowerCase() || '';
        const lastName = staff.user?.last_name?.toLowerCase() || '';
        const email = staff.user?.email?.toLowerCase() || '';
        const searchValue = filterValue.toLowerCase();

        return firstName.includes(searchValue) ||
          lastName.includes(searchValue) ||
          email.includes(searchValue);
      },
    },
    {
      accessorKey: 'type_staff',
      id: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const staff = row.original;
        const typeStaff = staff.type_staff;
        const typeName = typeStaff?.name?.en || typeStaff?.name?.fr || '';

        return (
          <Badge variant='outline' >
            {typeName}
          </Badge>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        console.log('Filtering type with value:', columnId);
        const typeStaffId = row.original.type_staff?.id;
        return typeStaffId === filterValue;
      },
    },
    {
      accessorKey: 'user.phone',
      header: 'Phone',
      cell: ({ row }) => {
        const staff = row.original;
        return <div>{staff.user?.phone || 'N/A'}</div>;
      },
    },
    {
      accessorKey: 'services',
      header: 'Services',
      cell: ({ row }) => {
        const staff = row.original;
        const count = staff.services?.length || 0;
        return <div className='text-center font-medium'>{count}</div>;
      },
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => {
        const staff = row.original;
        const isActive = staff.is_active;
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Active' : 'Inactive'}
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
