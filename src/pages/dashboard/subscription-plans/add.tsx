import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import http from '@/utils/http';
import { setPageTitle } from '@/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ServiceOption {
    id: number;
    name: string;
}

export default function AdminSubscriptionPlansAdd() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [serviceId, setServiceId] = useState('');
    const [nameFr, setNameFr] = useState('');
    const [nameEn, setNameEn] = useState('');
    const [totalSessions, setTotalSessions] = useState('10');
    const [price, setPrice] = useState('0');
    const [durationDays, setDurationDays] = useState('365');
    const [maxMembers, setMaxMembers] = useState('1');

    useEffect(() => {
        setPageTitle(t('subscriptionPlansAdmin.add', 'Add plan'));
    }, [t]);

    const { data: services = [] } = useQuery<ServiceOption[]>({
        queryKey: ['services-options-for-plans'],
        queryFn: async () => {
            const response = await http.get(apiRoutes.adminServices);
            const payload = response?.data?.data ?? response?.data;
            const rows = Array.isArray(payload) ? payload : [];
            return rows.map((service: any) => ({
                id: service.id,
                name: typeof service.name === 'string' ? service.name : service.name?.fr || service.name?.en || `#${service.id}`,
            }));
        },
    });

    const createMutation = useMutation({
        mutationFn: () =>
            http.post(apiRoutes.adminSubscriptionPlans, {
                service_id: Number(serviceId),
                name_fr: nameFr,
                name_en: nameEn,
                description_fr: '',
                description_en: '',
                total_sessions: Number(totalSessions),
                price: Number(price),
                duration_days: Number(durationDays),
                max_members: Number(maxMembers),
                is_active: true,
                display_order: 1,
            }),
        onSuccess: () => {
            toast.success(t('subscriptionPlansAdmin.createSuccess', 'Plan created successfully'));
            navigate(webRoutes.subscriptionPlansAdmin.index);
        },
        onError: () => {
            toast.error(t('subscriptionPlansAdmin.createError', 'Could not create plan'));
        },
    });

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-bold'>{t('subscriptionPlansAdmin.add', 'Add plan')}</h1>
                <Button variant='outline' onClick={() => navigate(webRoutes.subscriptionPlansAdmin.index)}>
                    {t('common.cancel', 'Cancel')}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('subscriptionPlansAdmin.planDetails', 'Plan details')}</CardTitle>
                </CardHeader>
                <CardContent className='grid gap-4 md:grid-cols-2'>
                    <div className='space-y-2 md:col-span-2'>
                        <Label>{t('subscriptionPlansAdmin.service', 'Service')}</Label>
                        <select
                            className='w-full rounded-md border bg-background px-3 py-2'
                            value={serviceId}
                            onChange={(e) => setServiceId(e.target.value)}
                        >
                            <option value=''>{t('subscriptionPlansAdmin.selectService', 'Select service')}</option>
                            {services.map((service) => (
                                <option key={service.id} value={service.id}>{service.name}</option>
                            ))}
                        </select>
                    </div>

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
                        <Label>{t('subscriptions.price', 'Price')}</Label>
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
                        <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !serviceId || !nameFr || !nameEn}>
                            {t('subscriptionPlansAdmin.create', 'Create')}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
