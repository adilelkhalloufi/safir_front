import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { PaymentsDataTable } from './data-table';
import { Payment, GetPaymentColumns } from './columns';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';

export default function PaymentsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [refundData, setRefundData] = useState({
    amount: 0,
    reason: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
  });
  const [appliedFilters, setAppliedFilters] = useState({
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
  });

  // Fetch payments
  const { data: payments = [], isLoading } = useQuery<Payment[]>({
    queryKey: ['payments', appliedFilters],
    queryFn: () => {
      const params: any = {};
      if (appliedFilters.dateFrom) {
        params.date_from = format(appliedFilters.dateFrom, 'yyyy-MM-dd');
      }
      if (appliedFilters.dateTo) {
        params.date_to = format(appliedFilters.dateTo, 'yyyy-MM-dd');
      }
      return http.get(apiRoutes.adminPayments, { params }).then((res) => res.data.data);
    },
  });

  // Refund mutation
  const refundMutation = useMutation({
    mutationFn: (data: { id: number; amount: number; reason: string }) =>
      http.post(apiRoutes.adminPaymentRefund(data.id), { amount: data.amount, reason: data.reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({
        title: t('payments.refundSuccess', 'Refund processed successfully'),
        description: t('payments.refundSuccessDesc', 'The refund has been initiated.'),
      });
      setIsRefundDialogOpen(false);
      setSelectedPayment(null);
      setRefundData({ amount: 0, reason: '' });
    },
    onError: () => {
      toast({
        title: t('payments.refundError', 'Error'),
        description: t('payments.refundErrorDesc', 'Failed to process refund. Please try again.'),
        variant: 'destructive',
      });
    },
  });

  const handleView = (payment: Payment) => {
    console.log('View payment:', payment);
  };

  const handleRefund = (payment: Payment) => {
    setSelectedPayment(payment);
    setRefundData({
      amount: payment.amount,
      reason: '',
    });
    setIsRefundDialogOpen(true);
  };

  const handleProcessRefund = () => {
    if (!selectedPayment) return;
    refundMutation.mutate({
      id: selectedPayment.id,
      amount: refundData.amount,
      reason: refundData.reason,
    });
  };

  const columns = GetPaymentColumns({
    onView: handleView,
    onRefund: handleRefund,
  });

  const applyFilters = () => {
    setAppliedFilters(filters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: undefined,
      dateTo: undefined,
    });
    setAppliedFilters({
      dateFrom: undefined,
      dateTo: undefined,
    });
  };

  // Calculate stats
  const totalRevenue = payments
    .filter((p) => ['completed', 'deposit_paid'].includes(p.status))
    .reduce((sum, p) => sum + p.amount, 0);
  // const successfulPayments = payments.filter((p) => p.status === 'completed').length;
  // const pendingPayments = payments.filter((p) => p.status === 'pending').length;
  // const refundedAmount = payments
  //   .filter((p) => p.status === 'refunded')
  //   .reduce((sum, p) => sum + p.amount, 0);


  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='text-lg'>{t('common.loading', 'Loading...')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>{t('payments.title', 'Payments Management')}</h2>
          <p className='text-muted-foreground'>
            {t('payments.subtitle', 'Track transactions and manage refunds')}
          </p>
        </div>
        {/* <Button onClick={() => navigate(webRoutes.payments.add)}>
          {t('payments.addNew', 'Add New Payment')}
        </Button> */}
      </div>

      {/* Filters */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <Button variant='outline' onClick={() => setShowFilters(!showFilters)}>
            <CalendarIcon className='mr-2 h-4 w-4' />
            {t('payments.filters', 'Filters')}
            {(appliedFilters.dateFrom || appliedFilters.dateTo) && (
              <span className='ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground'>
                Active
              </span>
            )}
          </Button>
          {(appliedFilters.dateFrom || appliedFilters.dateTo) && (
            <Button variant='ghost' onClick={clearFilters} className='gap-2'>
              <X className='h-4 w-4' />
              {t('payments.clearFilters', 'Clear')}
            </Button>
          )}
        </div>

        {showFilters && (
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>{t('payments.filterByDate', 'Filter by Date Range')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='dateFrom'>{t('payments.dateFrom', 'Date From')}</Label>
                  <Input
                    id='dateFrom'
                    type='date'
                    value={filters.dateFrom ? format(filters.dateFrom, 'yyyy-MM-dd') : ''}
                    onChange={(e) => {
                      const newFilters = {
                        ...filters,
                        dateFrom: e.target.value ? new Date(e.target.value) : undefined,
                      };
                      setFilters(newFilters);
                    }}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='dateTo'>{t('payments.dateTo', 'Date To')}</Label>
                  <Input
                    id='dateTo'
                    type='date'
                    value={filters.dateTo ? format(filters.dateTo, 'yyyy-MM-dd') : ''}
                    onChange={(e) => {
                      const newFilters = {
                        ...filters,
                        dateTo: e.target.value ? new Date(e.target.value) : undefined,
                      };
                      setFilters(newFilters);
                    }}
                  />
                </div>
              </div>
              <div className='mt-4 flex justify-end gap-2'>
                <Button variant='outline' onClick={() => setShowFilters(false)}>
                  {t('common.cancel', 'Cancel')}
                </Button>
                <Button onClick={applyFilters}>
                  {t('payments.applyFilters', 'Apply Filters')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('payments.totalRevenue', 'Total Revenue')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('payments.successfulPayments', 'Successful')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{successfulPayments}</div>
          </CardContent>
        </Card> */}
        {/* <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('payments.pendingPayments', 'Pending')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{pendingPayments}</div>
          </CardContent>
        </Card> */}
        {/* <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('payments.refundedAmount', 'Refunded')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>€{refundedAmount.toFixed(2)}</div>
          </CardContent>
        </Card> */}
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('payments.paymentsList', 'Payments List')}</CardTitle>
          <CardDescription>{t('payments.paymentsListDesc', 'View all payment transactions')}</CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentsDataTable columns={columns} data={payments} />
        </CardContent>
      </Card>

      {/* Refund Dialog */}
      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>{t('payments.refundTitle', 'Process Refund')}</DialogTitle>
            <DialogDescription>
              {t('payments.refundDescription', 'Enter the refund amount and reason below.')}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='amount'>{t('payments.refundAmount', 'Refund Amount (€)')}</Label>
              <Input
                id='amount'
                type='number'
                step='0.01'
                value={refundData.amount}
                onChange={(e) => setRefundData({ ...refundData, amount: parseFloat(e.target.value) })}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='reason'>{t('payments.refundReason', 'Refund Reason')}</Label>
              <Textarea
                id='reason'
                value={refundData.reason}
                onChange={(e) => setRefundData({ ...refundData, reason: e.target.value })}
                placeholder={t('payments.refundReasonPlaceholder', 'Explain why this refund is being processed...')}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsRefundDialogOpen(false)}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button onClick={handleProcessRefund} disabled={refundMutation.isPending || !refundData.reason}>
              {refundMutation.isPending ? t('common.processing', 'Processing...') : t('payments.processRefund', 'Process Refund')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
