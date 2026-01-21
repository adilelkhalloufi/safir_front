import { useEffect, useMemo } from 'react';
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

  // Fetch type resources
  const { data: typeResourcesData, isLoading: isLoadingTypeResources } = useQuery({
    queryKey: ['resources'],
    queryFn: () => http.get(apiRoutes.adminResources),
  });

  const typeResources = typeResourcesData?.data?.data || [];

  const serviceData = service?.data?.data || [];

  const initialValues = useMemo(() => {
    if (!serviceData) {
      return {
        is_active: 1,
        requirements: [],
        buffer_minutes: 0,
        requires_health_form: 0,
        has_sessions: 0,
        slots: [],
      };
    }

    return {
      name_fr: serviceData.name?.fr || '',
      name_en: serviceData.name?.en || '',
      type_service_id: serviceData.type?.id?.toString() || '',
      duration_minutes: serviceData.duration_minutes || '',
      buffer_minutes: serviceData.buffer_minutes || 0,
      price: serviceData.price || '',
      description_fr: serviceData.description?.fr || '',
      description_en: serviceData.description?.en || '',
      is_active: serviceData.is_active ? 1 : 0,
      requires_health_form: serviceData.requires_health_form ? 1 : 0,
      has_sessions: serviceData.has_sessions ? 1 : 0,
      requirements: serviceData.requirements?.map((req: any) => ({
        resource_id: req.resource_id?.toString() || req.resource?.id?.toString() || '',
        quantity: req.quantity || 1,
        is_required: req.is_required ? 1 : 0,
      })) || [],
      slots: serviceData.slots?.map((slot: any) => ({
        slot_time: slot.slot_time || '',
        is_active: slot.is_active ? 1 : 0,
        default_capacity: slot.default_capacity || 0,
        gender: slot.gender || '',
        days_of_week: slot.days_of_week || [],
        capacity_total: slot.capacity_total || 0,
        capacity_staff: slot.capacity_staff || 0,
        capacity_self: slot.capacity_self || 0,
        max_scrubbers: slot.max_scrubbers || 0,
      })) || [],
    };
  }, [serviceData]);

  const handleSubmit = (values: any) => {
 
  

    http
      .put(apiRoutes.adminServiceById(Number(id)), values)
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
          name: 'buffer_minutes',
          label: t('services.bufferMinutes', 'Buffer Minutes'),
          type: 'number',
          required: false,
          placeholder: '0',
        },
        {
          name: 'price',
          label: t('services.price', 'Price'),
          type: 'number',
          required: true,
          placeholder: '0.00',
        },
        {
          name: 'requires_health_form',
          label: t('services.requiresHealthForm', 'Requires Health Form'),
          type: 'checkbox',
        },
        {
          name: 'has_sessions',
          label: t('services.hasSessions', 'Has Sessions'),
          type: 'checkbox',
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
    {
      group: t('services.slots', 'Service Slots'),
      fields: [
        {
          name: 'slots',
          label: t('services.slotsTable', 'Slots'),
          type: 'table',
          required: false,
          columns: [
            {
              name: 'slot_time',
              label: t('services.slotTime', 'Slot Time'),
              type: 'text',
              required: true,
              placeholder: '09:00',
            },
            {
              name: 'is_active',
              label: t('services.isActive', 'Is Active'),
              type: 'checkbox',
              required: true,
            },
            {
              name: 'default_capacity',
              label: t('services.defaultCapacity', 'Default Capacity'),
              type: 'number',
              required: true,
              placeholder: '1',
            },
            {
              name: 'gender',
              label: t('services.gender', 'Gender'),
              type: 'select',
              required: false,
              options: [
                { value: 'male', name: t('services.male', 'Male') },
                { value: 'female', name: t('services.female', 'Female') },
                { value: 'other', name: t('services.other', 'Other') },
              ],
            },
            {
              name: 'days_of_week',
              label: t('services.daysOfWeek', 'Days of Week'),
              type: 'select',
              multiSelect: true,
              required: true,
              options: [
                { value: 0, name: t('services.sunday', 'Sunday') },
                { value: 1, name: t('services.monday', 'Monday') },
                { value: 2, name: t('services.tuesday', 'Tuesday') },
                { value: 3, name: t('services.wednesday', 'Wednesday') },
                { value: 4, name: t('services.thursday', 'Thursday') },
                { value: 5, name: t('services.friday', 'Friday') },
                { value: 6, name: t('services.saturday', 'Saturday') },
              ],
            },
            {
              name: 'capacity_total',
              label: t('services.capacityTotal', 'Total Capacity'),
              type: 'number',
              required: false,
              placeholder: '0',
            },
            {
              name: 'capacity_staff',
              label: t('services.capacityStaff', 'Staff Capacity'),
              type: 'number',
              required: false,
              placeholder: '0',
            },
            {
              name: 'capacity_self',
              label: t('services.capacitySelf', 'Self Capacity'),
              type: 'number',
              required: false,
              placeholder: '0',
            },
            {
              name: 'max_scrubbers',
              label: t('services.maxScrubbers', 'Max Scrubbers'),
              type: 'number',
              required: false,
              placeholder: '0',
            },
          ],
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
          title=''
          fields={formGroups}
          onSubmit={handleSubmit}
          initialValues={initialValues}
        />
      </Layout.Body>
    </Layout>
  );
}
