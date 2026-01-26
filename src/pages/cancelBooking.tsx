import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiRoutes } from '@/routes/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import http from '@/utils/http';
import HeaderBooking from './landing/booking/HeaderBooking';

const CancelBooking = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const cancelMutation = useMutation({
    mutationFn: () => http.get(apiRoutes.cancelGuestBooking(id!)),
   
  });

  const handleCancel = () => {
    if (id) {
      cancelMutation.mutate();
    }
  };

  let content;
  if (cancelMutation.isSuccess) {
    const data = cancelMutation.data?.data;
    if (data?.status === 'cancelled') {
      content = (
        <div className="container mx-auto p-4 mt-28">
          <Card>
            <CardHeader>
              <CardTitle>{t('bookings.cancel.successTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  {t('bookings.cancel.successMessage')}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      );
    }
  } else if (cancelMutation.isError) {
    const error = cancelMutation.error as any;
    const message = error?.response?.data?.message || t('bookings.cancel.errorMessage');
    content = (
      <div className="container mx-auto p-4 mt-28">
        <Card>
          <CardHeader>
            <CardTitle>{t('bookings.cancel.errorTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>
                {message}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  } else {
    content = (
      <div className="container mx-auto p-4 mt-28">
        <Card>
          <CardHeader>
            <CardTitle>{t('bookings.cancel.confirmTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {t('bookings.cancel.confirmMessage')}
            </p>
            <Button
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
              variant="destructive"
            >
              {cancelMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('bookings.cancel.cancelling')}
                </>
              ) : (
                t('bookings.cancel.confirmButton')
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <HeaderBooking />
      {content}
    </>
  );
};

export default CancelBooking;
