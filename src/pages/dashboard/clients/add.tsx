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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const clientFormSchema = z.object({
    first_name: z.string().min(2, 'First name must be at least 2 characters'),
    last_name: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 characters'),
    address: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

export default function ClientsAdd() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        setPageTitle(t('clients.addTitle', 'Add New Client'));
    }, [t]);

    const form = useForm<ClientFormValues>({
        resolver: zodResolver(clientFormSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            address: '',
            password: '',
        },
    });

    const createClientMutation = useMutation({
        mutationFn: (data: ClientFormValues) => http.post(apiRoutes.register, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            toast({
                title: t('common.success', 'Success'),
                description: t('clients.createSuccess', 'Client created successfully'),
            });
            navigate(webRoutes.clients.index);
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: t('common.error', 'Error'),
                description: error?.message || t('clients.createError', 'Failed to create client'),
            });
        },
    });

    const onSubmit = (data: ClientFormValues) => {
        createClientMutation.mutate(data);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{t('clients.addTitle', 'Add New Client')}</h1>
                    <p className="text-muted-foreground">
                        {t('clients.addSubtitle', 'Create a new client account')}
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate(webRoutes.clients.index)}>
                    {t('common.cancel', 'Cancel')}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('clients.clientDetails', 'Client Details')}</CardTitle>
                    <CardDescription>{t('clients.clientDetailsDesc', 'Enter the client information')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="first_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('common.firstName', 'First Name')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t('common.firstNamePlaceholder', 'Enter first name')} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="last_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('common.lastName', 'Last Name')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t('common.lastNamePlaceholder', 'Enter last name')} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('common.email', 'Email')}</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder={t('common.emailPlaceholder', 'Enter email')} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('common.phone', 'Phone')}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t('common.phonePlaceholder', 'Enter phone number')} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('common.address', 'Address')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('common.addressPlaceholder', 'Enter address (optional)')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('common.password', 'Password')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder={t('common.passwordPlaceholder', 'Enter password')}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end space-x-4">
                                <Button type="button" variant="outline" onClick={() => navigate(webRoutes.clients.index)}>
                                    {t('common.cancel', 'Cancel')}
                                </Button>
                                <Button type="submit" disabled={createClientMutation.isPending}>
                                    {createClientMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t('clients.create', 'Create Client')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
