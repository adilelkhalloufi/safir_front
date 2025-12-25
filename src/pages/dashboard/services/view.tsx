import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { LayoutSh as Layout } from '@/components/custom/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { IconArrowLeft, IconEdit, IconLoader2, IconClock, IconCurrencyEuro } from '@tabler/icons-react';

export default function ViewService() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () => http.get(apiRoutes.adminServiceById(Number(id))),
    enabled: !!id,
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; label: string }> = {
      active: { variant: 'success', label: t('services.statusActive') },
      inactive: { variant: 'secondary', label: t('services.statusInactive') },
    };
    const statusInfo = statusMap[status] || statusMap.active;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, string> = {
      massage: t('services.typeMassage'),
      hammam: t('services.typeHammam'),
      coiffure: t('services.typeCoiffure'),
    };
    return <Badge variant="outline">{typeMap[type] || type}</Badge>;
  };

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

  const serviceData = service?.data;

  return (
    <Layout>
      <Layout.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(webRoutes.services.index)}
            >
              <IconArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{serviceData?.name}</h1>
              <p className="text-muted-foreground">{t('services.subtitle')}</p>
            </div>
          </div>
          <Button onClick={() => navigate(webRoutes.services.edit.replace(':id', id!))}>
            <IconEdit className="mr-2 h-4 w-4" />
            {t('common.edit')}
          </Button>
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('services.title')}</CardTitle>
              <CardDescription>{t('common.view')} {serviceData?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('services.serviceName')}</p>
                  <p className="text-base mt-1">{serviceData?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('services.serviceType')}</p>
                  <div className="mt-1">{getTypeBadge(serviceData?.type)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('services.duration')}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <IconClock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">{serviceData?.duration} {t('common.minutes')}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('services.price')}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <IconCurrencyEuro className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">{serviceData?.price}</p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">{t('services.description')}</p>
                  <p className="text-base mt-1">{serviceData?.description || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('services.status')}</p>
                  <div className="mt-1">{getStatusBadge(serviceData?.status)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout.Body>
    </Layout>
  );
}
