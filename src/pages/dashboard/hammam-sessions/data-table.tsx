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
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function HammamSessionsDataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { t } = useTranslation();

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

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Input
          placeholder={t('hammamSessions.searchPlaceholder', 'Search by date...')}
          value={(table.getColumn('date')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('date')?.setFilterValue(event.target.value)}
          className='max-w-sm'
        />
        <Select
          value={(table.getColumn('session_type')?.getFilterValue() as string) ?? 'all'}
          onValueChange={(value) => table.getColumn('session_type')?.setFilterValue(value === 'all' ? '' : value)}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder={t('hammamSessions.filterByType', 'Filter by type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>{t('hammamSessions.allTypes', 'All Types')}</SelectItem>
            <SelectItem value='women_only'>{t('hammamSessions.typeWomenOnly', 'Women Only')}</SelectItem>
            <SelectItem value='men_only'>{t('hammamSessions.typeMenOnly', 'Men Only')}</SelectItem>
            <SelectItem value='mixed'>{t('hammamSessions.typeMixed', 'Mixed')}</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={(table.getColumn('status')?.getFilterValue() as string) ?? 'all'}
          onValueChange={(value) => table.getColumn('status')?.setFilterValue(value === 'all' ? '' : value)}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder={t('hammamSessions.filterByStatus', 'Filter by status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>{t('hammamSessions.allStatuses', 'All Statuses')}</SelectItem>
            <SelectItem value='scheduled'>{t('hammamSessions.statusScheduled', 'Scheduled')}</SelectItem>
            <SelectItem value='ongoing'>{t('hammamSessions.statusOngoing', 'Ongoing')}</SelectItem>
            <SelectItem value='completed'>{t('hammamSessions.statusCompleted', 'Completed')}</SelectItem>
            <SelectItem value='cancelled'>{t('hammamSessions.statusCancelled', 'Cancelled')}</SelectItem>
          </SelectContent>
        </Select>
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
                  {t('hammamSessions.noResults', 'No sessions found.')}
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
