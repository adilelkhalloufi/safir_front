import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Communication } from '@/interfaces/models/communication';
import { IconMail, IconMessage } from '@tabler/icons-react';

export const GetCommunicationColumns = (
  t: any,
  onView: (communication: Communication) => void
): ColumnDef<Communication>[] => [
  {
    accessorKey: 'id',
    header: t('communications.columns.id', 'ID'),
    cell: ({ row }) => <div className="w-[60px]">#{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'booking_id',
    header: t('communications.columns.booking', 'Booking'),
    cell: ({ row }) => (
      <div className="font-medium">#{row.original.booking_id}</div>
    ),
  },
  {
    accessorKey: 'channel',
    header: t('communications.columns.channel', 'Channel'),
    cell: ({ row }) => {
      const channel = row.getValue('channel') as string;
      return (
        <div className="flex items-center gap-2">
          {channel === 'email' ? (
            <IconMail size={16} className="text-blue-500" />
          ) : (
            <IconMessage size={16} className="text-green-500" />
          )}
          <span className="capitalize">{channel}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'to',
    header: t('communications.columns.to', 'To'),
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">{row.getValue('to')}</div>
    ),
  },
  {
    accessorKey: 'subject',
    header: t('communications.columns.subject', 'Subject'),
    cell: ({ row }) => (
      <div className="max-w-[250px] truncate">
        {row.original.subject || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: t('communications.columns.status', 'Status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusColors = {
        sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      };
      return (
        <Badge variant="outline" className={statusColors[status as keyof typeof statusColors]}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'sent_at',
    header: t('communications.columns.sent_at', 'Sent At'),
    cell: ({ row }) => {
      const sentAt = row.original.sent_at;
      return sentAt ? format(new Date(sentAt), 'MMM dd, yyyy HH:mm') : '-';
    },
  },
  {
    accessorKey: 'created_at',
    header: t('communications.columns.created_at', 'Created At'),
    cell: ({ row }) => {
      const createdAt = row.getValue('created_at') as string;
      return format(new Date(createdAt), 'MMM dd, yyyy HH:mm');
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const communication = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('common.actions', 'Actions')}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onView(communication)}>
              <Eye className="mr-2 h-4 w-4" />
              {t('common.view', 'View')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
