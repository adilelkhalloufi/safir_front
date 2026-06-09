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
import { BlockedTimeSlot, BlockedSlotReason } from '@/interfaces/models/blockedTimeSlot';

interface BlockedTimeSlotsColumnsProps {
  onView?: (slot: BlockedTimeSlot) => void;
  onEdit?: (slot: BlockedTimeSlot) => void;
  onDelete?: (slot: BlockedTimeSlot) => void;
}

const reasonMap: Record<BlockedSlotReason, string> = {
  sick_leave: 'Sick Leave',
  maintenance: 'Maintenance',
  reserved_event: 'Reserved Event',
  holiday: 'Holiday',
  training: 'Training',
  urgent_closure: 'Urgent Closure',
};

const typeMap: Record<string, string> = {
  staff: 'Staff',
  service: 'Service',
  facility: 'Facility',
};

const formatDateTime = (dateTimeStr: string): string => {
  try {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateTimeStr;
  }
};

export const GetBlockedTimeSlotsColumns = ({
  onView,
  onEdit,
  onDelete,
}: BlockedTimeSlotsColumnsProps): ColumnDef<BlockedTimeSlot>[] => [
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return <Badge variant="outline">{typeMap[type] || type}</Badge>;
    },
  },
  {
    accessorKey: 'staff_profile',
    header: 'Staff/Resource',
    cell: ({ row }) => {
      const slot = row.original;
      const staffProfile = slot.staff_profile;
      if (staffProfile) {
        return (
          <div>
            <div className="font-medium">{staffProfile.name}</div>
            {staffProfile.specialization && (
              <div className="text-sm text-muted-foreground">{staffProfile.specialization}</div>
            )}
          </div>
        );
      }
      return <span className="text-muted-foreground">-</span>;
    },
  },
  {
    accessorKey: 'start_datetime',
    header: 'Start Date/Time',
    cell: ({ row }) => {
      const startTime = row.getValue('start_datetime') as string;
      return <span>{formatDateTime(startTime)}</span>;
    },
  },
  {
    accessorKey: 'end_datetime',
    header: 'End Date/Time',
    cell: ({ row }) => {
      const endTime = row.getValue('end_datetime') as string;
      return <span>{formatDateTime(endTime)}</span>;
    },
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
    cell: ({ row }) => {
      const reason = row.getValue('reason') as BlockedSlotReason | null;
      if (!reason) return <span className="text-muted-foreground">-</span>;
      return <Badge variant="secondary">{reasonMap[reason] || reason}</Badge>;
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
      const slot = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {onView && (
              <DropdownMenuItem onClick={() => onView(slot)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(slot)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={() => onDelete(slot)} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
