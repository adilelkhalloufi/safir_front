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
import { IconArrowLeft, IconEdit, IconLoader2, IconMail, IconPhone } from '@tabler/icons-react';

export default function ViewStaff() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: staff, isLoading } = useQuery({
    queryKey: ['staff', id],
    queryFn: () => http.get(apiRoutes.adminStaffById(Number(id))),
    enabled: !!id,
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; label: string }> = {
      active: { variant: 'success', label: 'Active' },
      inactive: { variant: 'secondary', label: 'Inactive' },
    };
    const statusInfo = statusMap[status] || statusMap.active;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, string> = {
      massage: t('staff.types.massage'),
      hammam: t('staff.types.hammam'),
      coiffure: t('staff.types.coiffure'),
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

  const staffData = staff?.data;

  return (
    <Layout>
      <Layout.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(webRoutes.staff.index)}
            >
              <IconArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{staffData?.name}</h1>
              <p className="text-muted-foreground">{t('staff.subtitle')}</p>
            </div>
          </div>
          <Button onClick={() => navigate(webRoutes.staff.edit.replace(':id', id!))}>
            <IconEdit className="mr-2 h-4 w-4" />
            {t('common.edit')}
          </Button>
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('staff.title')}</CardTitle>
              <CardDescription>{t('common.view')} {staffData?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-base mt-1">{staffData?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Staff Type</p>
                  <div className="mt-1">{getTypeBadge(staffData?.type)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2 mt-1">
                    <IconMail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">{staffData?.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <div className="flex items-center gap-2 mt-1">
                    <IconPhone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base">{staffData?.phone || '-'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(staffData?.status)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout.Body>
    </Layout>
  );
}
