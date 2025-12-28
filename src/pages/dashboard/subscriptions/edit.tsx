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
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

const subscriptionFormSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().optional(),
    total_sessions: z.number().min(1, 'Total sessions must be at least 1'),
    validity_days: z.number().min(1, 'Validity days must be at least 1'),
    price: z.number().min(0, 'Price must be positive'),
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
            return response.data;
        },
        enabled: !!id,
    });

    const form = useForm<SubscriptionFormValues>({
        resolver: zodResolver(subscriptionFormSchema),
        values: subscription
            ? {
                name: subscription.name || '',
                description: subscription.description || '',
                total_sessions: subscription.total_sessions || 10,
                validity_days: subscription.validity_days || 30,
                price: parseFloat(subscription.price) || 0,
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
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('subscriptions.name', 'Subscription Name')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t('subscriptions.namePlaceholder', 'e.g., Monthly Wellness Package')}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('subscriptions.description', 'Description')}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t('subscriptions.descriptionPlaceholder', 'Describe the subscription package')}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                                    name="validity_days"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('subscriptions.validityDays', 'Validity (Days)')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                {t('subscriptions.validityDaysDesc', 'Subscription duration')}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('subscriptions.price', 'Price (DH)')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    step="0.01"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                {t('subscriptions.priceDesc', 'Total package price')}
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
