import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { LayoutSh as Layout } from '@/components/custom/layout';
 import { useToast } from '@/components/ui/use-toast';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import {   IconLoader2 } from '@tabler/icons-react';
import { setPageTitle, handleErrorResponse } from '@/utils';
import MagicForm, { MagicFormGroupProps } from '@/components/custom/MagicForm';

export default function EditBlockedTimeSlot() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();

  useEffect(() => {
    setPageTitle(t('blockedSlots.editBlockedSlot', 'Edit Blocked Time Slot'));
  }, [t]);

  const { data: slotData, isLoading } = useQuery({
    queryKey: ['blockedSlot', id],
    queryFn: () => http.get(`${apiRoutes.adminBlockedTimeSlots}/${id}`),
    enabled: !!id,
  });

  // Fetch staff
  const { data: staffData } = useQuery({
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
  const { data: servicesData } = useQuery({
    queryKey: ['servicesForBlocking'],
    queryFn: () => http.get(apiRoutes.adminServices),
  });

  const services = servicesData?.data?.data || [];

  const slot = slotData?.data?.data || null;

  const initialValues = useMemo(() => {
    // Convert backend datetime format (Y-m-d H:i:s) to datetime-local format (YYYY-MM-DDTHH:mm)
    const formatDateTimeForInput = (dateTimeStr: string) => {
      if (!dateTimeStr) return '';
      return dateTimeStr.substring(0, 16).replace(' ', 'T');
    };

    if (!slot) {
      return {
        type: 'staff',
        staff_profile_id: '',
        service_id: '',
        start_datetime: '',
        end_datetime: '',
        reason: '',
        description: '',
        is_active: true,
      };
    }

    return {
      type: slot.type || 'staff',
      staff_profile_id: slot.staff_profile_id?.toString() || '',
      service_id: slot.service_id?.toString() || '',
      type_service_id: '',
      start_datetime: formatDateTimeForInput(slot.start_datetime) || '',
      end_datetime: formatDateTimeForInput(slot.end_datetime) || '',
      reason: slot.reason || '',
      description: slot.description || '',
      is_active: slot.is_active ?? true,
    };
  }, [slot]);

  const handleSubmit = (values: any) => {
    const payload = {
      reason: values.reason,
      description: values.description,
      is_active: values.is_active,
    };

    http
      .put(`${apiRoutes.adminBlockedTimeSlots}/${id}`, payload)
      .then(() => {
        toast({
          title: t('blockedSlots.updateSuccess', 'Blocked Slot Updated'),
          description: t('blockedSlots.updateSuccessDesc', 'Blocked time slot has been updated successfully'),
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
          disabled: true,
          options: [
            { value: 'staff', name: t('blockedSlots.typeStaff', 'Staff') },
            { value: 'service', name: t('blockedSlots.typeService', 'Service') },
                        { value: 'type_service', name: t('blockedSlots.typeService', 'Service Type') },

            { value: 'facility', name: t('blockedSlots.typeFacility', 'Facility') },
          ],
        },
        {
          name: 'staff_profile_id',
          label: t('blockedSlots.staffMember', 'Staff Member'),
          type: 'select',
          required: false,
          disabled: true,
          options: staffMembers?.map((staff: any) => {
            const firstName = staff.user?.first_name || '';
            const lastName = staff.user?.last_name || '';
            const fullName = [firstName, lastName].filter(Boolean).join(' ') || staff.user?.email || 'N/A';
            return {
              value: staff.id.toString(),
              name: fullName,
            };
          }) || [],
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
          disabled: true,
          options: services?.map((service: any) => ({
            value: service.id.toString(),
            name: typeof service.name === 'string' ? service.name : service.name?.en || service.name?.fr || 'N/A',
          })) || [],
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
          disabled: true,
        },
        {
          name: 'end_datetime',
          label: t('blockedSlots.endDateTime', 'End Date & Time'),
          type: 'datetime-local',
          required: true,
          disabled: true,
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
        },
        {
          name: 'description',
          label: t('blockedSlots.description', 'Description'),
          type: 'textarea',
          required: false,
          placeholder: t('blockedSlots.descriptionPlaceholder', 'Enter any additional details...'),
        },
        {
          name: 'is_active',
          label: t('blockedSlots.status', 'Status'),
          type: 'checkbox',
          required: false,
        },
      ],
    },
  ];

  if (isLoading) {
    return (
      <Layout title={t('blockedSlots.editBlockedSlot', 'Edit Blocked Time Slot')}>
        <div className="flex items-center justify-center py-12">
          <IconLoader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={t('blockedSlots.editBlockedSlot', 'Edit Blocked Time Slot')}
 
    >
      <MagicForm
        fields={formGroups}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        button={t('blockedSlots.update', 'Update Blocked Slot')}
      />
    </Layout>
  );
}
