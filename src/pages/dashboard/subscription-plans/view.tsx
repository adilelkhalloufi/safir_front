import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import http from '@/utils/http';
import { setPageTitle } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { SubscriptionPlan } from '@/interfaces/models/subscriptionPlan';

export default function AdminSubscriptionPlansView() {
    const { id } = useParams<{ id: string }>();
    const planId = Number(id || '0');
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        setPageTitle(t('subscriptionPlansAdmin.view', 'Plan details'));
    }, [t]);

    const { data: plan, isLoading } = useQuery<SubscriptionPlan>({
        queryKey: ['admin-subscription-plan-view', planId],
        queryFn: async () => {
            const response = await http.get(apiRoutes.adminSubscriptionPlanById(planId));
            return response?.data?.data ?? response?.data;
        },
        enabled: planId > 0,
    });

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-bold'>{t('subscriptionPlansAdmin.view', 'Plan details')}</h1>
                <Button variant='outline' onClick={() => navigate(webRoutes.subscriptionPlansAdmin.index)}>
                    {t('common.backToList', 'Back to list')}
                </Button>
            </div>

            {isLoading ? (
                <p className='text-muted-foreground'>{t('common.loading', 'Loading...')}</p>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center justify-between'>
                            <span>{plan?.name.fr || plan?.name.en || '-'}</span>
                            <Badge variant={plan?.is_active ? 'default' : 'secondary'}>
                                {plan?.is_active ? t('subscriptionPlansAdmin.active', 'Active') : t('subscriptionPlansAdmin.inactive', 'Inactive')}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-3 text-sm'>
                        <div><strong>ID:</strong> {plan?.id}</div>
                        <div><strong>{t('subscriptionPlansAdmin.service', 'Service')}:
                        </strong> {plan?.service?.name.fr || plan?.service?.name.en || '-'}</div>
                        <div><strong>Name FR:</strong> {plan?.name.fr || '-'}</div>
                        <div><strong>Name EN:</strong> {plan?.name.en || '-'}</div>
                        <div><strong>{t('subscriptionPublic.sessions', 'Sessions')}:</strong> {plan?.total_sessions}</div>
                        <div><strong>{t('subscriptions.price', 'Price (DH)')}:</strong> {plan?.price} DH</div>
                        <div><strong>{t('subscriptionPublic.duration', 'Duration')}:</strong> {plan?.duration_days} {t('common.days', 'days')}</div>
                        <div><strong>{t('subscriptionPlansAdmin.maxMembers', 'Max members')}:</strong> {plan?.max_members}</div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
