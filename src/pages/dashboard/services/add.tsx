import { useEffect } from 'react';
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

  // Fetch type resources
  const { data: typeResourcesData, isLoading: isLoadingTypeResources } = useQuery({
    queryKey: ['Resources'],
    queryFn: () => http.get(apiRoutes.adminResources),
  });

  const typeResources = typeResourcesData?.data?.data || [];


  const handleSubmit = (values: any) => {
 

    http
      .post(apiRoutes.adminServices, values)
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
      layout: {
        type: 'grid',
        columns: 2,
      },
      fields: [
        {
          name: 'name_fr',
          label: t('services.serviceNameFr', 'Service Name (FR)'),
          type: 'text',
          required: true,
          placeholder: t('services.serviceNamePlaceholder', 'e.g. Massage Suédois'),
        },
        {
          name: 'name_en',
          label: t('services.serviceNameEn', 'Service Name (EN)'),
          type: 'text',
          required: true,
          placeholder: t('services.serviceNamePlaceholder', 'e.g. Swedish Massage'),
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
          name: 'is_active',
          label: t('services.isActive', 'Active Service'),
          type: 'checkbox',
        },
        {
          name: 'description_fr',
          label: t('services.descriptionFr', 'Description (FR)'),
          type: 'textarea',
          placeholder: t('services.descriptionPlaceholder', 'Décrivez le service...'),
        },
        {
          name: 'description_en',
          label: t('services.descriptionEn', 'Description (EN)'),
          type: 'textarea',
          placeholder: t('services.descriptionPlaceholder', 'Describe the service...'),
        },
     
      ],
    },
    {
      group: t('services.requirements', 'Service Requirements'),
      fields: [
        {
          name: 'requirements',
          label: t('services.requirementsList', 'Requirements List'),
          type: 'table',
          required: false,
          columns: [
            {
              name: 'resource_id',
              label: t('services.resourceType', 'Resource Type'),
              type: 'select',
              required: true,
              disabled: isLoadingTypeResources,
              options: typeResources?.map((type: any) => ({
                value: type.id.toString(),
                name: type.name?.fr || type.name?.en || type.name,
              })) || [],
            },
            {
              name: 'quantity',
              label: t('services.quantity', 'Quantity'),
              type: 'number',
              required: true,
              placeholder: '1',
            },
            {
              name: 'is_required',
              label: t('services.isRequired', 'Is Required'),
              type: 'checkbox',
            },
          ],
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
