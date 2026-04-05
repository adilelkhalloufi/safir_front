import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import http from '@/utils/http';
import { setPageTitle } from '@/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { SubscriptionPlan } from '@/interfaces/models/subscriptionPlan';

export default function AdminSubscriptionPlansEdit() {
    const { id } = useParams<{ id: string }>();
    const planId = Number(id || '0');
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [nameFr, setNameFr] = useState('');
    const [nameEn, setNameEn] = useState('');
    const [totalSessions, setTotalSessions] = useState('10');
    const [price, setPrice] = useState('0');
    const [durationDays, setDurationDays] = useState('365');
    const [maxMembers, setMaxMembers] = useState('1');

    useEffect(() => {
        setPageTitle(t('subscriptionPlansAdmin.edit', 'Edit plan'));
    }, [t]);

    const { data: plan, isLoading } = useQuery<SubscriptionPlan>({
        queryKey: ['admin-subscription-plan', planId],
        queryFn: async () => {
            const response = await http.get(apiRoutes.adminSubscriptionPlanById(planId));
            return response?.data?.data ?? response?.data;
        },
        enabled: planId > 0,
    });

    useEffect(() => {
        if (!plan) return;
        setNameFr(plan.name?.fr || '');
        setNameEn(plan.name?.en || '');
        setTotalSessions(String(plan.total_sessions || 10));
        setPrice(String(plan.price || 0));
        setDurationDays(String(plan.duration_days || 365));
        setMaxMembers(String(plan.max_members || 1));
    }, [plan]);

    const payload = useMemo(() => ({
        name_fr: nameFr,
        name_en: nameEn,
        total_sessions: Number(totalSessions),
        price: Number(price),
        duration_days: Number(durationDays),
        max_members: Number(maxMembers),
    }), [nameFr, nameEn, totalSessions, price, durationDays, maxMembers]);

    const updateMutation = useMutation({
        mutationFn: () => http.put(apiRoutes.adminSubscriptionPlanById(planId), payload),
        onSuccess: () => {
            toast.success(t('subscriptionPlansAdmin.updateSuccess', 'Plan updated successfully'));
            navigate(webRoutes.subscriptionPlansAdmin.index);
        },
        onError: () => {
            toast.error(t('subscriptionPlansAdmin.updateError', 'Could not update plan'));
        },
    });

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-bold'>{t('subscriptionPlansAdmin.edit', 'Edit plan')}</h1>
                <Button variant='outline' onClick={() => navigate(webRoutes.subscriptionPlansAdmin.index)}>
                    {t('common.cancel', 'Cancel')}
                </Button>
            </div>

            {isLoading ? (
                <p className='text-muted-foreground'>{t('common.loading', 'Loading...')}</p>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>{t('subscriptionPlansAdmin.planDetails', 'Plan details')}</CardTitle>
                    </CardHeader>
                    <CardContent className='grid gap-4 md:grid-cols-2'>
                        <div className='space-y-2'>
                            <Label>Name FR</Label>
                            <Input value={nameFr} onChange={(e) => setNameFr(e.target.value)} />
                        </div>
                        <div className='space-y-2'>
                            <Label>Name EN</Label>
                            <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
                        </div>

                        <div className='space-y-2'>
                            <Label>{t('subscriptionPublic.sessions', 'Sessions')}</Label>
                            <Input type='number' min={1} value={totalSessions} onChange={(e) => setTotalSessions(e.target.value)} />
                        </div>
                        <div className='space-y-2'>
                            <Label>{t('subscriptions.price', 'Price (DH)')}</Label>
                            <Input type='number' min={0} value={price} onChange={(e) => setPrice(e.target.value)} />
                        </div>

                        <div className='space-y-2'>
                            <Label>{t('subscriptionPublic.duration', 'Duration')}</Label>
                            <Input type='number' min={1} value={durationDays} onChange={(e) => setDurationDays(e.target.value)} />
                        </div>
                        <div className='space-y-2'>
                            <Label>{t('subscriptionPlansAdmin.maxMembers', 'Max members')}</Label>
                            <Input type='number' min={1} value={maxMembers} onChange={(e) => setMaxMembers(e.target.value)} />
                        </div>

                        <div className='md:col-span-2 flex justify-end'>
                            <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending || !nameFr || !nameEn}>
                                {t('common.save', 'Save')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
