import { GetSubscriptionColumns, Subscription } from './columns';
import { SubscriptionsDataTable } from './data-table';
import { useEffect, useMemo, useState } from 'react';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { webRoutes } from '@/routes/web';
import { useTranslation } from 'react-i18next';
import { setPageTitle } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconTicket, IconAlertCircle, IconCurrencyEuro, IconChartBar } from '@tabler/icons-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface SubscriptionStats {
  total_active: number;
  expiring_soon: number;
  monthly_revenue: number;
  average_sessions: number;
}

export default function SubscriptionsIndex() {
  const { t } = useTranslation();
  const [data, setData] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats>({
    total_active: 0,
    expiring_soon: 0,
    monthly_revenue: 0,
    average_sessions: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  const [extendDialog, setExtendDialog] = useState<{ open: boolean; subscription: Subscription | null }>({
    open: false,
    subscription: null,
  });
  const [extendDays, setExtendDays] = useState('30');
  
  const [sessionsDialog, setSessionsDialog] = useState<{ open: boolean; subscription: Subscription | null }>({
    open: false,
    subscription: null,
  });
  const [bonusSessions, setBonusSessions] = useState('');

  useEffect(() => {
    setPageTitle(t('subscriptions.title', 'Subscriptions Management'));
    fetchSubscriptions();
  }, [t]);

  const fetchSubscriptions = () => {
    setLoading(true);
    http
      .get(apiRoutes.adminSubscriptions)
      .then((res) => {
        setData(res.data.subscriptions || res.data);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: t('subscriptions.fetchError', 'Failed to fetch subscriptions'),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleView = (subscription: Subscription) => {
    navigate(webRoutes.subscriptions.view.replace(':id', subscription.id.toString()));
  };

  const handleEdit = (subscription: Subscription) => {
    navigate(webRoutes.subscriptions.edit.replace(':id', subscription.id.toString()));
  };

  const handleExtendOpen = (subscription: Subscription) => {
    setExtendDialog({ open: true, subscription });
    setExtendDays('30');
  };

  const handleExtendConfirm = () => {
    if (!extendDialog.subscription) return;

    http
      .put(apiRoutes.adminSubscriptionById(extendDialog.subscription.id), {
        extend_days: parseInt(extendDays),
      })
      .then(() => {
        toast({
          title: t('common.success'),
          description: t('subscriptions.extendSuccess', 'Subscription extended successfully'),
        });
        fetchSubscriptions();
        setExtendDialog({ open: false, subscription: null });
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: t('subscriptions.extendError', 'Failed to extend subscription'),
        });
      });
  };

  const handleAddSessionsOpen = (subscription: Subscription) => {
    setSessionsDialog({ open: true, subscription });
    setBonusSessions('');
  };

  const handleAddSessionsConfirm = () => {
    if (!sessionsDialog.subscription || !bonusSessions) return;

    http
      .put(apiRoutes.adminSubscriptionById(sessionsDialog.subscription.id), {
        add_sessions: parseInt(bonusSessions),
      })
      .then(() => {
        toast({
          title: t('common.success'),
          description: t('subscriptions.sessionsAdded', 'Bonus sessions added successfully'),
        });
        fetchSubscriptions();
        setSessionsDialog({ open: false, subscription: null });
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: t('subscriptions.sessionsError', 'Failed to add bonus sessions'),
        });
      });
  };

  const handleSuspend = (subscription: Subscription) => {
    http
      .post(apiRoutes.adminSubscriptionSuspend(subscription.id), {})
      .then(() => {
        toast({
          title: t('common.success'),
          description: t('subscriptions.suspendSuccess', 'Subscription suspended'),
        });
        fetchSubscriptions();
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: t('subscriptions.suspendError', 'Failed to suspend subscription'),
        });
      });
  };

  const columns = useMemo(
    () =>
      GetSubscriptionColumns({
        onView: handleView,
        onEdit: handleEdit,
        onExtend: handleExtendOpen,
        onAddSessions: handleAddSessionsOpen,
        onSuspend: handleSuspend,
      }),
    [t]
  );

  return (
    <>
      <div className='mb-4 flex w-full items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>{t('subscriptions.title', 'Subscriptions Management')}</h1>
          <p className='text-muted-foreground'>
            {t('subscriptions.subtitle', 'Track and manage subscription packages')}
          </p>
        </div>
        <Button onClick={() => navigate(webRoutes.subscriptions.add)}>
          {t('subscriptions.createManual', 'Create Manual Subscription')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              {t('subscriptions.totalActive', 'Active Subscriptions')}
            </CardTitle>
            <IconTicket className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.total_active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              {t('subscriptions.expiringSoon', 'Expiring Soon')}
            </CardTitle>
            <IconAlertCircle className='h-4 w-4 text-orange-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-orange-600'>{stats.expiring_soon}</div>
            <p className='text-xs text-muted-foreground'>Within 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              {t('subscriptions.monthlyRevenue', 'Monthly Revenue')}
            </CardTitle>
            <IconCurrencyEuro className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>€{stats.monthly_revenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              {t('subscriptions.averageSessions', 'Avg Sessions')}
            </CardTitle>
            <IconChartBar className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.average_sessions.toFixed(1)}</div>
            <p className='text-xs text-muted-foreground'>Per subscription</p>
          </CardContent>
        </Card>
      </div>

      <SubscriptionsDataTable columns={columns} data={data} loading={loading} />

      {/* Extend Expiry Dialog */}
      <Dialog open={extendDialog.open} onOpenChange={(open) => setExtendDialog({ open, subscription: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('subscriptions.extendTitle', 'Extend Subscription')}</DialogTitle>
            <DialogDescription>
              {t('subscriptions.extendDescription', 'Add extra days to the subscription expiry date.')}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='days'>{t('subscriptions.extendDays', 'Number of Days')}</Label>
              <Input
                id='days'
                type='number'
                placeholder='30'
                value={extendDays}
                onChange={(e) => setExtendDays(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setExtendDialog({ open: false, subscription: null })}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleExtendConfirm}>
              {t('subscriptions.confirmExtend', 'Extend Subscription')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Bonus Sessions Dialog */}
      <Dialog open={sessionsDialog.open} onOpenChange={(open) => setSessionsDialog({ open, subscription: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('subscriptions.addSessionsTitle', 'Add Bonus Sessions')}</DialogTitle>
            <DialogDescription>
              {t('subscriptions.addSessionsDescription', 'Add extra sessions to this subscription.')}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='sessions'>{t('subscriptions.bonusSessions', 'Number of Sessions')}</Label>
              <Input
                id='sessions'
                type='number'
                placeholder='5'
                value={bonusSessions}
                onChange={(e) => setBonusSessions(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setSessionsDialog({ open: false, subscription: null })}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleAddSessionsConfirm}>
              {t('subscriptions.confirmAddSessions', 'Add Sessions')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
