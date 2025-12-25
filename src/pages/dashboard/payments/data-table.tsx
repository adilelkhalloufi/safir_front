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

export function PaymentsDataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
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
          placeholder={t('payments.searchPlaceholder', 'Search by client or transaction ID...')}
          value={(table.getColumn('client_name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('client_name')?.setFilterValue(event.target.value)}
          className='max-w-sm'
        />
        <Select
          value={(table.getColumn('payment_method')?.getFilterValue() as string) ?? 'all'}
          onValueChange={(value) => table.getColumn('payment_method')?.setFilterValue(value === 'all' ? '' : value)}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder={t('payments.filterByMethod', 'Filter by method')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>{t('payments.allMethods', 'All Methods')}</SelectItem>
            <SelectItem value='card'>{t('payments.methodCard', 'Card')}</SelectItem>
            <SelectItem value='cash'>{t('payments.methodCash', 'Cash')}</SelectItem>
            <SelectItem value='bank_transfer'>{t('payments.methodBank', 'Bank Transfer')}</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={(table.getColumn('status')?.getFilterValue() as string) ?? 'all'}
          onValueChange={(value) => table.getColumn('status')?.setFilterValue(value === 'all' ? '' : value)}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder={t('payments.filterByStatus', 'Filter by status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>{t('payments.allStatuses', 'All Statuses')}</SelectItem>
            <SelectItem value='success'>{t('payments.statusSuccess', 'Success')}</SelectItem>
            <SelectItem value='pending'>{t('payments.statusPending', 'Pending')}</SelectItem>
            <SelectItem value='failed'>{t('payments.statusFailed', 'Failed')}</SelectItem>
            <SelectItem value='refunded'>{t('payments.statusRefunded', 'Refunded')}</SelectItem>
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
                  {t('payments.noResults', 'No payments found.')}
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
