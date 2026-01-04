import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { IconDotsVertical, IconEdit, IconEye } from '@tabler/icons-react';
import { ServiceType } from '@/interfaces/models';



interface GetColumnsProps {
    onView: (serviceType: ServiceType) => void;
    onEdit: (serviceType: ServiceType) => void;
}

export const GetServiceTypeColumns = ({ onView, onEdit }: GetColumnsProps): ColumnDef<ServiceType>[] => [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <span className="font-medium">#{row.original.id}</span>,
    },
    {
        accessorKey: 'name_fr',
        header: 'Name (FR)',
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <span className="font-medium">{row.original.name.fr}</span>
            </div>
        ),
    },
    {
        accessorKey: 'name_en',
        header: 'Name (EN)',
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <span className="font-medium">{row.original.name.en}</span>
            </div>
        ),
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => (
            <Badge variant={row.original.is_active ? 'default' : 'secondary'}>
                {row.original.is_active ? 'Active' : 'Inactive'}
            </Badge>
        ),
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
