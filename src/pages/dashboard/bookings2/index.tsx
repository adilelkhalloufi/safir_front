import { GetBookingColumns, Booking } from './columns';
import { BookingsDataTable } from './data-table';
import { useEffect, useMemo, useState } from 'react';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { webRoutes } from '@/routes/web';
import { useTranslation } from 'react-i18next';
import { setPageTitle } from '@/utils';
 
import MagicForm from '@/components/custom/MagicForm';
import { Calendar as CalendarIcon,   X } from 'lucide-react';
 
export default function BookingsIndex() {
  const { t } = useTranslation();
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
   const [filters, setFilters] = useState({
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
    client: '',
    status: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setPageTitle(t('bookings.title', 'Bookings Management'));
    fetchBookings();
  }, [t]);

 const fetchBookings = (filterParams?: any) => {
  setLoading(true);

  const params: any = {};

  if (filterParams) {
    if (filterParams.date_from) params.date_from = filterParams.date_from;
    if (filterParams.date_to) params.date_to = filterParams.date_to;
    if (filterParams.client) params.client = filterParams.client;
    if (filterParams.status && filterParams.status !== 'all') {
      params.status = filterParams.status;
    }
  }

  http
    .get(apiRoutes.adminBookings, { params })
    .then((res) => {
      setData(res.data.data || []);
    })
    .catch((err) => {
      console.error('fetch bookings error', err);
      toast({
        variant: 'destructive',
        title: t('common.error', 'Error'),
        description: t('bookings.fetchError', 'Failed to fetch bookings'),
      });
    })
    .finally(() => {
      setLoading(false);
    });
};

  const handleView = (booking: Booking) => {
    navigate(webRoutes.bookings.view.replace(':id', booking.id.toString()));
  };

  const handleComplete = (booking: Booking) => {
    http
      .post(apiRoutes.adminBookingComplete(booking.id), {})
      .then(() => {
        toast({
          title: t('common.success', 'Success'),
          description: t('bookings.completedSuccess', 'Booking marked as completed'),
        });
        fetchBookings();
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: t('common.error', 'Error'),
          description: t('bookings.completeError', 'Failed to mark booking as completed'),
        });
      });
  };

 
 
  const handleNoShow = (booking: Booking) => {
    http
      .post(apiRoutes.adminBookingNoShow(booking.id), {})
      .then(() => {
        toast({
          title: t('common.success', 'Success'),
          description: t('bookings.noShowSuccess', 'Booking marked as no-show'),
        });
        fetchBookings();
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: t('common.error', 'Error'),
          description: t('bookings.noShowError', 'Failed to mark booking as no-show'),
        });
      });
  };

 

  const handleFilterSubmit = (filterData: any) => {
    setFilters({
      dateFrom: filterData.date_from ? new Date(filterData.date_from) : undefined,
      dateTo: filterData.date_to ? new Date(filterData.date_to) : undefined,
      client: filterData.client || '',
      status: filterData.status || 'all',
    });
    fetchBookings(filterData);
    setShowFilters(false);
  };

  const columns = useMemo(
    () =>
      GetBookingColumns({
        onView: handleView,
        onComplete: handleComplete,
         onNoShow: handleNoShow,
       }),
    [t]
  );

  const clearFilters = () => {
    setFilters({
      dateFrom: undefined,
      dateTo: undefined,
      client: '',
      status: 'all',
    });
  };

  return (
    <>
      <div className='mb-6 space-y-4'>
        <div className='flex w-full items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>{t('bookings.title', 'Bookings Management')}</h1>
            <p className='text-muted-foreground'>
              {t('bookings.subtitle', 'Manage and track all bookings')}
            </p>
          </div>
      
        </div>

        {/* Filters */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Button variant='outline' onClick={() => setShowFilters(!showFilters)}>
              <CalendarIcon className='mr-2 h-4 w-4' />
              {t('bookings.filters', 'Filters')}
              {(filters.dateFrom || filters.dateTo || filters.client || filters.status !== 'all') && (
                <span className='ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground'>
                  Active
                </span>
              )}
            </Button>
            {(filters.dateFrom || filters.dateTo || filters.client || filters.status !== 'all') && (
              <Button variant='ghost' onClick={clearFilters} className='gap-2'>
                <X className='h-4 w-4' />
                {t('bookings.clearFilters', 'Clear')}
              </Button>
            )}
          </div>

          {showFilters && (
            <div className='rounded-lg border bg-card p-4'>
              <MagicForm
                title=''
                fields={[
                  {
                    group: 'filters',
                    fields: [
                      {
                        name: 'date_from',
                        label: t('bookings.dateFrom', 'Date From'),
                        type: 'date',
                        placeholder: t('bookings.selectDateFrom', 'Select start date'),
                        width: 'half',
                        defaultValue: filters.dateFrom ? filters.dateFrom : undefined,
                      },
                      {
                        name: 'date_to',
                        label: t('bookings.dateTo', 'Date To'),
                        type: 'date',
                        placeholder: t('bookings.selectDateTo', 'Select end date'),
                        width: 'half',
                        defaultValue: filters.dateTo ? filters.dateTo : undefined,
                      },
                      {
                        name: 'client',
                        label: t('bookings.client', 'Client'),
                        type: 'text',
                        placeholder: t('bookings.searchClient', 'Search by name, email or phone...'),
                        width: 'half',
                        defaultValue: filters.client,
                      },
                      {
                        name: 'status',
                        label: t('bookings.status', 'Status'),
                        type: 'select',
                        placeholder: t('bookings.selectStatus', 'Select status'),
                        width: 'half',
                        defaultValue: filters.status,
                        options: [
                          { value: 'all', name: t('bookings.allStatus', 'All Status') },
                          { value: 'draft', name: t('bookings.status_draft', 'Draft') },
                          { value: 'confirmed', name: t('bookings.status_confirmed', 'Confirmed') },
                          { value: 'deposit_paid', name: t('bookings.status_deposit_paid', 'Deposit Paid') },
                          { value: 'completed', name: t('bookings.status_completed', 'Completed') },
                          { value: 'cancelled', name: t('bookings.status_cancelled', 'Cancelled') },
                          { value: 'no-show', name: t('bookings.status_no-show', 'No-show') },
                        ],
                      },
                    ],
                  },
                ]}
                onSubmit={handleFilterSubmit}
                button={t('bookings.applyFilters', 'Apply Filters')}
                loading={loading}
              />
            </div>
          )}
        </div>
      </div>


      <BookingsDataTable columns={columns} data={data} loading={loading} />


   
 
    </>
  );
}
