import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import http from '@/utils/http';
import { setPageTitle } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import IconDisplay from '@/components/custom/IconDisplay';
import SubscriptionBookingDialog from './SubscriptionBookingDialog';
import SubscriptionDetailsDialog from './SubscriptionDetailsDialog';

interface ServiceType {
    id: number;
    name: {
        en: string;
        fr: string;
    };
    color: string;
    is_active: boolean;
    icon: string;
    display_order: number;
    allows_multiple_services: boolean;
}

interface Service {
    id: number;
    type: ServiceType;
    name: {
        fr: string;
        en: string;
    };
    description: {
        fr: string | null;
        en: string | null;
    };
    duration_minutes: number;
    buffer_minutes: number;
    requires_health_form: boolean;
    has_sessions: boolean;
    price: number;
    is_price_starting_from: boolean;
    health_questions: any;
    is_active: boolean;
    quantity: number;
    has_tax: number;
    minimum_booking_deposit: number;
}

interface SubscriptionPlan {
    id: number;
    service_id: number;
    service: Service;
    name: {
        fr: string;
        en: string;
    };
    description: {
        fr: string;
        en: string;
    };
    total_sessions: number;
    price: number;
    duration_days: number;
    max_members: number;
    is_active: boolean;
    display_order: number;
}

interface ClientSubscription {
    id: number;
    user_id: number;
    subscription_plan: SubscriptionPlan;
    name: string | null;
    description: string | null;
    total_sessions: number;
    used_sessions: number;
    remaining_sessions: number | null;
    price_paid: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export default function ClientSubscriptionsPage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [bookingDialog, setBookingDialog] = useState<{
        open: boolean;
        serviceId: number;
        serviceName: string;
        subscriptionId: number;
    }>({ open: false, serviceId: 0, serviceName: '', subscriptionId: 0 });
    const [detailsDialog, setDetailsDialog] = useState<{
        open: boolean;
        subscriptionId: number;
        subscriptionName: string;
    }>({ open: false, subscriptionId: 0, subscriptionName: '' });

    useEffect(() => {
        setPageTitle(t('clientSubscriptions.title', 'My subscriptions'));
    }, [t]);

    const { data: subscriptions = [], isLoading, refetch } = useQuery<ClientSubscription[]>({
        queryKey: ['client-subscriptions'],
        queryFn: async () => {
            const response = await http.get(apiRoutes.subscriptions);
            const payload = response?.data?.data ?? response?.data;
            return Array.isArray(payload) ? payload : [];
        },
    });

    const getPlanName = (subscription: ClientSubscription) => {
        const lang = i18n.language as 'en' | 'fr';
        return subscription.name || subscription.subscription_plan?.name[lang] || subscription.subscription_plan?.name.en || '';
    };

    const getServiceName = (subscription: ClientSubscription) => {
        const lang = i18n.language as 'en' | 'fr';
        return subscription.subscription_plan?.service?.name[lang] || subscription.subscription_plan?.service?.name.en || '';
    };

    const getRemainingSessionsCount = (subscription: ClientSubscription) => {
        if (subscription.remaining_sessions !== null) {
            return subscription.remaining_sessions;
        }
        return subscription.total_sessions - subscription.used_sessions;
    };

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold'>{t('clientSubscriptions.title', 'My subscriptions')}</h1>
                    <p className='text-muted-foreground'>
                        {t('clientSubscriptions.subtitle', 'Track sessions and manage shared members')}
                    </p>
                </div>
            
            </div>

            {isLoading ? (
                <p className='text-muted-foreground'>{t('common.loading', 'Loading...')}</p>
            ) : subscriptions.length === 0 ? (
                <Card>
                    <CardContent className='pt-6 text-muted-foreground'>
                        {t('clientSubscriptions.empty', 'No subscriptions yet. Choose a plan to get started.')}
                    </CardContent>
                </Card>
            ) : (
                <div className='grid gap-4 md:grid-cols-2'>
                    {subscriptions.map((subscription) => {
                        const remainingSessions = getRemainingSessionsCount(subscription);
                        const usage = subscription.total_sessions > 0
                            ? (subscription.used_sessions / subscription.total_sessions) * 100
                            : 0;

                        return (
                            <Card key={subscription.id}>
                                <CardHeader>
                                    <CardTitle className='flex items-start justify-between gap-2'>
                                        <div className='flex items-start gap-3'>
                                            {subscription.subscription_plan?.service?.type?.icon && (
                                                <div 
                                                    className='flex h-10 w-10 items-center justify-center rounded-lg'
                                                    style={{ backgroundColor: subscription.subscription_plan.service.type.color + '20' }}
                                                >
                                                    <IconDisplay 
                                                        iconName={subscription.subscription_plan.service.type.icon} 
                                                        size={20}
                                                        color={subscription.subscription_plan.service.type.color}
                                                    />
                                                </div>
                                            )}
                                            <div className='space-y-1'>
                                                <div>{getPlanName(subscription)}</div>
                                                <div className='text-sm font-normal text-muted-foreground'>
                                                    {getServiceName(subscription)}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant={subscription.is_active ? 'default' : 'secondary'}>
                                            {subscription.is_active
                                                ? t('clientSubscriptions.active', 'Active')
                                                : t('clientSubscriptions.inactive', 'Inactive')}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <div>
                                        <div className='mb-2 flex items-center justify-between text-sm'>
                                            <span className='text-muted-foreground'>
                                                {remainingSessions} / {subscription.total_sessions} {t('clientSubscriptions.sessionsLeft', 'sessions left')}
                                            </span>
                                            <span className='font-medium'>
                                                {subscription.used_sessions} {t('clientSubscriptions.used', 'used')}
                                            </span>
                                        </div>
                                        <Progress value={usage} className='h-2' />
                                    </div>

                                    <div className='flex items-center justify-between text-sm'>
                                        <span className='text-muted-foreground'>
                                            {t('clientSubscriptions.price', 'Price paid')}:
                                        </span>
                                        <span className='font-medium'>{subscription.price_paid} $</span>
                                    </div>

                                    <div className='flex items-center justify-between text-sm'>
                                        <span className='text-muted-foreground'>
                                            {t('clientSubscriptions.startDate', 'Start date')}:
                                        </span>
                                        <span>{subscription.start_date ? format(new Date(subscription.start_date), 'PP') : '-'}</span>
                                    </div>

                                    <div className='flex items-center justify-between text-sm'>
                                        <span className='text-muted-foreground'>
                                            {t('clientSubscriptions.expires', 'Expires')}:
                                        </span>
                                        <span>{subscription.end_date ? format(new Date(subscription.end_date), 'PP') : '-'}</span>
                                    </div>

                                    {subscription.subscription_plan?.max_members && subscription.subscription_plan.max_members > 1 && (
                                        <Button
                                            variant='outline'
                                            className='w-full'
                                            onClick={() => navigate(webRoutes.client.subscriptionMembers.replace(':id', String(subscription.id)))}
                                        >
                                            {t('clientSubscriptions.manageMembers', 'Manage members')} ({subscription.subscription_plan.max_members} {t('clientSubscriptions.maxMembers', 'max')})
                                        </Button>
                                    )}

                                    <Button
                                        variant='outline'
                                        className='w-full'
                                        onClick={() => {
                                            setDetailsDialog({
                                                open: true,
                                                subscriptionId: subscription.id,
                                                subscriptionName: getPlanName(subscription),
                                            });
                                        }}
                                    >
                                        {t('clientSubscriptions.viewDetails', 'View bookings')}
                                    </Button>

                                    {subscription.is_active && remainingSessions > 0 && (
                                        <Button
                                            className='w-full'
                                            onClick={() => {
                                                const lang = i18n.language as 'en' | 'fr';
                                                setBookingDialog({
                                                    open: true,
                                                    serviceId: subscription.subscription_plan.service.id,
                                                    serviceName: subscription.subscription_plan.service.name[lang] || subscription.subscription_plan.service.name.en,
                                                    subscriptionId: subscription.id,
                                                });
                                            }}
                                        >
                                            {t('clientSubscriptions.bookSession', 'Book a session')}
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            <SubscriptionBookingDialog
                open={bookingDialog.open}
                onOpenChange={(open) => setBookingDialog((prev) => ({ ...prev, open }))}
                serviceId={bookingDialog.serviceId}
                serviceName={bookingDialog.serviceName}
                subscriptionId={bookingDialog.subscriptionId}
            />

            <SubscriptionDetailsDialog
                open={detailsDialog.open}
                onOpenChange={(open) => setDetailsDialog((prev) => ({ ...prev, open }))}
                subscriptionId={detailsDialog.subscriptionId}
                subscriptionName={detailsDialog.subscriptionName}
            />
        </div>
    );
}
