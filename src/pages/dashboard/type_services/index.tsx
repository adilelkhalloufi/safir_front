import { GetServiceTypeColumns, ServiceType } from './columns';
import { ServiceTypesDataTable } from './data-table';
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
        setPageTitle(t('typeServices.title', 'Service Types Management'));
        fetchTypeServices();
    }, [t]);

    const fetchTypeServices = () => {
        setLoading(true);
        http
            .get(apiRoutes.adminServiceTypes)
            .then((res) => {
                setData(res.data || []);
            })
            .catch(() => {
                toast({
                    variant: 'destructive',
                    title: t('common.error', 'Error'),
                    description: t('typeServices.fetchError', 'Failed to fetch service types'),
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleView = (serviceType: ServiceType) => {
        navigate(webRoutes.typeServices.view.replace(':id', serviceType.id.toString()));
    };

    const handleEdit = (serviceType: ServiceType) => {
        navigate(webRoutes.typeServices.edit.replace(':id', serviceType.id.toString()));
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
                    <h1 className='text-3xl font-bold'>{t('typeServices.title', 'Service Types Management')}</h1>
                    <p className='text-muted-foreground'>
                        {t('typeServices.subtitle', 'Manage service type categories')}
                    </p>
                </div>
                <Button onClick={() => navigate(webRoutes.typeServices.add)}>
                    {t('typeServices.addNew', 'Add New Type')}
                </Button>
            </div>

            <ServiceTypesDataTable columns={columns} data={data} loading={loading} />
        </>
    );
}
