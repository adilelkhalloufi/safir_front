import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { toast } from '@/components/ui/use-toast';
import { setPageTitle, handleErrorResponse } from '@/utils';
import MagicForm, { MagicFormGroupProps } from '@/components/custom/MagicForm';
import { IconLoader2 } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function EditStaff() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [staffData, setStaffData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const user = useSelector((state: RootState) => state.admin?.user);

  useEffect(() => {
    setPageTitle(t('staff.editTitle', 'Edit Staff Member'));
  }, [t]);

  const fetchStaff = async (staffId) => {
    setFetchLoading(true);
    try {
      const response = await http.get(apiRoutes.adminStaffById(Number(staffId)));
      setStaffData(response.data);
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (id === ':id') {
      fetchStaff(user?.profil?.id);
    } else {
      fetchStaff(id);
    }
  }, [id, user?.profil?.id]);

  

  // Fetch service types
  const { data: serviceTypesData, isLoading: isLoadingTypes } = useQuery({
    queryKey: ['serviceTypes'],
    queryFn: () => http.get(apiRoutes.adminServiceTypes),
  });

  const serviceTypes = serviceTypesData?.data?.data || [];

  // Fetch services
  const { data: servicesData, isLoading: isLoadingServices } = useQuery({
    queryKey: ['services'],
    queryFn: () => http.get(apiRoutes.adminServices),
  });

  const services = servicesData?.data?.data || [];

  const handleSubmit = (values: any) => {
    setLoading(true);

    // Transform service_ids from array of objects to array of IDs
    const submitData = {
      ...values,
      service_ids: values.service_ids?.map((item: any) => item.service_id) || [],
    };

    http
      .put(apiRoutes.adminStaffById(Number(id)), submitData)
      .then(() => {
        toast({
          title: t('common.success', 'Success'),
          description: t('staff.updateSuccess', 'Staff member updated successfully'),
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

  const initialValues = useMemo(() => {
    const staff = staffData?.data;

    if (!staff) {
      return {
        name: '',
        email: '',
        phone: '',
        type_staff_id: '',
        specialization: '',
        certification: '',
        hire_date: new Date().toISOString().split('T')[0],
        default_break_minutes: 15,
        is_active: 1,
        service_ids: [],
        availability: [],
      };
    }

    return {
      name: staff?.user?.email?.split('@')[0] || staff?.name || '',
      email: staff?.user?.email || staff?.email || '',
      phone: staff?.user?.phone || staff?.phone || '',
      type_staff_id: staff?.type_staff?.id?.toString() || staff?.type_staff_id?.toString() || '',
      specialization: staff?.specialization || '',
      certification: staff?.certification || '',
      hire_date: staff?.hire_date || new Date().toISOString().split('T')[0],
      default_break_minutes: staff?.default_break_minutes || 15,
      is_active: staff?.is_active ? 1 : 0,
      service_ids: staff?.services?.map((service: any) => ({
        service_id: service.id?.toString(),
      })) || [],
      availability: staff?.availability?.map((avail: any) => ({
        day_of_week: avail.day_of_week?.toString() || '',
        start_time: avail.start_time?.substring(0, 5) || '', // Convert HH:MM:SS to HH:MM
        end_time: avail.end_time?.substring(0, 5) || '', // Convert HH:MM:SS to HH:MM
        is_available: avail.is_available ? 1 : 0,
      })) || [],
    };
  }, [staffData]);

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <IconLoader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <MagicForm
      title={t('staff.editTitle', 'Edit Staff Member')}
      onSubmit={handleSubmit}
      fields={staffFields}
      button={t('common.save', 'Save')}
      initialValues={initialValues}
      loading={loading}
    />
  );
}
