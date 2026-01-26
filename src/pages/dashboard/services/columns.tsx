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
 import i18next from '@/i18n';
import { Service } from '@/interfaces/models/service';
 
 

interface ServiceColumnsProps {
  onView?: (service: Service) => void;
  onEdit?: (service: Service) => void;
  onDelete?: (service: Service) => void;
}

 

export const GetServiceColumns = ({
  onView,
  onEdit,
  onDelete,
}: ServiceColumnsProps): ColumnDef<Service>[] => [
  
  {
    accessorKey: 'name',
    header: 'Service Name',
    accessorFn: (row) => {
      const nameObj = (row as any).name;
      const currentLang = i18next.language as 'fr' | 'en';
      return typeof nameObj === 'string' ? nameObj : nameObj?.[currentLang] || nameObj?.fr || nameObj?.en || '';
    },
    cell: ({ row }) => {
      const service = row.original;
      const currentLang = i18next.language as 'fr' | 'en';
      const name = typeof service.name === 'string' 
        ? service.name 
        : service.name?.[currentLang] || service.name?.fr || service.name?.en || '';
      return (
        <Button
          variant="link"
          className="p-0 h-auto font-medium"
          onClick={() => onView?.(service)}
        >
          {name}
        </Button>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    accessorFn: (row) => (row as any).type?.id,
    cell: ({ row }) => {
      const service = row.original;
      const type = (service as any).type;
      const currentLang = i18next.language as 'fr' | 'en';
       
      return (
        <Badge variant='outline' className=''>
          {type?.name?.[currentLang] || type?.name?.fr || type?.name?.en || 'N/A'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'duration_minutes',
    header: 'Duration',
    cell: ({ row }) => {
      const service = row.original;
      const duration = service.duration_minutes || 0;
      return <span>{duration} min</span>;
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      const service = row.original;
      const price = typeof service.price === 'string' ? parseFloat(service.price) : (service.price || 0);
      return <div className='font-medium'>€{price.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean;
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
