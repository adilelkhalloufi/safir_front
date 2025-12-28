import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import type { Service } from '@/interfaces/models';
import { toast } from '@/components/ui/use-toast';
import { setPageTitle } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

const subscriptionFormSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().optional(),
    total_sessions: z.number().min(1, 'Total sessions must be at least 1'),
    validity_days: z.number().min(1, 'Validity days must be at least 1'),
    price: z.number().min(0, 'Price must be positive'),
    service_ids: z.array(z.number()).min(1, 'Select at least one service'),
});

type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;

export default function SubscriptionsAdd() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        setPageTitle(t('subscriptions.addTitle', 'Create New Subscription'));
    }, [t]);

    // Fetch services
    const { data: services = [] } = useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            const response = await http.get(apiRoutes.services);
            return response.data || [];
        },
    });

    const form = useForm<SubscriptionFormValues>({
        resolver: zodResolver(subscriptionFormSchema),
        defaultValues: {
            name: '',
            description: '',
            total_sessions: 10,
            validity_days: 30,
            price: 0,
            service_ids: [],
        },
    });

    const createSubscriptionMutation = useMutation({
        mutationFn: (data: SubscriptionFormValues) => http.post(apiRoutes.adminSubscriptions, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
            toast({
                title: t('common.success', 'Success'),
                description: t('subscriptions.createSuccess', 'Subscription created successfully'),
            });
            navigate(webRoutes.subscriptions.index);
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: t('common.error', 'Error'),
                description: error?.message || t('subscriptions.createError', 'Failed to create subscription'),
            });
        },
    });

    const onSubmit = (data: SubscriptionFormValues) => {
        createSubscriptionMutation.mutate(data);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{t('subscriptions.addTitle', 'Create New Subscription')}</h1>
                    <p className="text-muted-foreground">
                        {t('subscriptions.addSubtitle', 'Create a subscription package')}
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
                        {t('subscriptions.subscriptionDetailsDesc', 'Enter subscription package information')}
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

                            <FormField
                                control={form.control}
                                name="service_ids"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('subscriptions.services', 'Included Services')}</FormLabel>
                                        <FormDescription>
                                            {t('subscriptions.servicesDesc', 'Select services included in this subscription')}
                                        </FormDescription>
                                        <div className="space-y-2 max-h-64 overflow-y-auto border rounded-md p-4">
                                            {services.map((service: Service) => service.id && (
                                                <div key={service.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        checked={field.value?.includes(service.id)}
                                                        onCheckedChange={(checked) => {
                                                            if (!service.id) return;
                                                            const newValue = checked
                                                                ? [...(field.value || []), service.id]
                                                                : field.value?.filter((id) => id !== service.id) || [];
                                                            field.onChange(newValue);
                                                        }}
                                                    />
                                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                        {typeof service.name === 'string' ? service.name : (service.name?.fr || service.name?.en || '')} - {service.price} DH - {service.duration_minutes} min
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end space-x-4">
                                <Button type="button" variant="outline" onClick={() => navigate(webRoutes.subscriptions.index)}>
                                    {t('common.cancel', 'Cancel')}
                                </Button>
                                <Button type="submit" disabled={createSubscriptionMutation.isPending}>
                                    {createSubscriptionMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t('subscriptions.create', 'Create Subscription')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
