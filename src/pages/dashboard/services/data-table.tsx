import { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import { useQuery } from '@tanstack/react-query';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { ServiceType } from '@/interfaces/models/serviceType';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ServicesDataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { t } = useTranslation();

  // Fetch service types from API
  const { data: serviceTypes = [] } = useQuery<ServiceType[]>({
    queryKey: ['serviceTypes'],
    queryFn: () => http.get(apiRoutes.adminServiceTypes).then(res => res.data?.data || res.data),
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const typeOptions = [
    { value: 'all', name: t('services.allTypes', 'All Types') },
    ...serviceTypes.map(type => ({
      value: type.id.toString(),
      name: `${type.name.fr} | ${type.name.en}`,
    })),
  ];

  const statusOptions = [
    { value: 'all', name: t('services.allStatuses', 'All Statuses') },
    { value: 'true', name: t('services.statusActive', 'Active') },
    { value: 'false', name: t('services.statusInactive', 'Inactive') },
  ];

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Input
          placeholder={t('services.searchPlaceholder', 'Search services...')}
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
          className='max-w-sm'
        />
        <Combobox
          data={typeOptions}
          defaultValue={(table.getColumn('type')?.getFilterValue() as string) || 'all'}
          placeholder={t('services.filterByType', 'Filter by type')}
          onSelectionChange={(value) => table.getColumn('type')?.setFilterValue(value === 'all' ? '' : value)}
          returnFullObject={false}
        />
        <Combobox
          data={statusOptions}
          defaultValue={(table.getColumn('is_active')?.getFilterValue() as string) || 'all'}
          placeholder={t('services.filterByStatus', 'Filter by status')}
          onSelectionChange={(value) => {
            if (value === 'all') {
              table.getColumn('is_active')?.setFilterValue('');
            } else {
              table.getColumn('is_active')?.setFilterValue(value === 'true');
            }
          }}
          returnFullObject={false}
        />
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  {t('services.noResults', 'No services found.')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {t('common.previous', 'Previous')}
        </Button>
        <Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {t('common.next', 'Next')}
        </Button>
      </div>
    </div>
  );
}
