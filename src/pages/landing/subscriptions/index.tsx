import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { defaultHttp } from '@/utils/http';
import { setPageTitle } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SubscriptionPlan } from '@/interfaces/models/subscriptionPlan';
import HeaderBooking from '../booking/HeaderBooking';



export default function SubscriptionPlansPage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [serviceFilter, setServiceFilter] = useState<number | 'all'>('all');

    useEffect(() => {
        setPageTitle(t('subscriptionPublic.title', 'Choose your subscription'));
    }, [t]);

    const { data: plans = [], isLoading } = useQuery<SubscriptionPlan[]>({
        queryKey: ['subscription-plans-public'],
        queryFn: async () => {
            const response = await defaultHttp.get(apiRoutes.subscriptionPlans);
            const payload = response?.data?.data ?? response?.data;
            return Array.isArray(payload) ? payload : [];
        },
    });

    const services = useMemo(() => {
        const map = new Map<number, string>();
        plans.forEach((plan) => {
            if (plan?.service?.id) {
                map.set(plan.service.id, plan.service.name[i18n.language as keyof typeof plan.service.name] || plan.service.name.en);
            }
        });
        return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
    }, [plans, i18n.language]);

    const visiblePlans = useMemo(() => {
        const activePlans = plans.filter((plan) => plan.is_active !== false);
        if (serviceFilter === 'all') return activePlans;
        return activePlans.filter((plan) => plan.service?.id === serviceFilter);
    }, [plans, serviceFilter]);

    const getPlanName = (plan: SubscriptionPlan) => {
        return i18n.language === 'fr' ? plan.name.fr : plan.name.en;
    };

    const getPlanDescription = (plan: SubscriptionPlan) => {
        return i18n.language === 'fr' ? plan.description.fr : plan.description.en;
    };

    const goToCheckout = (plan: SubscriptionPlan) => {
        const search = `?plan_id=${plan.id}&service_id=${plan.service?.id ?? ''}`;
        navigate(`${webRoutes.subscriptionCheckout}${search}`);
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-28 px-4'>
            <HeaderBooking />
            <div className='mx-auto max-w-7xl'>
                <div className='mb-8 text-center'>
                    <h1 className='text-4xl font-bold mb-2'>
                        {t('subscriptionPublic.title', 'Choose your subscription')}
                    </h1>
                    <p className='text-muted-foreground'>
                        {t('subscriptionPublic.subtitle', 'Pick a plan based on your favorite service')}
                    </p>
                </div>

                <div className='mb-6 flex flex-wrap gap-2'>
                    <Button
                        variant={serviceFilter === 'all' ? 'default' : 'outline'}
                        onClick={() => setServiceFilter('all')}
                    >
                        {t('common.all', 'All')}
                    </Button>
                    {services.map((service) => (
                        <Button
                            key={service.id}
                            variant={serviceFilter === service.id ? 'default' : 'outline'}
                            onClick={() => setServiceFilter(service.id)}
                        >
                            {service.name}
                        </Button>
                    ))}
                </div>

                {isLoading ? (
                    <div className='text-center text-muted-foreground'>{t('common.loading', 'Loading...')}</div>
                ) : (
                    <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
                        {visiblePlans.map((plan) => (
                            <Card key={plan.id} className='border-2 border-transparent hover:border-primary/30 transition-colors'>
                                <CardHeader>
                                    <div className='flex items-center justify-between gap-3'>
                                        <Badge variant='outline'>{plan.service?.name[i18n.language as keyof typeof plan.service.name] || plan.service?.name.en}</Badge>
                                        {plan.max_members > 1 && (
                                            <Badge>{t('subscriptionPublic.shared', 'Shared')}</Badge>
                                        )}
                                    </div>
                                    <CardTitle className='text-xl'>{getPlanName(plan)}</CardTitle>
                                </CardHeader>
                                <CardContent className='space-y-3'>
                                    <p className='text-muted-foreground min-h-10'>
                                        {getPlanDescription(plan) || t('subscriptionPublic.noDescription', 'No description')}
                                    </p>
                                    <div className='grid grid-cols-2 gap-3 text-sm'>
                                        <div className='rounded-md bg-muted p-3'>
                                            <div className='text-muted-foreground'>{t('subscriptionPublic.sessions', 'Sessions')}</div>
                                            <div className='font-semibold'>{plan.total_sessions}</div>
                                        </div>
                                        <div className='rounded-md bg-muted p-3'>
                                            <div className='text-muted-foreground'>{t('subscriptionPublic.duration', 'Duration')}</div>
                                            <div className='font-semibold'>
                                                {plan.duration_days} {t('common.days', 'days')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='text-3xl font-bold'>
                                        {plan.price} $

                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className='w-full' onClick={() => goToCheckout(plan)}>
                                        {t('subscriptionPublic.subscribe', 'Subscribe')}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
