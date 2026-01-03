import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { LayoutSh as Layout } from '@/components/custom/layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { IconArrowLeft } from '@tabler/icons-react';
import { setPageTitle, handleErrorResponse } from '@/utils';
import MagicForm, { MagicFormGroupProps } from '@/components/custom/MagicForm';

export default function AddService() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setPageTitle(t('services.addService', 'Add Service'));
  }, [t]);

  // Fetch service types
  const { data: serviceTypesData, isLoading: isLoadingTypes } = useQuery({
    queryKey: ['serviceTypes'],
    queryFn: () => http.get(apiRoutes.adminServiceTypes),
  });

  const serviceTypes = serviceTypesData?.data?.data || [];


  const handleSubmit = (values: any) => {

    const payload = {
      ...values,
      duration_minutes: parseInt(values.duration_minutes) || 30,
      price: parseFloat(values.price) || 0,
      is_active: values.is_active ? 1 : 0,
    };

    http
      .post(apiRoutes.adminServices, payload)
      .then(() => {
        toast({
          title: t('services.createSuccess', 'Service Created'),
          description: t('services.createSuccessDesc', 'Service has been created successfully'),
        });
        navigate(webRoutes.services.index);
      })
      .catch((error) => {
        handleErrorResponse(error);
      })

  };

  const formGroups: MagicFormGroupProps[] = [
    {
      group: t('services.basicInfo', 'Basic Information'),

      fields: [
        {
          name: 'name',
          label: t('services.serviceName', 'Service Name'),
          type: 'text',
          required: true,
          placeholder: t('services.serviceNamePlaceholder', 'Enter service name'),
        },
        {
          name: 'type_service_id',
          label: t('services.serviceType', 'Service Type'),
          type: 'select',
          required: true,
          disabled: isLoadingTypes,
          options: serviceTypes?.map((type: any) => ({
            value: type.id.toString(),
            name: type.name?.fr || type.name?.en || type.name,
          })) || [],
          placeholder: isLoadingTypes ? 'Loading...' : t('services.selectType', 'Select service type'),
        },
        {
          name: 'duration_minutes',
          label: t('services.duration', 'Duration (minutes)'),
          type: 'number',
          required: true,
          placeholder: '30',
        },
        {
          name: 'price',
          label: t('services.price', 'Price'),
          type: 'number',
          required: true,
          placeholder: '0.00',
        },
        {
          name: 'description',
          label: t('services.description', 'Description'),
          type: 'textarea',
          placeholder: t('services.descriptionPlaceholder', 'Enter service description'),
        },
      ],
    },
    {

      group: t('services.resourceRequirements', 'Resource Requirements'),
      fields: [
        {
          name: 'requires_room',
          label: t('services.requiresRoom', 'Requires Room'),
          type: 'checkbox',
        },
        {
          name: 'requires_chair',
          label: t('services.requiresChair', 'Requires Chair'),
          type: 'checkbox',
        },
        {
          name: 'requires_wash_station',
          label: t('services.requiresWashStation', 'Requires Wash Station'),
          type: 'checkbox',
        },
        {
          name: 'requires_hammam_session',
          label: t('services.requiresHammamSession', 'Requires Hammam Session'),
          type: 'checkbox',
        },
        {
          name: 'is_active',
          label: t('services.isActive', 'Active Service'),
          type: 'checkbox',
        },
      ],
    },
  ];

  return (
    <Layout>
      <Layout.Header>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(webRoutes.services.index)}
          >
            <IconArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('services.addService', 'Add Service')}</h1>
            <p className="text-muted-foreground">{t('services.addEditDescription', 'Create a new service')}</p>
          </div>
        </div>
      </Layout.Header>

      <Layout.Body>
        <MagicForm
          fields={formGroups}
          onSubmit={handleSubmit}

        />
      </Layout.Body>
    </Layout>
  );
}
