import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Edit, Wrench, CheckCircle2 } from 'lucide-react';
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

export interface Resource {
  id: number;
  name: string;
  type: 'room' | 'chair' | 'wash_station';
  capacity: number;
  status: 'active' | 'maintenance' | 'inactive';
  utilization: number;
  location?: string;
}

interface ResourceColumnsProps {
  onView?: (resource: Resource) => void;
  onEdit?: (resource: Resource) => void;
  onMaintenance?: (resource: Resource) => void;
  onActivate?: (resource: Resource) => void;
}

const typeConfig = {
  room: { label: 'Room', color: 'bg-blue-100 text-blue-800' },
  chair: { label: 'Chair', color: 'bg-green-100 text-green-800' },
  wash_station: { label: 'Wash Station', color: 'bg-purple-100 text-purple-800' },
};

const statusConfig = {
  active: { label: 'Active', variant: 'default' as const },
  maintenance: { label: 'Maintenance', variant: 'secondary' as const },
  inactive: { label: 'Inactive', variant: 'outline' as const },
};

export const GetResourceColumns = ({
  onView,
  onEdit,
  onMaintenance,
  onActivate,
}: ResourceColumnsProps): ColumnDef<Resource>[] => [
  {
    accessorKey: 'name',
    header: 'Resource Name',
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
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => <div>{row.getValue('location') || '-'}</div>,
  },
  {
    accessorKey: 'capacity',
    header: 'Capacity',
    cell: ({ row }) => {
      const capacity = row.getValue('capacity') as number;
      return <div className='text-center'>{capacity}</div>;
    },
  },
  {
    accessorKey: 'utilization',
    header: 'Utilization',
    cell: ({ row }) => {
      const utilization = row.getValue('utilization') as number;
      return (
        <div className='space-y-1'>
          <div className='flex items-center justify-between text-sm'>
            <span>{utilization}%</span>
          </div>
          <Progress value={utilization} className='h-2' />
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
      const resource = row.original;

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
              <DropdownMenuItem onClick={() => onView(resource)}>
                <Eye className='mr-2 h-4 w-4' />
                View Details
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(resource)}>
                <Edit className='mr-2 h-4 w-4' />
                Edit Resource
              </DropdownMenuItem>
            )}
            {resource.status === 'active' && onMaintenance && (
              <DropdownMenuItem onClick={() => onMaintenance(resource)}>
                <Wrench className='mr-2 h-4 w-4' />
                Set Maintenance
              </DropdownMenuItem>
            )}
            {(resource.status === 'maintenance' || resource.status === 'inactive') && onActivate && (
              <DropdownMenuItem onClick={() => onActivate(resource)}>
                <CheckCircle2 className='mr-2 h-4 w-4' />
                Activate
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
