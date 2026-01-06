import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { toast } from '@/components/ui/use-toast';
import { setPageTitle, handleErrorResponse } from '@/utils';
import MagicForm, { MagicFormGroupProps } from '@/components/custom/MagicForm';
import { Skeleton } from '@/components/ui/skeleton';
import { ServiceType } from '@/interfaces/models';

export default function TypeServicesEdit() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setPageTitle(t('typeServices.editTitle', 'Edit Service Type'));
    }, [t]);
     const { data: serviceType, isLoading } = useQuery<ServiceType>({
        queryKey: ['serviceType', id],
      
        queryFn: async () => {
            const response = await http.get(apiRoutes.adminServiceTypeById(parseInt(id!)));
            return response.data.data;
        },
        enabled: !!id,
    });

    const handleSubmit = (values: any) => {
        setLoading(true);
        http
            .put(apiRoutes.adminServiceTypeById(parseInt(id!)), values)
            .then(() => {
                toast({
                    title: t('common.success', 'Success'),
                    description: t('typeServices.updateSuccess', 'Service type updated successfully'),
                });
                navigate(webRoutes.typeServices.view.replace(':id', id!));
            })
            .catch((e) => {
                handleErrorResponse(e);
                setLoading(false);
            });
    };

    const serviceTypeFields: MagicFormGroupProps[] = [
        {
            group: t('typeServices.typeDetails', 'Service Type Details'),
            card: true,
            fields: [
                {
                    name: 'name_fr',
                    label: t('typeServices.nameFr', 'Name (French)'),
                    type: 'text',
                    required: true,
                    error: t('typeServices.nameRequired', 'Name is required'),
                    placeholder: t('typeServices.namePlaceholderFr', 'e.g., Services de massage'),
                },
                {
                    name: 'name_en',
                    label: t('typeServices.nameEn', 'Name (English)'),
                    type: 'text',
                    required: true,
                    error: t('typeServices.nameRequired', 'Name is required'),
                    placeholder: t('typeServices.namePlaceholder', 'e.g., Massage Services'),
                },
          
              
      
                {
                    name: 'icon',
                    label: t('typeServices.icon', 'Icon'),
                    type: 'iconpicker',
                    placeholder: t('typeServices.iconPlaceholder', 'Icon class or emoji'),
                },
                {
                    name: 'color',
                    label: t('typeServices.color', 'Color'),
                    type: 'color',
                },
                {
                    name: 'display_order',
                    label: t('typeServices.displayOrder', 'Display Order'),
                    type: 'number',
                },
                {
                    name: 'is_active',
                    label: t('typeServices.isActive', 'Active'),
                    type: 'checkbox',
                },
            ],
        },
    ];

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
            </div>
        );
    }
    console.log("   serviceType:", serviceType);
    return (
        <MagicForm
            title={t('typeServices.editTitle', 'Edit Service Type')}
            onSubmit={handleSubmit}
            fields={serviceTypeFields}
            button={t('common.update', 'Update')}
            initialValues={{
                name_fr: serviceType?.name.fr,
                name_en: serviceType?.name.en,
                 icon: serviceType?.icon,
                color: serviceType?.color,
                is_active: serviceType?.is_active,
                display_order: serviceType?.display_order,
            }}
            loading={loading}
        />
    );
}
