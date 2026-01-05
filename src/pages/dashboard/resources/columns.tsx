import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Eye, Edit, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { TypeResource } from '@/interfaces/models'

export interface Resource {
  id: number
  name: {
    fr: string
    en: string
  }
  description: {
    fr: string | null
    en: string | null
  }
  capacity: number | null
  location: string | null
  is_available: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  type_resource: TypeResource
}

interface ResourceColumnsProps {
  onView?: (resource: Resource) => void
  onEdit?: (resource: Resource) => void
  onActivate?: (resource: Resource) => void
  t: (key: string, fallback: string) => string
  currentLang: 'fr' | 'en'
}

export const GetResourceColumns = ({
  onView,
  onEdit,
  onActivate,
  t,
  currentLang,
}: ResourceColumnsProps): ColumnDef<Resource>[] => [
  {
    accessorKey: 'name',
    header: t('resources.name', 'Name'),
    cell: ({ row }) => {
      const name = row.getValue('name') as { fr: string; en: string };
      return <div className='font-medium'>{name[currentLang]}</div>;
    },
  },
  {
    accessorKey: 'description',
    header: t('resources.description', 'Description'),
    cell: ({ row }) => {
      const description = row.getValue('description') as {
        fr: string | null
        en: string | null
      };
      const desc = description[currentLang];
      return <div className='max-w-xs truncate'>{desc || '-'}</div>;
    },
  },
  {
    accessorKey: 'capacity',
    header: t('resources.capacity', 'Capacity'),
    cell: ({ row }) => {
      const capacity = row.getValue('capacity') as number | null;
      return <div className='text-center'>{capacity ?? '-'}</div>;
    },
  },
  {
    accessorKey: 'location',
    header: t('resources.location', 'Location'),
    cell: ({ row }) => {
      const location = row.getValue('location') as string | null;
      return <div className='max-w-xs truncate'>{location || '-'}</div>;
    },
  },
  {
    accessorKey: 'type_resource',
    header: t('resources.typeResource', 'Type Resource'),
    cell: ({ row }) => {
      const typeResource = row.original?.type_resource;
      return (
        <Badge variant='secondary'>
          {typeResource?.name?.[currentLang] || 'N/A'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const resource = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>
              {t('common.actions', 'Actions')}
            </DropdownMenuLabel>
            {onView && (
              <DropdownMenuItem onClick={() => onView(resource)}>
                <Eye className='mr-2 h-4 w-4' />
                {t('common.view', 'View')}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(resource)}>
                <Edit className='mr-2 h-4 w-4' />
                {t('common.edit', 'Edit')}
              </DropdownMenuItem>
            )}
            {/* {resource.is_active && onMaintenance && (
              <DropdownMenuItem onClick={() => onMaintenance(resource)}>
                <Wrench className='mr-2 h-4 w-4' />
                {t('resources.setMaintenance', 'Set Maintenance')}
              </DropdownMenuItem>
            )} */}
            {!resource.is_active && onActivate && (
              <DropdownMenuItem onClick={() => onActivate(resource)}>
                <CheckCircle2 className='mr-2 h-4 w-4' />
                {t('resources.activate', 'Activate')}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
