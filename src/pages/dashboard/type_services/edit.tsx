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
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

const serviceTypeFormSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    code: z.string().min(2, 'Code must be at least 2 characters').regex(/^[a-z_]+$/, 'Code must be lowercase letters and underscores only'),
    description: z.string().optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
    is_active: z.boolean().default(true),
    display_order: z.number().optional(),
});

type ServiceTypeFormValues = z.infer<typeof serviceTypeFormSchema>;

export default function TypeServicesEdit() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        setPageTitle(t('typeServices.editTitle', 'Edit Service Type'));
    }, [t]);

    const { data: serviceType, isLoading } = useQuery({
        queryKey: ['serviceType', id],
        queryFn: async () => {
            const response = await http.get(apiRoutes.adminServiceTypeById(parseInt(id!)));
            return response.data;
        },
        enabled: !!id,
    });

    const form = useForm<ServiceTypeFormValues>({
        resolver: zodResolver(serviceTypeFormSchema),
        defaultValues: {
            name: '',
            code: '',
            description: '',
            icon: '',
            color: '#3b82f6',
            is_active: true,
            display_order: 0,
        },
        values: serviceType
            ? {
                name: serviceType.name,
                code: serviceType.code,
                description: serviceType.description || '',
                icon: serviceType.icon || '',
                color: serviceType.color || '#3b82f6',
                is_active: serviceType.is_active,
                display_order: serviceType.display_order || 0,
            }
            : undefined,
    });

    const updateMutation = useMutation({
        mutationFn: (data: ServiceTypeFormValues) => http.put(apiRoutes.adminServiceTypeById(parseInt(id!)), data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['serviceTypes'] });
            queryClient.invalidateQueries({ queryKey: ['serviceType', id] });
            toast({
                title: t('common.success', 'Success'),
                description: t('typeServices.updateSuccess', 'Service type updated successfully'),
            });
            navigate(webRoutes.typeServices.view.replace(':id', id!));
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: t('common.error', 'Error'),
                description: error?.message || t('typeServices.updateError', 'Failed to update service type'),
            });
        },
    });

    const onSubmit = (data: ServiceTypeFormValues) => {
        updateMutation.mutate(data);
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (!serviceType) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <h2 className="text-2xl font-bold mb-4">{t('typeServices.notFound', 'Service type not found')}</h2>
                <Button onClick={() => navigate(webRoutes.typeServices.index)}>
                    {t('common.backToList', 'Back to list')}
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{t('typeServices.editTitle', 'Edit Service Type')}</h1>
                    <p className="text-muted-foreground">
                        {t('typeServices.editSubtitle', 'Update service type information')}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(webRoutes.typeServices.view.replace(':id', id!))}>
                        {t('common.cancel', 'Cancel')}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('typeServices.typeDetails', 'Service Type Details')}</CardTitle>
                    <CardDescription>{t('typeServices.typeDetailsDesc', 'Enter the service type information')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('typeServices.name', 'Name')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t('typeServices.namePlaceholder', 'e.g., Massage Services')} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('typeServices.code', 'Code')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t('typeServices.codePlaceholder', 'e.g., massage')} {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                {t('typeServices.codeDesc', 'Unique code (lowercase, underscores only)')}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('typeServices.description', 'Description')}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t('typeServices.descriptionPlaceholder', 'Describe this service type')}
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
                                    name="icon"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('typeServices.icon', 'Icon')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t('typeServices.iconPlaceholder', 'Icon class or emoji')} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="color"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('typeServices.color', 'Color')}</FormLabel>
                                            <FormControl>
                                                <Input type="color" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="display_order"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('typeServices.displayOrder', 'Display Order')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="is_active"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>{t('typeServices.isActive', 'Active')}</FormLabel>
                                            <FormDescription>
                                                {t('typeServices.isActiveDesc', 'This service type is available for use')}
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end space-x-4">
                                <Button type="button" variant="outline" onClick={() => navigate(webRoutes.typeServices.view.replace(':id', id!))}>
                                    {t('common.cancel', 'Cancel')}
                                </Button>
                                <Button type="submit" disabled={updateMutation.isPending}>
                                    {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t('typeServices.update', 'Update Service Type')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
