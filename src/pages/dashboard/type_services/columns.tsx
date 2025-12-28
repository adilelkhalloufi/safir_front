import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { IconDotsVertical, IconEdit, IconEye } from '@tabler/icons-react';

export interface ServiceType {
    id: number;
    name: string;
    code: string;
    description?: string;
    is_active: boolean;
    services_count?: number;
}

interface GetColumnsProps {
    onView: (serviceType: ServiceType) => void;
    onEdit: (serviceType: ServiceType) => void;
}

export const GetServiceTypeColumns = ({ onView, onEdit }: GetColumnsProps): ColumnDef<ServiceType>[] => [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <span className="font-medium">#{row.getValue('id')}</span>,
    },
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <span className="font-medium">{row.getValue('name')}</span>
            </div>
        ),
    },
    {
        accessorKey: 'code',
        header: 'Code',
        cell: ({ row }) => (
            <Badge variant="outline" className="font-mono">
                {row.getValue('code')}
            </Badge>
        ),
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
            const description = row.getValue('description') as string;
            return <span className="text-muted-foreground">{description || '-'}</span>;
        },
    },
    {
        accessorKey: 'services_count',
        header: 'Services',
        cell: ({ row }) => {
            const count = row.getValue('services_count') as number;
            return <span className="font-medium">{count || 0}</span>;
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
            const serviceType = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <IconDotsVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(serviceType)}>
                            <IconEye className="mr-2 h-4 w-4" />
                            View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(serviceType)}>
                            <IconEdit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
