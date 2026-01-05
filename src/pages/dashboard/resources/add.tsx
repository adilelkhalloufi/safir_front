import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { LayoutSh as Layout } from '@/components/custom/layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { IconArrowLeft } from '@tabler/icons-react';
import MagicForm, { MagicFormGroupProps } from '@/components/custom/MagicForm';

export default function AddResource() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: typeResources, isLoading: isLoadingTypes } = useQuery({
    queryKey: ['typeResources'],
    queryFn: async () => {
      const response = await http.get(apiRoutes.adminTypeResources);
      return response.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => http.post(apiRoutes.adminResources, data),
    onSuccess: () => {
      toast({
        title: t('resources.createSuccess', 'Resource created successfully'),
        description: t('resources.createSuccessDesc', 'The resource has been created.'),
      });
      navigate(webRoutes.resources.index);
    },
    onError: (error: any) => {
      toast({
        title: t('resources.saveError', 'Error'),
        description: error?.message || t('resources.saveErrorDesc', 'Failed to save resource.'),
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  const typeResourceOptions = typeResources?.map((type: any) => ({
    value: type.id,
    name: type.name?.fr || type.name?.en || 'N/A',
  })) || [];

  const formFields: MagicFormGroupProps[] = [
    {
      group: 'basic',
      fields: [
        {
          name: 'name.fr',
          label: t('resources.nameFr', 'Name (French)'),
          type: 'text',
          required: true,
          placeholder: t('resources.nameFrPlaceholder', 'Enter French name'),
          width: 'half',
        },
        {
          name: 'name.en',
          label: t('resources.nameEn', 'Name (English)'),
          type: 'text',
          required: true,
          placeholder: t('resources.nameEnPlaceholder', 'Enter English name'),
          width: 'half',
        },
        {
          name: 'description.fr',
          label: t('resources.descriptionFr', 'Description (French)'),
          type: 'textarea',
          placeholder: t('resources.descriptionFrPlaceholder', 'Enter French description'),
          width: 'half',
        },
        {
          name: 'description.en',
          label: t('resources.descriptionEn', 'Description (English)'),
          type: 'textarea',
          placeholder: t('resources.descriptionEnPlaceholder', 'Enter English description'),
          width: 'half',
        },
        {
          name: 'type_resource_id',
          label: t('resources.typeResource', 'Type Resource'),
          type: 'select',
          required: true,
          options: typeResourceOptions,
          placeholder: t('resources.selectTypeResource', 'Select type resource'),
          width: 'half',
          autocomplete: true,
        },
        {
          name: 'capacity',
          label: t('resources.capacity', 'Capacity'),
          type: 'number',
          placeholder: t('resources.capacityPlaceholder', 'Enter capacity'),
          width: 'half',
        },
        {
          name: 'location',
          label: t('resources.location', 'Location'),
          type: 'text',
          placeholder: t('resources.locationPlaceholder', 'Enter location'),
          width: 'half',
        },
        {
          name: 'is_available',
          label: t('resources.isAvailable', 'Available'),
          type: 'checkbox',
          defaultValue: 1,
          width: 'half',
        },
        {
          name: 'is_active',
          label: t('resources.isActive', 'Active'),
          type: 'checkbox',
          defaultValue: 1,
          width: 'half',
        },
      ],
      layout: {
        type: 'grid',
        columns: 2,
      },
    },
  ];

  if (isLoadingTypes) {
    return (
      <Layout>
        <Layout.Body>
          <div className="flex items-center justify-center h-full">
            <p>{t('common.loading', 'Loading...')}</p>
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
            onClick={() => navigate(webRoutes.resources.index)}
          >
            <IconArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('resources.addResource', 'Add Resource')}</h1>
            <p className="text-muted-foreground">{t('resources.addDescription', 'Create a new resource')}</p>
          </div>
        </div>
      </Layout.Header>

      <Layout.Body>
        <MagicForm
          fields={formFields}
          onSubmit={handleSubmit}
          button={t('common.save', 'Save')}
          loading={createMutation.isPending}
        />
      </Layout.Body>
    </Layout>
  );
}
