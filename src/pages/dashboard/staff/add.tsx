import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { toast } from '@/components/ui/use-toast';
import { setPageTitle, handleErrorResponse } from '@/utils';
import MagicForm, { MagicFormGroupProps } from '@/components/custom/MagicForm';

export default function AddStaff() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPageTitle(t('staff.addNew', 'Add New Staff Member'));
  }, [t]);

  // Fetch service types
  const { data: serviceTypes, isLoading: isLoadingTypes } = useQuery({
    queryKey: ['serviceTypes'],
    queryFn: async () => {
      const response = await http.get(apiRoutes.adminServiceTypes);
      return response.data.data || response.data;
    },
  });

  // Fetch services
  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await http.get(apiRoutes.adminServices);
      return response.data.data || response.data;
    },
  });

  const handleSubmit = (values: any) => {
    setLoading(true);

    // Transform service_ids from array of objects to array of IDs
    const submitData = {
      ...values,
      service_ids: values.service_ids?.map((item: any) => item.service_id) || [],
    };

    http
      .post(apiRoutes.adminStaff, submitData)
      .then(() => {
        toast({
          title: t('common.success', 'Success'),
          description: t('staff.createSuccess', 'Staff member created successfully'),
        });
        navigate(webRoutes.staff.index);
      })
      .catch((e) => {
        handleErrorResponse(e);
        setLoading(false);
      });
  };

  const staffFields: MagicFormGroupProps[] = [
    {
      group: t('staff.personalDetails', 'Personal Details'),
      card: true,
      layout: {
        type: 'grid',
        columns: 2,
      },
      fields: [
        {
          name: 'name',
          label: t('staff.name', 'Full Name'),
          type: 'text',
          required: true,
          placeholder: t('staff.namePlaceholder', 'Enter full name'),
        },
        {
          name: 'email',
          label: t('staff.email', 'Email'),
          type: 'text',
          required: true,
          placeholder: t('staff.emailPlaceholder', 'email@example.com'),
        },
        {
          name: 'phone',
          label: t('staff.phone', 'Phone'),
          type: 'text',
          placeholder: t('staff.phonePlaceholder', '+1 234 567 8900'),
        },
        {
          name: 'type_staff_id',
          label: t('staff.type', 'Staff Type'),
          type: 'select',
          required: true,
          disabled: isLoadingTypes,
          options: serviceTypes?.map((type: any) => ({
            value: type.id.toString(),
            name: type.name?.fr || type.name?.en || type.name || type.type_name || type.type,
          })) || [],
          placeholder: isLoadingTypes ? 'Loading...' : t('staff.selectType', 'Select staff type'),
          autocomplete: true,
        },
        {
          name: 'specialization',
          label: t('staff.specialization', 'Specialization'),
          type: 'text',
          placeholder: t('staff.specializationPlaceholder', 'e.g., Swedish massage, Deep tissue'),
        },
        {
          name: 'certification',
          label: t('staff.certification', 'Certification'),
          type: 'textarea',
          placeholder: t('staff.certificationPlaceholder', 'List certifications and qualifications'),
        },
        {
          name: 'hire_date',
          label: t('staff.hireDate', 'Hire Date'),
          type: 'date',
          required: true,
        },
        {
          name: 'default_break_minutes',
          label: t('staff.defaultBreak', 'Default Break (minutes)'),
          type: 'number',
          defaultValue: 15,
          placeholder: '15',
        },
        {
          name: 'is_active',
          label: t('staff.isActive', 'Active'),
          type: 'checkbox',
          defaultValue: 1,
        },
      ],
    },
    {
      group: t('staff.services', 'Services'),
      card: true,
      fields: [
        {
          name: 'service_ids',
          label: t('staff.servicesCanProvide', 'Services this staff member can provide'),
          type: 'table',
          required: true,
          columns: [
            {
              name: 'service_id',
              label: t('staff.service', 'Service'),
              type: 'select',
              required: true,
              disabled: isLoadingServices,
              options: services?.map((service: any) => ({
                value: service.id.toString(),
                name: service.name?.fr || service.name?.en || service.name || service.service_name,
              })) || [],
              placeholder: isLoadingServices ? 'Loading...' : t('staff.selectService', 'Select service'),
              autocomplete: true,
            },
          ],
        },
      ],
    },
    {
      group: t('staff.availability', 'Availability Schedule'),
      card: true,
      fields: [
        {
          name: 'availability',
          label: t('staff.weeklySchedule', 'Weekly Schedule'),
          type: 'table',
          required: true,
          columns: [
            {
              name: 'day_of_week',
              label: t('staff.dayOfWeek', 'Day of Week'),
              type: 'select',
              required: true,
              options: [
                { value: '0', name: t('days.sunday', 'Sunday') },
                { value: '1', name: t('days.monday', 'Monday') },
                { value: '2', name: t('days.tuesday', 'Tuesday') },
                { value: '3', name: t('days.wednesday', 'Wednesday') },
                { value: '4', name: t('days.thursday', 'Thursday') },
                { value: '5', name: t('days.friday', 'Friday') },
                { value: '6', name: t('days.saturday', 'Saturday') },
              ],
              placeholder: t('staff.selectDay', 'Select day'),
            },
            {
              name: 'start_time',
              label: t('staff.startTime', 'Start Time'),
              type: 'time',
              required: true,
              placeholder: '09:00',
            },
            {
              name: 'end_time',
              label: t('staff.endTime', 'End Time'),
              type: 'time',
              required: true,
              placeholder: '17:00',
            },
            {
              name: 'is_available',
              label: t('staff.isAvailable', 'Available'),
              type: 'checkbox',
              defaultValue: 1,
            },
          ],
        },
      ],
    },
  ];

  return (
    <MagicForm
      title={t('staff.addNew', 'Add New Staff Member')}
      onSubmit={handleSubmit}
      fields={staffFields}
      button={t('common.save', 'Save')}

      loading={loading}
    />
  );
}
