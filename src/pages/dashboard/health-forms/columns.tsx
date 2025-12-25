import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, CheckCircle, XCircle } from 'lucide-react';
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

export interface HealthForm {
  id: number;
  client_name: string;
  client_email: string;
  submitted_date: string;
  status: 'pending' | 'approved' | 'needs-update';
  reviewed_by: string | null;
  has_conditions: boolean;
}

interface HealthFormColumnsProps {
  onView?: (form: HealthForm) => void;
  onApprove?: (form: HealthForm) => void;
  onReject?: (form: HealthForm) => void;
}

const statusConfig = {
  pending: { label: 'Pending', variant: 'secondary' as const },
  approved: { label: 'Approved', variant: 'default' as const },
  'needs-update': { label: 'Needs Update', variant: 'destructive' as const },
};

export const GetHealthFormColumns = ({
  onView,
  onApprove,
  onReject,
}: HealthFormColumnsProps): ColumnDef<HealthForm>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <div className='font-medium'>#{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'client_name',
    header: 'Client',
    cell: ({ row }) => {
      const form = row.original;
      return (
        <div>
          <div className='font-medium'>{form.client_name}</div>
          <div className='text-sm text-muted-foreground'>{form.client_email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'submitted_date',
    header: 'Submitted Date',
    cell: ({ row }) => format(new Date(row.getValue('submitted_date')), 'MMM dd, yyyy HH:mm'),
  },
  {
    header: 'Medical Conditions',
    cell: ({ row }) => {
      const form = row.original;
      return form.has_conditions ? (
        <Badge variant='outline' className='bg-orange-50 text-orange-700 border-orange-200'>
          Has Conditions
        </Badge>
      ) : (
        <span className='text-sm text-muted-foreground'>None</span>
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
    accessorKey: 'reviewed_by',
    header: 'Reviewed By',
    cell: ({ row }) => {
      const reviewer = row.getValue('reviewed_by') as string | null;
      return reviewer ? (
        <span className='text-sm'>{reviewer}</span>
      ) : (
        <span className='text-sm text-muted-foreground'>Not reviewed</span>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const form = row.original;
      const isPending = form.status === 'pending' || form.status === 'needs-update';

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
              <DropdownMenuItem onClick={() => onView(form)}>
                <Eye className='mr-2 h-4 w-4' />
                View Details
              </DropdownMenuItem>
            )}
            {isPending && (
              <>
                <DropdownMenuSeparator />
                {onApprove && (
                  <DropdownMenuItem onClick={() => onApprove(form)}>
                    <CheckCircle className='mr-2 h-4 w-4 text-green-600' />
                    Approve
                  </DropdownMenuItem>
                )}
                {onReject && (
                  <DropdownMenuItem onClick={() => onReject(form)}>
                    <XCircle className='mr-2 h-4 w-4 text-red-600' />
                    Request Update
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
