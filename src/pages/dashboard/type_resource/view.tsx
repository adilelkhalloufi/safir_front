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

export default function TypeResourceView() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();



    useEffect(() => {
        setPageTitle(t('typeResources.viewTitle', 'Type Resource Details'));
    }, [t]);

    const { data: resourceType, isLoading } = useQuery({
        queryKey: ['resourceType', id],
        queryFn: async () => {
            const response = await http.get(apiRoutes.adminTypeResourceById(parseInt(id!)));
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

    if (!resourceType) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <h2 className="text-2xl font-bold mb-4">{t('typeResources.notFound', 'Type resource not found')}</h2>
                <Button onClick={() => navigate(webRoutes.typeResources.index)}>
                    {t('common.backToList', 'Back to list')}
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{resourceType?.name?.fr} | {resourceType?.name?.en}</h1>
                    <p className="text-muted-foreground">
                        {t('typeResources.viewSubtitle', 'Type resource details and resources')}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(webRoutes.typeResources.index)}>
                        {t('common.back', 'Back')}
                    </Button>
                    <Button onClick={() => navigate(webRoutes.typeResources.edit.replace(':id', id!))}>
                        {t('common.edit', 'Edit')}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            {t('typeResources.typeInfo', 'Type Information')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('typeResources.nameFr', 'Name (French)')}</p>
                            <p className="text-base font-semibold">{resourceType?.name?.fr}</p>
                        </div>

                        <Separator />

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('typeResources.nameEn', 'Name (English)')}</p>
                            <p className="text-base font-semibold">{resourceType?.name?.en}</p>
                        </div>

                        <Separator />

                        {resourceType?.description?.fr && (
                            <>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('typeResources.descriptionFr', 'Description (French)')}</p>
                                    <p className="text-base">{resourceType?.description?.fr}</p>
                                </div>
                                <Separator />
                            </>
                        )}

                        {resourceType?.description?.en && (
                            <>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('typeResources.descriptionEn', 'Description (English)')}</p>
                                    <p className="text-base">{resourceType?.description?.en}</p>
                                </div>
                                <Separator />
                            </>
                        )}

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('typeResources.status', 'Status')}</p>
                            <Badge variant={resourceType?.is_active ? 'default' : 'secondary'}>
                                {resourceType?.is_active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
                            </Badge>
                        </div>

                        <Separator />

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('typeResources.resourcesCount', 'Resources Count')}</p>
                            <p className="text-base font-semibold">{resourceType?.resources?.length || 0}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            {t('typeResources.details', 'Details')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {resourceType?.created_at && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('typeResources.createdAt', 'Created At')}</p>
                                    <p className="text-base">{format(new Date(resourceType.created_at), 'PPP')}</p>
                                </div>
                            </div>
                        )}

                        {resourceType?.updated_at && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('typeResources.updatedAt', 'Updated At')}</p>
                                    <p className="text-base">{format(new Date(resourceType.updated_at), 'PPP')}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {resourceType?.resources && resourceType.resources.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Hash className="h-5 w-5" />
                            {t('typeResources.resources', 'Resources')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {resourceType.resources.map((resource: any, index: number) => (
                                <div key={resource.id || index} className="flex items-center justify-between p-2 border rounded">
                                    <div>
                                        <p className="font-medium">{resource.name?.fr || resource.name?.en || `Resource ${index + 1}`}</p>
                                        {resource.description?.fr || resource.description?.en ? (
                                            <p className="text-sm text-muted-foreground">{resource.description?.fr || resource.description?.en}</p>
                                        ) : null}
                                    </div>
                                    <Badge variant={resource.is_active ? 'default' : 'secondary'}>
                                        {resource.is_active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
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
