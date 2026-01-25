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
    // Transform health_questions from table format to HealthQuestion format
    const transformedValues = { ...values };

    if (values.health_questions && Array.isArray(values.health_questions)) {
      transformedValues.health_questions = values.health_questions.map((question: any, index: number) => ({
        id: `question_${index + 1}`,
        question: {
          en: question.question_en,
          fr: question.question_fr,
        },
        type: question.type,
        required: question.required || false,
        order: question.order || index + 1,
        placeholder: question.placeholder_en || question.placeholder_fr ? {
          en: question.placeholder_en || '',
          fr: question.placeholder_fr || '',
        } : undefined,
        options: question.options_text ? question.options_text.split('\n').filter((line: string) => line.trim()).map((line: string) => {
          const parts = line.split('|').map(part => part.trim());
          return {
            label: {
              en: parts[0] || '',
              fr: parts[1] || parts[0] || '',
            },
            value: parts[2] || parts[0]?.toLowerCase().replace(/\s+/g, '_') || '',
          };
        }) : undefined,
      }));
    }

    http
      .post(apiRoutes.adminServices, transformedValues)
      .then(() => {
        toast({
          title: t('services.createSuccess', 'Service Created'),
          description: t('services.createSuccessDesc', 'Service has been created successfully'),
        });
        navigate(webRoutes.services.index);
      })
      .catch((error) => {
        handleErrorResponse(error);
      });
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
        {
          name: 'is_active',
          label: t('services.isActive', 'Active Service'),
          type: 'checkbox',
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
          showIf: (data) => data.has_sessions === 1,
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
                { value: '0', name: t('services.sunday', 'Sunday') },
                { value: '1', name: t('services.monday', 'Monday') },
                { value: '2', name: t('services.tuesday', 'Tuesday') },
                { value: '3', name: t('services.wednesday', 'Wednesday') },
                { value: '4', name: t('services.thursday', 'Thursday') },
                { value: '5', name: t('services.friday', 'Friday') },
                { value: '6', name: t('services.saturday', 'Saturday') },
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
    {
      group: t('services.healthQuestions', 'Health Questions'),
      fields: [
        {
          name: 'health_questions',
          label: t('services.healthQuestionsList', 'Health Questions'),
          type: 'table',
          required: false,
          showIf: (data) => data.requires_health_form === 1,
          columns: [
            {
              name: 'question_en',
              label: t('services.questionEn', 'Question (EN)'),
              type: 'text',
              required: true,
              placeholder: t('services.questionEnPlaceholder', 'Enter question in English'),
            },
            {
              name: 'question_fr',
              label: t('services.questionFr', 'Question (FR)'),
              type: 'text',
              required: true,
              placeholder: t('services.questionFrPlaceholder', 'Entrez la question en français'),
            },
            {
              name: 'type',
              label: t('services.fieldType', 'Field Type'),
              type: 'select',
              required: true,
              options: [
                { value: 'text', name: t('services.fieldTypeText', 'Text') },
                { value: 'textarea', name: t('services.fieldTypeTextarea', 'Textarea') },
                { value: 'select', name: t('services.fieldTypeSelect', 'Select') },
                { value: 'radio', name: t('services.fieldTypeRadio', 'Radio') },
                { value: 'checkbox', name: t('services.fieldTypeCheckbox', 'Checkbox') },
                { value: 'number', name: t('services.fieldTypeNumber', 'Number') },
                { value: 'date', name: t('services.fieldTypeDate', 'Date') },
                { value: 'label', name: t('services.fieldTypeLabel', 'Label') },

              ],
            },
            {
              name: 'required',
              label: t('services.isRequired', 'Required'),
              type: 'checkbox',
            },
            {
              name: 'order',
              label: t('services.questionOrder', 'Order'),
              type: 'number',
              required: true,
              placeholder: '1',
            },
            {
              name: 'placeholder_en',
              label: t('services.placeholderEn', 'Placeholder (EN)'),
              type: 'text',
              required: false,
              placeholder: t('services.placeholderEnPlaceholder', 'Optional placeholder text'),
            },
            {
              name: 'placeholder_fr',
              label: t('services.placeholderFr', 'Placeholder (FR)'),
              type: 'text',
              required: false,
              placeholder: t('services.placeholderFrPlaceholder', 'Texte d\'espace réservé optionnel'),
            },
            {
              name: 'options_text',
              label: t('services.options', 'Options'),
              type: 'textarea',
              required: false,
              showIf: (rowData) => rowData.type === 'select' || rowData.type === 'radio',
              placeholder: t('services.optionsPlaceholder', 'Enter options one per line:\nLabel EN|Label FR|value\n\nExample:\nYes|Oui|yes\nNo|Non|no'),
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
