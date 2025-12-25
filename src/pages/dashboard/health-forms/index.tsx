import { GetHealthFormColumns, HealthForm } from './columns';
import { HealthFormsDataTable } from './data-table';
import { useEffect, useMemo, useState } from 'react';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { webRoutes } from '@/routes/web';
import { useTranslation } from 'react-i18next';
import { setPageTitle } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconClipboardCheck, IconAlertCircle, IconCheckbox } from '@tabler/icons-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HealthFormStats {
  total_pending: number;
  total_approved: number;
  needs_update: number;
}

export default function HealthFormsIndex() {
  const { t } = useTranslation();
  const [data, setData] = useState<HealthForm[]>([]);
  const [stats, setStats] = useState<HealthFormStats>({
    total_pending: 0,
    total_approved: 0,
    needs_update: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean;
    form: HealthForm | null;
    action: 'approve' | 'reject' | null;
  }>({
    open: false,
    form: null,
    action: null,
  });
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    setPageTitle(t('healthForms.title', 'Health Forms Management'));
    fetchHealthForms();
  }, [t]);

  const fetchHealthForms = () => {
    setLoading(true);
    http
      .get(apiRoutes.adminHealthForms)
      .then((res) => {
        setData(res.data.forms || res.data);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: t('healthForms.fetchError', 'Failed to fetch health forms'),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleView = (form: HealthForm) => {
    navigate(webRoutes.healthForms.view.replace(':id', form.id.toString()));
  };

  const handleApproveOpen = (form: HealthForm) => {
    setReviewDialog({ open: true, form, action: 'approve' });
    setReviewNotes('');
  };

  const handleRejectOpen = (form: HealthForm) => {
    setReviewDialog({ open: true, form, action: 'reject' });
    setReviewNotes('');
  };

  const handleReviewConfirm = () => {
    if (!reviewDialog.form || !reviewDialog.action) return;

    const payload = {
      status: reviewDialog.action === 'approve' ? 'approved' : 'needs-update',
      notes: reviewNotes,
    };

    http
      .post(apiRoutes.adminHealthFormReview(reviewDialog.form.id), payload)
      .then(() => {
        toast({
          title: t('common.success'),
          description:
            reviewDialog.action === 'approve'
              ? t('healthForms.approveSuccess', 'Health form approved')
              : t('healthForms.rejectSuccess', 'Update requested'),
        });
        fetchHealthForms();
        setReviewDialog({ open: false, form: null, action: null });
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: t('healthForms.reviewError', 'Failed to review health form'),
        });
      });
  };

  const columns = useMemo(
    () =>
      GetHealthFormColumns({
        onView: handleView,
        onApprove: handleApproveOpen,
        onReject: handleRejectOpen,
      }),
    [t]
  );

  return (
    <>
      <div className='mb-4 flex w-full items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>{t('healthForms.title', 'Health Forms Management')}</h1>
          <p className='text-muted-foreground'>
            {t('healthForms.subtitle', 'Review and approve medical questionnaires')}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 sm:grid-cols-3 mb-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              {t('healthForms.pendingReview', 'Pending Review')}
            </CardTitle>
            <IconAlertCircle className='h-4 w-4 text-orange-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-orange-600'>{stats.total_pending}</div>
            <p className='text-xs text-muted-foreground'>
              {t('healthForms.awaitingAction', 'Awaiting your action')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              {t('healthForms.totalApproved', 'Approved')}
            </CardTitle>
            <IconCheckbox className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>{stats.total_approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              {t('healthForms.needsUpdate', 'Needs Update')}
            </CardTitle>
            <IconClipboardCheck className='h-4 w-4 text-red-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>{stats.needs_update}</div>
          </CardContent>
        </Card>
      </div>

      <HealthFormsDataTable columns={columns} data={data} loading={loading} />

      {/* Review Dialog */}
      <Dialog
        open={reviewDialog.open}
        onOpenChange={(open) => setReviewDialog({ open, form: null, action: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewDialog.action === 'approve'
                ? t('healthForms.approveTitle', 'Approve Health Form')
                : t('healthForms.rejectTitle', 'Request Update')}
            </DialogTitle>
            <DialogDescription>
              {reviewDialog.action === 'approve'
                ? t('healthForms.approveDescription', 'Approve this health form to allow bookings.')
                : t(
                    'healthForms.rejectDescription',
                    'Request the client to update their health form with more information.'
                  )}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            {reviewDialog.form && (
              <div className='space-y-2'>
                <div className='flex items-center justify-between rounded-lg border p-3'>
                  <div>
                    <div className='font-medium'>{reviewDialog.form.client_name}</div>
                    <div className='text-sm text-muted-foreground'>{reviewDialog.form.client_email}</div>
                  </div>
                  {reviewDialog.form.has_conditions && (
                    <Badge variant='outline' className='bg-orange-50 text-orange-700'>
                      Has Conditions
                    </Badge>
                  )}
                </div>
              </div>
            )}
            <div className='space-y-2'>
              <Label htmlFor='notes'>
                {t('healthForms.reviewNotes', 'Notes')} {reviewDialog.action === 'reject' && '(Required)'}
              </Label>
              <Textarea
                id='notes'
                placeholder={
                  reviewDialog.action === 'approve'
                    ? t('healthForms.notesPlaceholder', 'Add any internal notes...')
                    : t('healthForms.updatePlaceholder', 'Specify what needs to be updated...')
                }
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setReviewDialog({ open: false, form: null, action: null })}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant={reviewDialog.action === 'approve' ? 'default' : 'destructive'}
              onClick={handleReviewConfirm}
              disabled={reviewDialog.action === 'reject' && !reviewNotes.trim()}
            >
              {reviewDialog.action === 'approve'
                ? t('healthForms.confirmApprove', 'Approve Form')
                : t('healthForms.confirmReject', 'Request Update')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
