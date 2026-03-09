import { GetCommunicationColumns } from './columns';
import { CommunicationsDataTable } from './data-table';
import { useEffect, useState } from 'react';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { setPageTitle } from '@/utils';
import { Communication, CommunicationStatistics } from '@/interfaces/models/communication';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconMail, IconMessage, IconSend, IconCheck, IconX, IconActivity } from '@tabler/icons-react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

export default function CommunicationsIndex() {
  const { t } = useTranslation();
  const [data, setData] = useState<Communication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statistics, setStatistics] = useState<CommunicationStatistics | null>(null);
  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    communication: Communication | null;
  }>({
    open: false,
    communication: null,
  });

  useEffect(() => {
    setPageTitle(t('communications.title', 'Communications'));
    fetchCommunications();
    fetchStatistics();
  }, [t]);

  const fetchCommunications = () => {
    setLoading(true);
    http
      .get(apiRoutes.adminCommunications)
      .then((res) => {
        setData(res.data.data.data || []);
      })
      .catch((error) => {
        toast({
          variant: 'destructive',
          title: t('common.error', 'Error'),
          description:
            error.response?.data?.message ||
            t('communications.error.fetch', 'Failed to fetch communications'),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchStatistics = () => {
    http
      .get(apiRoutes.adminCommunicationsStatistics, {
        params: { days: 30 },
      })
      .then((res) => {
        setStatistics(res.data.data);
      })
      .catch((error) => {
        console.error('Failed to fetch statistics:', error);
      });
  };

  const handleView = (communication: Communication) => {
    setViewDialog({ open: true, communication });
  };

  const columns = GetCommunicationColumns(t, handleView);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('communications.title', 'Communications')}
          </h1>
          <p className="text-muted-foreground">
            {t('communications.subtitle', 'View and manage communication history')}
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('communications.stats.total', 'Total')}
              </CardTitle>
              <IconActivity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.total}</div>
              <p className="text-xs text-muted-foreground">
                {t('communications.stats.last30days', 'Last 30 days')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('communications.stats.sent', 'Sent')}
              </CardTitle>
              <IconSend className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.sent}</div>
              <p className="text-xs text-muted-foreground">
                {statistics.total > 0
                  ? `${((statistics.sent / statistics.total) * 100).toFixed(1)}%`
                  : '0%'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('communications.stats.delivered', 'Delivered')}
              </CardTitle>
              <IconCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.delivered}</div>
              <p className="text-xs text-muted-foreground">
                {statistics.total > 0
                  ? `${((statistics.delivered / statistics.total) * 100).toFixed(1)}%`
                  : '0%'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('communications.stats.failed', 'Failed')}
              </CardTitle>
              <IconX className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.failed}</div>
              <p className="text-xs text-muted-foreground">
                {statistics.total > 0
                  ? `${((statistics.failed / statistics.total) * 100).toFixed(1)}%`
                  : '0%'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('communications.stats.byChannel', 'By Channel')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <IconMail size={14} className="text-blue-500" />
                    <span>{t('communications.channel.email', 'Email')}</span>
                  </div>
                  <span className="font-semibold">{statistics.by_channel.email}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <IconMessage size={14} className="text-green-500" />
                    <span>{t('communications.channel.sms', 'SMS')}</span>
                  </div>
                  <span className="font-semibold">{statistics.by_channel.sms}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t('communications.list', 'Communication History')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CommunicationsDataTable columns={columns} data={data} loading={loading} />
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog
        open={viewDialog.open}
        onOpenChange={(open) => setViewDialog({ open, communication: null })}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t('communications.view.title', 'Communication Details')}
            </DialogTitle>
            <DialogDescription>
              #{viewDialog.communication?.id}
            </DialogDescription>
          </DialogHeader>
          {viewDialog.communication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('communications.view.booking', 'Booking ID')}
                  </label>
                  <p className="mt-1 font-medium">
                    #{viewDialog.communication.booking_id}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('communications.view.channel', 'Channel')}
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    {viewDialog.communication.channel === 'email' ? (
                      <IconMail size={16} className="text-blue-500" />
                    ) : (
                      <IconMessage size={16} className="text-green-500" />
                    )}
                    <span className="capitalize font-medium">
                      {viewDialog.communication.channel}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('communications.view.to', 'To')}
                  </label>
                  <p className="mt-1 font-medium">{viewDialog.communication.to}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('communications.view.status', 'Status')}
                  </label>
                  <p className="mt-1 font-medium capitalize">
                    {viewDialog.communication.status}
                  </p>
                </div>
              </div>

              {viewDialog.communication.subject && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('communications.view.subject', 'Subject')}
                    </label>
                    <p className="mt-1">{viewDialog.communication.subject}</p>
                  </div>
                </>
              )}

              {viewDialog.communication.error_message && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-red-600">
                      {t('communications.view.error', 'Error Message')}
                    </label>
                    <p className="mt-1 text-red-600">
                      {viewDialog.communication.error_message}
                    </p>
                  </div>
                </>
              )}

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                {viewDialog.communication.sent_at && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('communications.view.sent_at', 'Sent At')}
                    </label>
                    <p className="mt-1">
                      {format(
                        new Date(viewDialog.communication.sent_at),
                        'MMM dd, yyyy HH:mm:ss'
                      )}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('communications.view.created_at', 'Created At')}
                  </label>
                  <p className="mt-1">
                    {format(
                      new Date(viewDialog.communication.created_at),
                      'MMM dd, yyyy HH:mm:ss'
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
