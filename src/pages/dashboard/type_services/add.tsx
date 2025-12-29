import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { toast } from '@/components/ui/use-toast';
import { setPageTitle, handleErrorResponse } from '@/utils';
import MagicForm, { MagicFormGroupProps } from '@/components/custom/MagicForm';

export default function TypeServicesAdd() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setPageTitle(t('typeServices.addTitle', 'Add New Service Type'));
    }, [t]);

    const handleSubmit = (values: any) => {
        setLoading(true);
        http
            .post(apiRoutes.adminServiceTypes, values)
            .then(() => {
                toast({
                    title: t('common.success', 'Success'),
                    description: t('typeServices.createSuccess', 'Service type created successfully'),
                });
                navigate(webRoutes.typeServices.index);
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
                    type: 'text',
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
                    defaultValue: true,
                    label: t('typeServices.isActive', 'Active'),
                    type: 'checkbox',
                },
            ],
        },
    ];

    return (
        <MagicForm
            title={t('typeServices.addTitle', 'Add New Service Type')}
            onSubmit={handleSubmit}
            fields={serviceTypeFields}
            button={t('typeServices.create', 'Create Service Type')}
            initialValues={{
                name_fr: '',
                name_en: '',
                code: '',
                description: '',
                icon: '',
                color: '#3b82f6',
                is_active: true,
                display_order: 0,
            }}
            loading={loading}
        />
    );
}
