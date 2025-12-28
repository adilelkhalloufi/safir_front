import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

export default function TypeServicesAdd() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        setPageTitle(t('typeServices.addTitle', 'Add New Service Type'));
    }, [t]);

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
    });

    const createMutation = useMutation({
        mutationFn: (data: ServiceTypeFormValues) => http.post(apiRoutes.adminServiceTypes, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['serviceTypes'] });
            toast({
                title: t('common.success', 'Success'),
                description: t('typeServices.createSuccess', 'Service type created successfully'),
            });
            navigate(webRoutes.typeServices.index);
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: t('common.error', 'Error'),
                description: error?.message || t('typeServices.createError', 'Failed to create service type'),
            });
        },
    });

    const onSubmit = (data: ServiceTypeFormValues) => {
        createMutation.mutate(data);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{t('typeServices.addTitle', 'Add New Service Type')}</h1>
                    <p className="text-muted-foreground">
                        {t('typeServices.addSubtitle', 'Create a new service type category')}
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate(webRoutes.typeServices.index)}>
                    {t('common.cancel', 'Cancel')}
                </Button>
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
                                <Button type="button" variant="outline" onClick={() => navigate(webRoutes.typeServices.index)}>
                                    {t('common.cancel', 'Cancel')}
                                </Button>
                                <Button type="submit" disabled={createMutation.isPending}>
                                    {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t('typeServices.create', 'Create Service Type')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
