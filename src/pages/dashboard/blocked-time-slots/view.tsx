import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  IconArrowLeft,
  IconEdit,
  IconCalendar,
  IconClock,
  IconAlertCircle,
} from '@tabler/icons-react';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import ViewLoading from '@/components/skeleton/ViewLoading';
import { BlockedTimeSlot, BlockedSlotReason } from '@/interfaces/models/blockedTimeSlot';

const reasonMap: Record<BlockedSlotReason, string> = {
  sick_leave: 'Sick Leave',
  maintenance: 'Maintenance',
  reserved_event: 'Reserved Event',
  holiday: 'Holiday',
  training: 'Training',
  urgent_closure: 'Urgent Closure',
};

const typeMap: Record<string, string> = {
  staff: 'Staff',
  service: 'Service',
  facility: 'Facility',
};

const formatDateTime = (dateTimeStr: string): string => {
  try {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateTimeStr;
  }
};

export default function ViewBlockedTimeSlot() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: slot, isLoading } = useQuery({
    queryKey: ['blockedSlot', id],
    queryFn: () =>
      http
        .get<{ data: BlockedTimeSlot }>(`${apiRoutes.adminBlockedTimeSlots}/${id}`)
        .then((res) => res.data?.data),
    enabled: !!id,
  });

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(webRoutes.blockedSlots.index)}
          >
            <IconArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isLoading
                ? t('common.loading', 'Loading...')
                : `Blocked ${typeMap[slot?.type || 'staff']}`}
            </h1>
            <p className="text-muted-foreground">
              {t('blockedSlots.subtitle', 'Blocked Time Slot Details')}
            </p>
          </div>
        </div>
        {!isLoading && (
          <Button
            onClick={() =>
              navigate(webRoutes.blockedSlots.edit.replace(':id', id!))
            }
          >
            <IconEdit className="mr-2 h-4 w-4" />
            {t('common.edit', 'Edit')}
          </Button>
        )}
      </div>
      {isLoading ? (
        <ViewLoading />
      ) : (
        <div className="mt-6 grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('blockedSlots.blockDetails', 'Block Details')}</CardTitle>
              <CardDescription>
                {t('blockedSlots.blockDetailsDesc', 'Information about this blocked time slot')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('blockedSlots.blockType', 'Block Type')}
                  </label>
                  <div className="mt-1">
                    <Badge variant="outline">
                      {typeMap[slot?.type || 'staff']}
                    </Badge>
                  </div>
                </div>

                {slot?.type === 'staff' && slot?.staff_profile && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('blockedSlots.staffMember', 'Staff Member')}
                    </label>
                    <div className="mt-1 text-sm font-medium">
                      {slot.staff_profile.name}
                      {slot.staff_profile.specialization && (
                        <div className="text-xs text-muted-foreground">
                          {slot.staff_profile.specialization}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {slot?.type === 'service' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        {t('blockedSlots.serviceType', 'Service Type')}
                      </label>
                      <div className="mt-1 text-sm font-medium">
                        {slot?.type_service ? (
                          slot.type_service.name_en || slot.type_service.name_fr || 'N/A'
                        ) : (
                          'N/A'
                        )}
                      </div>
                    </div>
                    {slot?.service && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          {t('blockedSlots.service', 'Service')}
                        </label>
                        <div className="mt-1 text-sm font-medium">
                          {typeof slot.service.name === 'string'
                            ? slot.service.name
                            : slot.service.name?.en || slot.service.name?.fr || 'N/A'}
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('blockedSlots.status', 'Status')}
                  </label>
                  <div className="mt-1">
                    <Badge variant={slot?.is_active ? 'default' : 'secondary'}>
                      {slot?.is_active ? t('blockedSlots.statusActive', 'Active') : t('blockedSlots.statusInactive', 'Inactive')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCalendar className="h-4 w-4" />
                {t('blockedSlots.dateTimeInfo', 'Date & Time')}
              </CardTitle>
              <CardDescription>
                {t('blockedSlots.blockPeriod', 'When this period is blocked')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('blockedSlots.startDateTime', 'Start Date & Time')}
                  </label>
                  <div className="mt-1 flex items-center gap-2 text-sm font-medium">
                    <IconClock className="h-4 w-4" />
                    {formatDateTime(slot?.start_datetime || '')}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('blockedSlots.endDateTime', 'End Date & Time')}
                  </label>
                  <div className="mt-1 flex items-center gap-2 text-sm font-medium">
                    <IconClock className="h-4 w-4" />
                    {formatDateTime(slot?.end_datetime || '')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {(slot?.reason || slot?.description) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconAlertCircle className="h-4 w-4" />
                  {t('blockedSlots.additionalInfo', 'Additional Information')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {slot?.reason && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('blockedSlots.reason', 'Reason')}
                    </label>
                    <div className="mt-1">
                      <Badge variant="secondary">
                        {reasonMap[slot.reason as BlockedSlotReason] || slot.reason}
                      </Badge>
                    </div>
                  </div>
                )}

                {slot?.description && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('blockedSlots.description', 'Description')}
                    </label>
                    <div className="mt-1 rounded-md bg-muted p-3 text-sm">
                      {slot.description}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {slot?.created_by && (
            <Card>
              <CardHeader>
                <CardTitle>{t('blockedSlots.metadata', 'Metadata')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('blockedSlots.createdBy', 'Created By')}
                  </span>
                  <span className="font-medium">{slot.created_by.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('blockedSlots.createdAt', 'Created At')}
                  </span>
                  <span className="font-medium">{formatDateTime(slot.created_at)}</span>
                </div>
                {slot.updated_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t('blockedSlots.updatedAt', 'Updated At')}
                    </span>
                    <span className="font-medium">{formatDateTime(slot.updated_at)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
