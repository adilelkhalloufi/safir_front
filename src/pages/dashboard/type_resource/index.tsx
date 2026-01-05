import { GetServiceTypeColumns, ServiceType } from './columns';
import { TypesDataTable } from './data-table';
import { useEffect, useMemo, useState } from 'react';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { webRoutes } from '@/routes/web';
import { useTranslation } from 'react-i18next';
import { setPageTitle } from '@/utils';

export default function TypeServicesIndex() {
    const { t } = useTranslation();
    const [data, setData] = useState<ServiceType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        setPageTitle(t('typeServices.title', 'Resource Types Management'));
        fetchTypeServices();
    }, [t]);

    const fetchTypeServices = () => {
        setLoading(true);
        http
            .get(apiRoutes.adminTypeResources)
            .then((res) => {
                setData(res.data.data || []);
            })
            .catch(() => {
                toast({
                    variant: 'destructive',
                    title: t('common.error', 'Error'),
                    description: t('typeResources.fetchError', 'Failed to fetch resource types'),
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleView = (ressourceType: ServiceType) => {
        navigate(webRoutes.typeResources.view.replace(':id', ressourceType.id.toString()));
    };

    const handleEdit = (ressourceType: ServiceType) => {
        navigate(webRoutes.typeResources.edit.replace(':id', ressourceType.id.toString()));
    };

    const columns = useMemo(
        () =>
            GetServiceTypeColumns({
                onView: handleView,
                onEdit: handleEdit,
            }),
        [t]
    );

    return (
        <>
            <div className='mb-4 flex w-full items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold'>{t('typeResources.title', 'Resource Types Management')}</h1>
                    <p className='text-muted-foreground'>
                        {t('typeResources.subtitle', 'Manage resource type categories')}
                    </p>
                </div>
                <Button onClick={() => navigate(webRoutes.typeResources.add)}>
                    {t('typeResources.addNew', 'Add New Type')}
                </Button>
            </div>

            <TypesDataTable columns={columns} data={data} loading={loading} />
        </>
    );
}
