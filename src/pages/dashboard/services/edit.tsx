import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { LayoutSh as Layout } from '@/components/custom/layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { IconArrowLeft, IconLoader2 } from '@tabler/icons-react';
import { setPageTitle, handleErrorResponse } from '@/utils';
import MagicForm, { MagicFormGroupProps } from '@/components/custom/MagicForm';

export default function EditService() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPageTitle(t('services.editService', 'Edit Service'));
  }, [t]);

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () => http.get(apiRoutes.adminServiceById(Number(id))),
    enabled: !!id,
  });

  // Fetch service types
  const { data: serviceTypesData, isLoading: isLoadingTypes } = useQuery({
    queryKey: ['serviceTypes'],
    queryFn: () => http.get(apiRoutes.adminServiceTypes),
  });

  const serviceTypes = serviceTypesData?.data?.data || [];

  const serviceData = service?.data;

  const initialValues = useMemo(() => {
    if (!serviceData) {
      return {
        is_active: 1,
      };
    }

    return {
      name: serviceData.name || '',
      type_service_id: serviceData.type_service?.id?.toString() || '',
      duration_minutes: serviceData.duration_minutes || '',
      price: serviceData.price || '',
      description: serviceData.description || '',
      requires_room: serviceData.requires_room ? 1 : 0,
      requires_chair: serviceData.requires_chair ? 1 : 0,
      requires_wash_station: serviceData.requires_wash_station ? 1 : 0,
      requires_hammam_session: serviceData.requires_hammam_session ? 1 : 0,
      is_active: serviceData.is_active ? 1 : 0,
    };
  }, [serviceData]);

  const handleSubmit = (values: any) => {
    setLoading(true);

    const payload = {
      ...values,
      duration_minutes: parseInt(values.duration_minutes) || 30,
      price: parseFloat(values.price) || 0,
      is_active: values.is_active ? 1 : 0,
    };

    http
      .put(apiRoutes.adminServiceById(Number(id)), payload)
      .then(() => {
        toast({
          title: t('services.updateSuccess', 'Service Updated'),
          description: t('services.updateSuccessDesc', 'Service has been updated successfully'),
        });
        navigate(webRoutes.services.index);
      })
      .catch((error) => {
        handleErrorResponse(error);
      })
      .finally(() => {
        setLoading(false);
      });
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

  if (isLoading) {
    return (
      <Layout>
        <Layout.Body>
          <div className="flex items-center justify-center h-full">
            <IconLoader2 className="h-8 w-8 animate-spin" />
          </div>
        </Layout.Body>
      </Layout>
    );
  }

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
            <h1 className="text-2xl font-bold tracking-tight">{t('services.editService', 'Edit Service')}</h1>
            <p className="text-muted-foreground">{t('services.addEditDescription', 'Update service details')}</p>
          </div>
        </div>
      </Layout.Header>

      <Layout.Body>
        <MagicForm
          fields={formGroups}
          onSubmit={handleSubmit}
          initialValues={initialValues}
        />
      </Layout.Body>
    </Layout>
  );
}
