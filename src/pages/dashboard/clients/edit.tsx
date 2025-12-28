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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

const clientFormSchema = z.object({
    first_name: z.string().min(2, 'First name must be at least 2 characters'),
    last_name: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 characters'),
    address: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

export default function ClientsEdit() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    useEffect(() => {
        setPageTitle(t('clients.editTitle', 'Edit Client'));
    }, [t]);

    const { data: client, isLoading } = useQuery({
        queryKey: ['client', id],
        queryFn: async () => {
            const response = await http.get(apiRoutes.adminClientById(parseInt(id!)));
            return response.data;
        },
        enabled: !!id,
    });

    const form = useForm<ClientFormValues>({
        resolver: zodResolver(clientFormSchema),
        values: client
            ? {
                first_name: client.first_name || '',
                last_name: client.last_name || '',
                email: client.email || '',
                phone: client.phone || '',
                address: client.address || '',
            }
            : undefined,
    });

    const updateClientMutation = useMutation({
        mutationFn: (data: ClientFormValues) => http.put(apiRoutes.adminClientById(parseInt(id!)), data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            queryClient.invalidateQueries({ queryKey: ['client', id] });
            toast({
                title: t('common.success', 'Success'),
                description: t('clients.updateSuccess', 'Client updated successfully'),
            });
            navigate(webRoutes.clients.index);
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: t('common.error', 'Error'),
                description: error?.message || t('clients.updateError', 'Failed to update client'),
            });
        },
    });

    const onSubmit = (data: ClientFormValues) => {
        updateClientMutation.mutate(data);
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
                    <h1 className="text-3xl font-bold">{t('clients.editTitle', 'Edit Client')}</h1>
                    <p className="text-muted-foreground">
                        {t('clients.editSubtitle', 'Update client information')}
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate(webRoutes.clients.index)}>
                    {t('common.cancel', 'Cancel')}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('clients.clientDetails', 'Client Details')}</CardTitle>
                    <CardDescription>{t('clients.clientDetailsDesc', 'Update client information')}</CardDescription>
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

                            <div className="flex justify-end space-x-4">
                                <Button type="button" variant="outline" onClick={() => navigate(webRoutes.clients.index)}>
                                    {t('common.cancel', 'Cancel')}
                                </Button>
                                <Button type="submit" disabled={updateClientMutation.isPending}>
                                    {updateClientMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
