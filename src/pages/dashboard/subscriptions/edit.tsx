import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { toast } from '@/components/ui/use-toast';
import { setPageTitle } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

const subscriptionFormSchema = z.object({
    total_sessions: z.number().min(1, 'Total sessions must be at least 1'),
    used_sessions: z.number().min(0, 'Used sessions must be zero or more'),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
});

type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;

export default function SubscriptionsEdit() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    useEffect(() => {
        setPageTitle(t('subscriptions.editTitle', 'Edit Subscription'));
    }, [t]);

    const { data: subscription, isLoading } = useQuery({
        queryKey: ['subscription', id],
        queryFn: async () => {
            const response = await http.get(apiRoutes.adminSubscriptionById(parseInt(id!)));
            return response.data?.data ?? response.data;
        },
        enabled: !!id,
    });

    const form = useForm<SubscriptionFormValues>({
        resolver: zodResolver(subscriptionFormSchema),
        values: subscription
            ? {
                total_sessions: subscription.total_sessions || 10,
                used_sessions: subscription.used_sessions ?? 0,
                start_date: subscription.start_date || '',
                end_date: subscription.end_date || '',
            }
            : undefined,
    });

    const updateSubscriptionMutation = useMutation({
        mutationFn: (data: SubscriptionFormValues) => http.put(apiRoutes.adminSubscriptionById(parseInt(id!)), data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
            queryClient.invalidateQueries({ queryKey: ['subscription', id] });
            toast({
                title: t('common.success', 'Success'),
                description: t('subscriptions.updateSuccess', 'Subscription updated successfully'),
            });
            navigate(webRoutes.subscriptions.index);
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: t('common.error', 'Error'),
                description: error?.message || t('subscriptions.updateError', 'Failed to update subscription'),
            });
        },
    });

    const onSubmit = (data: SubscriptionFormValues) => {
        updateSubscriptionMutation.mutate(data);
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{t('subscriptions.editTitle', 'Edit Subscription')}</h1>
                    <p className="text-muted-foreground">
                        {t('subscriptions.editSubtitle', 'Update subscription information')}
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate(webRoutes.subscriptions.index)}>
                    {t('common.cancel', 'Cancel')}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('subscriptions.subscriptionDetails', 'Subscription Details')}</CardTitle>
                    <CardDescription>
                        {t('subscriptions.subscriptionDetailsDesc', 'Update subscription package information')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {subscription?.user && (
                        <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4 mb-4">
                            <p className="text-sm font-medium text-muted-foreground">{t('subscriptions.client', 'Client')}</p>
                            <p className="text-base font-semibold">
                                {subscription.user.name || `${subscription.user.first_name || ''} ${subscription.user.last_name || ''}`.trim() || subscription.user.email}
                            </p>
                        </div>
                    )}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <FormField
                                    control={form.control}
                                    name="total_sessions"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('subscriptions.totalSessions', 'Total Sessions')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                {t('subscriptions.totalSessionsDesc', 'Number of sessions included')}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="used_sessions"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('subscriptions.usedSessions', 'Used Sessions')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                {t('subscriptions.usedSessionsDesc', 'Number of sessions already used')}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                    <FormField
                                    control={form.control}
                                    name="start_date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('subscriptions.startDate', 'Start Date')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                {t('subscriptions.startDateDesc', 'Subscription start date')}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="end_date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('subscriptions.endDate', 'End Date')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                {t('subscriptions.endDateDesc', 'Subscription end date')}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button type="button" variant="outline" onClick={() => navigate(webRoutes.subscriptions.index)}>
                                    {t('common.cancel', 'Cancel')}
                                </Button>
                                <Button type="submit" disabled={updateSubscriptionMutation.isPending}>
                                    {updateSubscriptionMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t('common.save', 'Save Changes')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
