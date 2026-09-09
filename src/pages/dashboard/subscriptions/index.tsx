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
import { Combobox } from '@/components/ui/combobox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard as SquareCreditCard, PaymentForm } from 'react-square-web-payments-sdk';
import { Loader2, Lock, Shield } from 'lucide-react';

interface ClientOption {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

interface SubscriptionPlanOption {
  id: number;
  name: string | { fr?: string; en?: string };
  price?: number;
  duration_days?: number;
  total_sessions?: number;
}

interface SubscriptionStats {
  total_active: number;
  expiring_soon: number;
  monthly_revenue: number;
  average_sessions: number;
}

export default function SubscriptionsIndex() {
  const { t } = useTranslation();
  const [data, setData] = useState<Subscription[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlanOption[]>([]);
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
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false);
  const [clientMode, setClientMode] = useState<'existing' | 'new'>('existing');
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'espace'>('espace');
  const [paymentAmount, setPaymentAmount] = useState('0');
  const [newClient, setNewClient] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [cardHolderName, setCardHolderName] = useState('');
  const [paymentFormKey, setPaymentFormKey] = useState(0);

  const squareApplicationId = import.meta.env.VITE_SQUARE_APP_ID;
  const squareLocationId = import.meta.env.VITE_SQUARE_LOCATION_ID;
  const squareConfigured = Boolean(squareApplicationId && squareLocationId);

  useEffect(() => {
    setPageTitle(t('subscriptions.title', 'Subscriptions Management'));
    fetchSubscriptions();
    fetchClients();
    fetchPlans();
  }, [t]);

  const fetchClients = () => {
    http
      .get(apiRoutes.adminClients)
      .then((res) => {
        const payload = res.data?.data ?? res.data?.clients ?? res.data;
        setClients(Array.isArray(payload) ? payload : []);
      })
      .catch(() => {
        setClients([]);
      });
  };

  const fetchPlans = () => {
    http
      .get(apiRoutes.adminSubscriptionPlans)
      .then((res) => {
        const payload = res.data?.data ?? res.data?.plans ?? res.data;
        setPlans(Array.isArray(payload) ? payload : []);
      })
      .catch(() => {
        setPlans([]);
      });
  };

  const fetchSubscriptions = () => {
    setLoading(true);
    http
      .get(apiRoutes.adminSubscriptions)
      .then((res) => {
        const payload = res.data?.data ?? res.data?.subscriptions ?? res.data;
        setData(Array.isArray(payload) ? payload : []);
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

  const selectedPlan = useMemo(() => plans.find((plan) => plan.id === selectedPlanId) ?? null, [plans, selectedPlanId]);

  useEffect(() => {
    if (selectedPlan?.price !== undefined && selectedPlan?.price !== null) {
      setPaymentAmount(String(selectedPlan.price));
    }
  }, [selectedPlan]);

  const resetCreateDialog = () => {
    setClientMode('existing');
    setSelectedClientId(null);
    setSelectedPlanId(null);
    setPaymentMethod('espace');
    setPaymentAmount('0');
    setNewClient({ first_name: '', last_name: '', email: '', phone: '', address: '' });
    setCardHolderName('');
    setPaymentFormKey((prev) => prev + 1);
  };

  const openCreateDialog = () => {
    resetCreateDialog();
    setCreateDialogOpen(true);
  };

  const closeCreateDialog = () => {
    setCreateDialogOpen(false);
    resetCreateDialog();
  };

  const validateNewClient = () => {
    if (!newClient.first_name || !newClient.last_name || !newClient.email || !newClient.phone) {
      toast({
        variant: 'destructive',
        title: t('common.error', 'Error'),
        description: t('subscriptions.newClientRequired', 'Please fill all required new client fields.'),
      });
      return false;
    }
    return true;
  };

  const validateCardData = () => {
    if (!cardHolderName.trim()) {
      toast({
        variant: 'destructive',
        title: t('common.error', 'Error'),
        description: t('subscriptionCheckout.cardHolderRequired', 'Please enter the card holder name.'),
      });
      return false;
    }
    return true;
  };

  const handleCreateSubscription = async (cardPayment?: { source_id: string; verification_token?: string }) => {
    if (!selectedPlanId) {
      toast({
        variant: 'destructive',
        title: t('common.error', 'Error'),
        description: t('subscriptions.planRequired', 'Please select a subscription plan.'),
      });
      return;
    }

    if (clientMode === 'existing' && !selectedClientId) {
      toast({
        variant: 'destructive',
        title: t('common.error', 'Error'),
        description: t('subscriptions.clientRequired', 'Please select an existing client.'),
      });
      return;
    }

    if (clientMode === 'new' && !validateNewClient()) {
      return;
    }

    const amountValue = Number(paymentAmount);
    if (Number.isNaN(amountValue) || amountValue < 0) {
      toast({
        variant: 'destructive',
        title: t('common.error', 'Error'),
        description: t('subscriptions.invalidAmount', 'Please enter a valid payment amount.'),
      });
      return;
    }

    if (paymentMethod === 'card' && !validateCardData()) {
      return;
    }

    if (paymentMethod === 'card' && !cardPayment?.source_id) {
      toast({
        variant: 'destructive',
        title: t('common.error', 'Error'),
        description: t('subscriptions.cardProcessDesc', 'Enter card details and process payment before creating the subscription.'),
      });
      return;
    }

    setIsCreatingSubscription(true);
    try {
      let clientId = selectedClientId;

      if (clientMode === 'new') {
        const generatedPassword = `Sub@${Date.now()}`;
        const createClientRes = await http.post(apiRoutes.register, {
          ...newClient,
          password: generatedPassword,
        });
        const createdClient =
          createClientRes.data?.data?.user ?? createClientRes.data?.user ?? createClientRes.data?.data ?? createClientRes.data;
        clientId = createdClient?.id ?? null;

        if (!clientId) {
          throw new Error(t('subscriptions.clientCreateFailed', 'Client created but id was not returned.'));
        }
      }

      await http.post(apiRoutes.adminSubscriptions, {
        user_id: clientId,
        subscription_plan_id: selectedPlanId,
        price_paid: amountValue,
        payment_method: paymentMethod,
        payment: {
          type: paymentMethod,
          amount: amountValue,
          ...(paymentMethod === 'card'
            ? {
                source_id: cardPayment?.source_id,
                card_holder: cardHolderName.trim(),
                verification_token: cardPayment?.verification_token,
              }
            : {}),
        },
      });

      toast({
        title: t('common.success', 'Success'),
        description: t('subscriptions.createManualSuccess', 'Subscription created successfully.'),
      });
      closeCreateDialog();
      fetchSubscriptions();
      fetchClients();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('common.error', 'Error'),
        description: error?.response?.data?.message || error?.message || t('subscriptions.createError', 'Failed to create subscription'),
      });
    } finally {
      setIsCreatingSubscription(false);
    }
  };

  return (
    <>
      <div className='mb-4 flex w-full items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>{t('subscriptions.title', 'Subscriptions Management')}</h1>
          <p className='text-muted-foreground'>
            {t('subscriptions.subtitle', 'Track and manage subscription packages')}
          </p>
        </div>
        <Button onClick={openCreateDialog}>{t('subscriptions.createManual', 'Create Manual Subscription')}</Button>
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

      <Dialog open={createDialogOpen} onOpenChange={(open) => (open ? setCreateDialogOpen(true) : closeCreateDialog())}>
        <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>{t('subscriptions.createManual', 'Create Manual Subscription')}</DialogTitle>
            <DialogDescription>
              {t('subscriptions.createManualDesc', 'Create for an existing client or a new client, then choose payment method.')}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-5 py-1'>
            <div className='space-y-2'>
              <Label>{t('subscriptions.clientType', 'Client Type')}</Label>
              <div className='grid grid-cols-2 gap-2'>
                <Button
                  type='button'
                  variant={clientMode === 'existing' ? 'default' : 'outline'}
                  onClick={() => setClientMode('existing')}
                >
                  {t('subscriptions.existingClient', 'Existing Client')}
                </Button>
                <Button
                  type='button'
                  variant={clientMode === 'new' ? 'default' : 'outline'}
                  onClick={() => setClientMode('new')}
                >
                  {t('subscriptions.newClient', 'New Client')}
                </Button>
              </div>
            </div>

            {clientMode === 'existing' ? (
              <div className='space-y-2'>
                <Label>{t('subscriptions.selectClient', 'Select Client')}</Label>
                <Combobox
                  data={clients.map((client) => ({
                    value: client.id,
                    name: `${client.name} (${client.email})`,
                  }))}
                  placeholder={t('subscriptions.selectClientPlaceholder', 'Choose a client')}
                  emptyMessage={t('common.noResults', 'No results found')}
                  onSelectionChange={(value) => setSelectedClientId(value ? Number(value) : null)}
                  defaultValue={selectedClientId || ''}
                />
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label>{t('common.firstName', 'First Name')}</Label>
                  <Input
                    value={newClient.first_name}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, first_name: e.target.value }))}
                  />
                </div>
                <div className='space-y-2'>
                  <Label>{t('common.lastName', 'Last Name')}</Label>
                  <Input
                    value={newClient.last_name}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, last_name: e.target.value }))}
                  />
                </div>
                <div className='space-y-2'>
                  <Label>{t('common.email', 'Email')}</Label>
                  <Input
                    type='email'
                    value={newClient.email}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className='space-y-2'>
                  <Label>{t('common.phone', 'Phone')}</Label>
                  <Input
                    value={newClient.phone}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className='space-y-2 md:col-span-2'>
                  <Label>{t('common.address', 'Address')}</Label>
                  <Input
                    value={newClient.address}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, address: e.target.value }))}
                  />
                </div>
              </div>
            )}

            <div className='space-y-2'>
              <Label>{t('subscriptions.plan', 'Subscription Plan')}</Label>
              <Combobox
                data={plans.map((plan) => ({
                  value: plan.id,
                  name: `${typeof plan.name === 'string' ? plan.name : plan.name?.fr || plan.name?.en || ''}${plan.price ? ` - ${plan.price} DH` : ''}`,
                }))}
                placeholder={t('subscriptions.selectPlanPlaceholder', 'Choose a subscription plan')}
                emptyMessage={t('common.noResults', 'No results found')}
                onSelectionChange={(value) => setSelectedPlanId(value ? Number(value) : null)}
                defaultValue={selectedPlanId || ''}
              />
            </div>

            <div className='space-y-2'>
              <Label>{t('subscriptions.paymentMethod', 'Payment Method')}</Label>
              <div className='grid grid-cols-2 gap-2'>
                <Button
                  type='button'
                  variant={paymentMethod === 'espace' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('espace')}
                >
                  {t('subscriptions.espacePayment', 'Espace')}
                </Button>
                <Button
                  type='button'
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('card')}
                >
                  {t('subscriptions.cardPayment', 'Card')}
                </Button>
              </div>
            </div>

            <div className='space-y-2'>
              <Label>{t('subscriptions.paymentAmount', 'Payment Amount')}</Label>
              <Input
                type='number'
                min='0'
                step='0.01'
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>

            {paymentMethod === 'card' && (
              <div className='rounded-lg border p-4 space-y-3 bg-muted/20'>
                <p className='text-sm font-semibold'>
                  {t('subscriptions.cardProcessTitle', 'Card Payment Process')}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {t('subscriptions.cardProcessDesc', 'Enter card details and process payment before creating the subscription.')}
                </p>
                <div className='space-y-2'>
                  <Label>{t('subscriptionCheckout.cardHolder', 'Card holder name')}</Label>
                  <Input
                    placeholder={t('subscriptionCheckout.cardHolderPlaceholder', 'Name on card')}
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                  />
                </div>

                {squareConfigured ? (
                  <PaymentForm
                    key={paymentFormKey}
                    applicationId={squareApplicationId!}
                    locationId={squareLocationId!}
                    cardTokenizeResponseReceived={(tokenResult: any, verifiedBuyer?: any) => {
                      if (!paymentAmount || Number(paymentAmount) <= 0) {
                        toast({
                          variant: 'destructive',
                          title: t('common.error', 'Error'),
                          description: t('payments.amountRequired', 'Please enter a valid payment amount'),
                        });
                        return;
                      }

                      if (!cardHolderName.trim()) {
                        toast({
                          variant: 'destructive',
                          title: t('common.error', 'Error'),
                          description: t('subscriptionCheckout.cardHolderRequired', 'Please enter the card holder name.'),
                        });
                        return;
                      }

                      if (tokenResult?.status !== 'OK' || !tokenResult?.token) {
                        const errorMessages = tokenResult?.errors?.map((error: any) => error.message).filter(Boolean) || [];
                        const errorString = errorMessages.join(', ').toLowerCase();
                        const isSessionExpired =
                          errorString.includes('expired') || errorString.includes('session') || errorString.includes('timeout');

                        if (isSessionExpired) {
                          toast({
                            variant: 'destructive',
                            title: t('common.error', 'Error'),
                            description: t(
                              'bookingWizard.payment.sessionExpired',
                              'Your payment session has expired. Please enter your card details again.'
                            ),
                          });
                          setPaymentFormKey((prev) => prev + 1);
                        } else {
                          toast({
                            variant: 'destructive',
                            title: t('common.error', 'Error'),
                            description: errorMessages.join(', ') || t('subscriptionCheckout.cardError', 'Card processing error'),
                          });
                        }
                        return;
                      }

                      handleCreateSubscription({
                        source_id: tokenResult.token,
                        verification_token: verifiedBuyer?.token,
                      });
                    }}
                    createVerificationDetails={() => {
                      const existingClient = clients.find((client) => client.id === selectedClientId);
                      const fallbackName = (
                        cardHolderName ||
                        existingClient?.name ||
                        `${newClient.first_name} ${newClient.last_name}`.trim() ||
                        'Guest User'
                      ).trim();
                      const [givenName, ...familyNameParts] = fallbackName.split(' ');

                      return {
                        amount: String(paymentAmount),
                        currencyCode: import.meta.env.VITE_SQUARE_CURRENCY || 'CAD',
                        intent: 'CHARGE',
                        billingContact: {
                          givenName,
                          familyName: familyNameParts.join(' ') || givenName,
                          email: existingClient?.email || newClient.email || '',
                          phone: existingClient?.phone || newClient.phone || '',
                          countryCode: 'CA',
                        },
                      };
                    }}
                  >
                    <SquareCreditCard
                      buttonProps={{
                        isLoading: isCreatingSubscription,
                        className: 'mt-4 w-full h-11 rounded-lg bg-amber-600 text-white hover:bg-amber-700',
                      }}
                      className='w-full rounded-2xl border border-slate-200 bg-slate-50 p-4'
                    >
                      {isCreatingSubscription ? (
                        <>
                          <Loader2 className='mr-2 inline h-4 w-4 animate-spin' />
                          {t('bookingWizard.review.confirming', 'Confirming...')}
                        </>
                      ) : (
                        <>
                          <Lock className='mr-2 inline h-4 w-4' />
                          {t('bookings.payWithCard', 'Pay with card')}
                        </>
                      )}
                    </SquareCreditCard>
                  </PaymentForm>
                ) : (
                  <Alert>
                    <AlertDescription className='text-sm'>
                      Add `VITE_SQUARE_APP_ID` and `VITE_SQUARE_LOCATION_ID` to your Vite env to enable card payments.
                    </AlertDescription>
                  </Alert>
                )}

                <div className='flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800'>
                  <Shield className='h-4 w-4 shrink-0' />
                  {t('bookingWizard.guarantee.securedBy', 'Secured payment by Square')}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={closeCreateDialog} disabled={isCreatingSubscription}>
              {t('common.cancel', 'Cancel')}
            </Button>
            {paymentMethod !== 'card' && (
              <Button onClick={() => handleCreateSubscription()} disabled={isCreatingSubscription}>
                {isCreatingSubscription
                  ? t('common.loading', 'Loading...')
                  : t('subscriptions.confirmCreateManual', 'Create Subscription')}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
