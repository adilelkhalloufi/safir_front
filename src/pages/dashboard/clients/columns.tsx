import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Edit } from 'lucide-react';
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

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  total_bookings: number;
  total_spent: number;
  status: 'active' | 'inactive';
  created_at: string;
}

interface ClientColumnsProps {
  onView?: (client: Client) => void;
  onEdit?: (client: Client) => void;
}

export const GetClientColumns = ({
  onView,
  onEdit,
}: ClientColumnsProps): ColumnDef<Client>[] => [
  {
    accessorKey: 'name',
    header: 'Client',
    cell: ({ row }) => {
      const client = row.original;
      const initials = client.name
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
            <div className='font-medium'>{client.name}</div>
            <div className='text-sm text-muted-foreground'>{client.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    cell: ({ row }) => {
      const gender = row.getValue('gender') as string;
      return (
        <span className='capitalize'>
          {gender === 'male' ? 'M' : gender === 'female' ? 'F' : 'Other'}
        </span>
      );
    },
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
    accessorKey: 'total_spent',
    header: 'Total Spent',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('total_spent'));
      return <div className='font-medium'>€{amount.toFixed(2)}</div>;
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
      const client = row.original;

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
              <DropdownMenuItem onClick={() => onView(client)}>
                <Eye className='mr-2 h-4 w-4' />
                View Details
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(client)}>
                <Edit className='mr-2 h-4 w-4' />
                Edit Client
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
