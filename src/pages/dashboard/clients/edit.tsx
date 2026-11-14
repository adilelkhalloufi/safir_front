import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
 import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { toast } from '@/components/ui/use-toast';
import { setPageTitle } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import MagicForm, { MagicFormGroupProps } from '@/components/custom/MagicForm';

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
            return response.data?.data ?? response.data;
        },
        enabled: !!id,
    });

    const updateClientMutation = useMutation({
        mutationFn: (data: Record<string, any>) => http.put(apiRoutes.adminClientById(parseInt(id!)), data),
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
                description: error?.response?.data?.message || error?.message || t('clients.updateError', 'Failed to update client'),
            });
        },
    });

     

    const clientFields: MagicFormGroupProps[] = [
        {
            group: t('clients.clientDetails', 'Client Details'),
            card: true,
            layout: {
                type: 'grid',
                columns: 2,
            },
            fields: [
                {
                    name: 'name',
                    label: t('common.name', 'Name'),
                    type: 'text',
                    required: true,
                    placeholder: t('common.namePlaceholder', 'Enter full name'),
                },
                {
                    name: 'phone',
                    label: t('common.phone', 'Phone'),
                    type: 'text',
                    required: true,
                    placeholder: t('common.phonePlaceholder', 'Enter phone number'),
                },
                {
                    name: 'email',
                    label: t('common.email', 'Email'),
                    type: 'text',
                    required: true,
                    placeholder: t('common.emailPlaceholder', 'Enter email'),
                },
            ],
        },
    ];

    const onSubmit = (data: Record<string, any>) => {
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
                <CardContent className="space-y-4">
                    <div className="flex justify-end">
                        {/* <Button
                            type="button"
                            variant="secondary"
                            onClick={() => resetPasswordMutation.mutate()}
                            disabled={resetPasswordMutation.isPending || !id}
                        >
                            {resetPasswordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('clients.resetPassword', 'Reset password')}
                        </Button> */}
                    </div>

                    <MagicForm
                        fields={clientFields}
                        onSubmit={onSubmit}
                        initialValues={
                            client
                                ? {
                                    name: client.name || client.user?.name || '',
                                    email: client.email || '',
                                    phone: client.phone || '',
                                }
                                : undefined
                        }
                        button={t('common.save', 'Save Changes')}
                        loading={updateClientMutation.isPending}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
