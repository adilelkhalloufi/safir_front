import { TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  rows?: number;
  cols?: number;
};

export default function TableLoading({ rows = 5, cols = 6 }: Props) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton className='h-4 w-full' />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}