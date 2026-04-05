import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import http from '@/utils/http';
import { setPageTitle } from '@/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PlanService } from '@/interfaces/models/subscriptionPlan';



interface AdminSubscriptionPlan {
    id: number;
    service: PlanService | null;
    name: { fr: string; en: string; ar?: string };
    total_sessions: number;
    price: string;
    duration_days: number;
    max_members: number;
    is_active: boolean;
}

export default function AdminSubscriptionPlansIndex() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        setPageTitle(t('subscriptionPlansAdmin.title', 'Subscription plans'));
    }, [t]);

    const { data: plans = [], isLoading, refetch } = useQuery<AdminSubscriptionPlan[]>({
        queryKey: ['admin-subscription-plans'],
        queryFn: async () => {
            const response = await http.get(apiRoutes.adminSubscriptionPlans);
            const payload = response?.data?.data ?? response?.data;
            return Array.isArray(payload) ? payload : [];
        },
    });

    const toggleMutation = useMutation({
        mutationFn: (id: number) => http.post(apiRoutes.adminSubscriptionPlanToggleActive(id), {}),
        onSuccess: () => {
            toast.success(t('subscriptionPlansAdmin.toggled', 'Plan status updated'));
            refetch();
        },
        onError: () => {
            toast.error(t('subscriptionPlansAdmin.toggleError', 'Could not update plan status'));
        },
    });

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold'>{t('subscriptionPlansAdmin.title', 'Subscription plans')}</h1>
                    <p className='text-muted-foreground'>
                        {t('subscriptionPlansAdmin.subtitle', 'Manage all available plans')}
                    </p>
                </div>
                <Button onClick={() => navigate(webRoutes.subscriptionPlansAdmin.add)}>
                    {t('subscriptionPlansAdmin.add', 'Add plan')}
                </Button>
            </div>

            {isLoading ? (
                <p className='text-muted-foreground'>{t('common.loading', 'Loading...')}</p>
            ) : (
                <div className='grid gap-4'>
                    {plans.map((plan) => (
                        <Card key={plan.id}>
                            <CardHeader>
                                <CardTitle className='flex items-center justify-between gap-2'>
                                    <span>{plan.name?.fr || plan.name?.en}</span>
                                    <span className={`text-sm ${plan.is_active ? 'text-green-600' : 'text-muted-foreground'}`}>
                                        {plan.is_active ? t('subscriptionPlansAdmin.active', 'Active') : t('subscriptionPlansAdmin.inactive', 'Inactive')}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                                <div className='text-sm text-muted-foreground'>
                                    {plan.service?.name.fr || plan.service?.name.en || '-'} • {plan.total_sessions} {t('subscriptionPublic.sessions', 'Sessions')} • {plan.duration_days} {t('common.days', 'days')} • {plan.price} $
                                </div>
                                <div className='flex gap-2'>
                                    <Button variant='outline' size='sm' onClick={() => navigate(webRoutes.subscriptionPlansAdmin.view.replace(':id', String(plan.id)))}>
                                        {t('common.view', 'View')}
                                    </Button>
                                    <Button variant='outline' size='sm' onClick={() => navigate(webRoutes.subscriptionPlansAdmin.edit.replace(':id', String(plan.id)))}>
                                        {t('common.edit', 'Edit')}
                                    </Button>
                                    <Button variant='outline' size='sm' onClick={() => toggleMutation.mutate(plan.id)}>
                                        {t('subscriptionPlansAdmin.toggle', 'Toggle')}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
