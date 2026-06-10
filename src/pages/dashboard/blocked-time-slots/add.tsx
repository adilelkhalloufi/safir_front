import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { LayoutSh as Layout } from '@/components/custom/layout';
 import { useToast } from '@/components/ui/use-toast';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
 import { setPageTitle, handleErrorResponse } from '@/utils';
import MagicForm, { MagicFormGroupProps } from '@/components/custom/MagicForm';

export default function AddBlockedTimeSlot() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setPageTitle(t('blockedSlots.addBlockedSlot', 'Add Blocked Time Slot'));
  }, [t]);

  // Fetch staff
  const { data: staffData, isLoading: isLoadingStaff } = useQuery({
    queryKey: ['staffForBlocking'],
    queryFn: () => http.get(apiRoutes.adminStaff),
  });

  const staffMembers = staffData?.data?.data || [];

  // Fetch service types
  const { data: serviceTypesData, isLoading: isLoadingServiceTypes } = useQuery({
    queryKey: ['serviceTypesForBlocking'],
    queryFn: () => http.get(apiRoutes.adminServiceTypes),
  });

  const serviceTypes = serviceTypesData?.data?.data || [];

  // Fetch services
  const { data: servicesData, isLoading: isLoadingServices } = useQuery({
    queryKey: ['servicesForBlocking'],
    queryFn: () => http.get(apiRoutes.adminServices),
  });

  const services = servicesData?.data?.data || [];

  const handleSubmit = (values: any) => {
    // Convert datetime-local format (YYYY-MM-DDTHH:mm) to backend format (Y-m-d H:i:s)
    const formatDateTime = (dateTimeStr: string) => {
      if (!dateTimeStr) return '';
      return dateTimeStr.replace('T', ' ') + ':00';
    };

    const payload = {
      type: values.type,
      staff_profile_id: values.type === 'staff' ? values.staff_profile_id : undefined,
      service_id: values.type === 'service' ? values.service_id : undefined,
      type_service_id: values.type === 'service' ? values.type_service_id : undefined,
      start_datetime: formatDateTime(values.start_datetime),
      end_datetime: formatDateTime(values.end_datetime),
      reason: values.reason,
      description: values.description,
      is_active: true,
    };

    http
      .post(apiRoutes.adminBlockedTimeSlots, payload)
      .then(() => {
        toast({
          title: t('blockedSlots.createSuccess', 'Blocked Slot Created'),
          description: t('blockedSlots.createSuccessDesc', 'Blocked time slot has been created successfully'),
        });
        navigate(webRoutes.blockedSlots.index);
      })
      .catch((error) => {
        handleErrorResponse(error);
      });
  };

  const formGroups: MagicFormGroupProps[] = [
    {
      group: t('blockedSlots.blockDetails', 'Block Details'),
      layout: {
        type: 'grid',
        columns: 2,
      },
      fields: [
        {
          name: 'type',
          label: t('blockedSlots.blockType', 'Block Type'),
          type: 'select',
          required: true,
          options: [
            { value: 'staff', name: t('blockedSlots.typeStaff', 'Staff') },
            { value: 'service', name: t('blockedSlots.typeService', 'Service') },
            { value: 'type_service', name: t('blockedSlots.typeService', 'Service Type') },
            { value: 'facility', name: t('blockedSlots.typeFacility', 'Facility') },
          ],
          placeholder: t('blockedSlots.selectType', 'Select block type'),
        },
        {
          name: 'staff_profile_id',
          label: t('blockedSlots.staffMember', 'Staff Member'),
          type: 'select',
          required: false,
          disabled: isLoadingStaff,
          options: staffMembers?.map((staff: any) => {
            const firstName = staff.user?.first_name || '';
            const lastName = staff.user?.last_name || '';
            const fullName = [firstName, lastName].filter(Boolean).join(' ') || staff.user?.email || 'N/A';
            return {
              value: staff.id.toString(),
              name: fullName,
            };
          }) || [],
          placeholder: isLoadingStaff ? 'Loading...' : t('blockedSlots.selectStaff', 'Select staff member'),
          condition: (values) => values.type === 'staff',
        },
        {
          name: 'type_service_id',
          label: t('blockedSlots.serviceType', 'Service Type'),
          type: 'select',
          required: false,
          disabled: isLoadingServiceTypes,
          options: serviceTypes?.map((type: any) => ({
            value: type.id.toString(),
            name: type.name?.en || type.name?.fr || type.name || 'N/A',
          })) || [],
          placeholder: isLoadingServiceTypes ? 'Loading...' : t('blockedSlots.selectServiceType', 'Select service type'),
          condition: (values) => values.type === 'service',
        },
        {
          name: 'service_id',
          label: t('blockedSlots.service', 'Service'),
          type: 'select',
          required: false,
          disabled: isLoadingServices,
          options: services?.map((service: any) => ({
            value: service.id.toString(),
            name: typeof service.name === 'string' ? service.name : service.name?.en || service.name?.fr || 'N/A',
          })) || [],
          placeholder: isLoadingServices ? 'Loading...' : t('blockedSlots.selectService', 'Select service'),
          condition: (values) => values.type === 'service',
        },
      ],
    },
    {
      group: t('blockedSlots.dateTimeInfo', 'Date & Time'),
      layout: {
        type: 'grid',
        columns: 2,
      },
      fields: [
        {
          name: 'start_datetime',
          label: t('blockedSlots.startDateTime', 'Start Date & Time'),
          type: 'datetime-local',
          required: true,
          placeholder: 'YYYY-MM-DD HH:mm',
        },
        {
          name: 'end_datetime',
          label: t('blockedSlots.endDateTime', 'End Date & Time'),
          type: 'datetime-local',
          required: true,
          placeholder: 'YYYY-MM-DD HH:mm',
        },
      ],
    },
    {
      group: t('blockedSlots.additionalInfo', 'Additional Information'),
      layout: {
        type: 'grid',
        columns: 1,
      },
      fields: [
        {
          name: 'reason',
          label: t('blockedSlots.reason', 'Reason'),
          type: 'select',
          required: false,
          options: [
            { value: 'sick_leave', name: t('blockedSlots.reasonSickLeave', 'Sick Leave') },
            { value: 'maintenance', name: t('blockedSlots.reasonMaintenance', 'Maintenance') },
            { value: 'reserved_event', name: t('blockedSlots.reasonReservedEvent', 'Reserved Event') },
            { value: 'holiday', name: t('blockedSlots.reasonHoliday', 'Holiday') },
            { value: 'training', name: t('blockedSlots.reasonTraining', 'Training') },
            { value: 'urgent_closure', name: t('blockedSlots.reasonUrgentClosure', 'Urgent Closure') },
          ],
          placeholder: t('blockedSlots.selectReason', 'Select reason'),
        },
        {
          name: 'description',
          label: t('blockedSlots.description', 'Description'),
          type: 'textarea',
          required: false,
          placeholder: t('blockedSlots.descriptionPlaceholder', 'Enter any additional details...'),
        },
      ],
    },
  ];

  return (
    <Layout
      title={t('blockedSlots.addBlockedSlot', 'Add Blocked Time Slot')}
 
    >
      <MagicForm
        fields={formGroups}
        title=''
        onSubmit={handleSubmit}
        button={t('blockedSlots.create', 'Create Blocked Slot')}
      />
    </Layout>
  );
}
