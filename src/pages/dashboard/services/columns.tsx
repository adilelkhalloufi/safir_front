import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
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

export interface Service {
  id: number;
  name: string;
  type: 'massage' | 'hammam' | 'coiffure';
  duration: number;
  price: number;
  status: 'active' | 'inactive';
  total_bookings: number;
  image?: string;
}

interface ServiceColumnsProps {
  onView?: (service: Service) => void;
  onEdit?: (service: Service) => void;
  onDelete?: (service: Service) => void;
}

const typeConfig = {
  massage: { label: 'Massage', color: 'bg-blue-100 text-blue-800' },
  hammam: { label: 'Hammam', color: 'bg-green-100 text-green-800' },
  coiffure: { label: 'Hair Salon', color: 'bg-purple-100 text-purple-800' },
};

export const GetServiceColumns = ({
  onView,
  onEdit,
  onDelete,
}: ServiceColumnsProps): ColumnDef<Service>[] => [
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const service = row.original;
      return service.image ? (
        <img
          src={service.image}
          alt={service.name}
          className='h-12 w-12 rounded object-cover'
        />
      ) : (
        <Avatar className='h-12 w-12'>
          <AvatarFallback>{service.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'Service Name',
    cell: ({ row }) => <div className='font-medium'>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as keyof typeof typeConfig;
      const config = typeConfig[type];
      return (
        <Badge variant='outline' className={config.color}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => {
      const duration = row.getValue('duration') as number;
      return <span>{duration} min</span>;
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      return <div className='font-medium'>€{price.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: 'total_bookings',
    header: 'Total Bookings',
    cell: ({ row }) => {
      const count = row.getValue('total_bookings') as number;
      return <div className='text-center'>{count}</div>;
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
      const service = row.original;

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
              <DropdownMenuItem onClick={() => onView(service)}>
                <Eye className='mr-2 h-4 w-4' />
                View Details
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(service)}>
                <Edit className='mr-2 h-4 w-4' />
                Edit Service
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={() => onDelete(service)} className='text-red-600'>
                <Trash2 className='mr-2 h-4 w-4' />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
