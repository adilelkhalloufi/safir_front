import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { IconDotsVertical, IconEdit, IconEye } from '@tabler/icons-react';
import i18n from '@/i18n';



interface GetColumnsProps {
    onView: (serviceType: any) => void;
    onEdit: (serviceType: any) => void;
}

export const GetServiceTypeColumns = ({ onView, onEdit }: GetColumnsProps): ColumnDef<any>[] => [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <span className="font-medium">#{row.original.id}</span>,
    },
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
            const currentLang = i18n.language;
            const name = row.original?.name[currentLang];
            return (
                <div className="flex items-center gap-2">
                    <span className="font-medium">{name}</span>
                </div>
            );
        },
    },


    {
        accessorKey: 'services_count',
        header: 'Services',
        cell: ({ row }) => {
            const count = row.original.services_count;
            return <span className="font-medium">{count || 0}</span>;
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
