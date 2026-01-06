import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { setPageTitle } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Calendar, Hash, Palette } from 'lucide-react';
import { format } from 'date-fns';
import IconDisplay from '@/components/custom/IconDisplay';

export default function TypeServicesView() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

 

    useEffect(() => {
        setPageTitle(t('typeServices.viewTitle', 'Service Type Details'));
    }, [t]);

    const { data: serviceType, isLoading } = useQuery({
        queryKey: ['serviceType', id],
        queryFn: async () => {
            const response = await http.get(apiRoutes.adminServiceTypeById(parseInt(id!)));
            return response.data.data;
        },
        enabled: !!id,
    });

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
                    <h1 className="text-3xl font-bold">{(serviceType?.name?.fr)} | {(serviceType?.name?.en)}</h1>
                    <p className="text-muted-foreground">
                        {t('typeServices.viewSubtitle', 'Service type details and statistics')}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(webRoutes.typeServices.index)}>
                        {t('common.back', 'Back')}
                    </Button>
                    <Button onClick={() => navigate(webRoutes.typeServices.edit.replace(':id', id!))}>
                        {t('common.edit', 'Edit')}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            {t('typeServices.typeInfo', 'Type Information')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('typeServices.name', 'Name')}</p>
                            <p className="text-base font-semibold">{serviceType?.name?.fr} | {serviceType?.name?.en}</p>
                        </div>

                        <Separator />

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('typeServices.status', 'Status')}</p>
                            <Badge variant={serviceType.is_active ? 'default' : 'secondary'}>
                                {serviceType.is_active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
                            </Badge>
                        </div>

                        <Separator />

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('typeServices.servicesCount', 'Services Count')}</p>
                            <p className="text-base font-semibold">{serviceType.services_count || 0}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            {t('typeServices.displaySettings', 'Display Settings')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {serviceType.icon && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('typeServices.icon', 'Icon')}</p>
                                 <IconDisplay color={serviceType.color || 'currentColor'} iconName={serviceType.icon} />
                            </div>
                        )}

                        {serviceType.color && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('typeServices.color', 'Color')}</p>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-8 w-8 rounded border"
                                        style={{ backgroundColor: serviceType.color }}
                                    />
                                    <span className="font-mono">{serviceType.color}</span>
                                </div>
                            </div>
                        )}

                        <Separator />

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('typeServices.displayOrder', 'Display Order')}</p>
                            <p className="text-base">{serviceType.display_order ?? 0}</p>
                        </div>

                        <Separator />

                        {serviceType.created_at && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('typeServices.createdAt', 'Created At')}</p>
                                    <p className="text-base">{format(new Date(serviceType.created_at), 'PPP')}</p>
                                </div>
                            </div>
                        )}

                        {serviceType.updated_at && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('typeServices.updatedAt', 'Updated At')}</p>
                                    <p className="text-base">{format(new Date(serviceType.updated_at), 'PPP')}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {serviceType.services && serviceType.services.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Hash className="h-5 w-5" />
                            {t('typeServices.services', 'Services')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {serviceType.services.map((service: any, index: number) => (
                                <div key={service.id || index} className="flex items-center justify-between p-2 border rounded">
                                    <div>
                                        <p className="font-medium">{service.name || `Service ${index + 1}`}</p>
                                        {service.description && (
                                            <p className="text-sm text-muted-foreground">{service.description}</p>
                                        )}
                                    </div>
                                    <Badge variant={service.is_active ? 'default' : 'secondary'}>
                                        {service.is_active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
