import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { LayoutSh as Layout } from '@/components/custom/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { IconArrowLeft, IconEdit, IconLoader2, IconSettings } from '@tabler/icons-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ViewResource() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: resource, isLoading } = useQuery({
    queryKey: ['resource', id],
    queryFn: () => http.get(apiRoutes.adminResourceById(Number(id))),
    enabled: !!id,
  });

  const statusMutation = useMutation({
    mutationFn: ({ status }: { status: string }) => 
      http.put(apiRoutes.adminResourceStatus(Number(id)), { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource', id] });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast({
        title: t('resources.statusUpdateSuccess'),
        description: t('resources.statusUpdateSuccessDesc'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('resources.statusUpdateError'),
        description: error?.message || t('resources.statusUpdateErrorDesc'),
        variant: 'destructive',
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; label: string }> = {
      active: { variant: 'success', label: t('resources.statusActive') },
      maintenance: { variant: 'warning', label: t('resources.statusMaintenance') },
      inactive: { variant: 'secondary', label: t('resources.statusInactive') },
    };
    const statusInfo = statusMap[status] || statusMap.active;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, string> = {
      room: t('resources.typeRoom'),
      chair: t('resources.typeChair'),
      wash_station: t('resources.typeWashStation'),
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

  const resourceData = resource?.data;

  return (
    <Layout>
      <Layout.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(webRoutes.resources.index)}
            >
              <IconArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{resourceData?.name}</h1>
              <p className="text-muted-foreground">{t('resources.subtitle')}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {resourceData?.status === 'active' && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={statusMutation.isPending}>
                    <IconSettings className="mr-2 h-4 w-4" />
                    {t('resources.setMaintenance')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('resources.setMaintenance')}</DialogTitle>
                    <DialogDescription>
                      {t('resources.maintenanceConfirmation')}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {}}>{t('common.cancel')}</Button>
                    <Button onClick={() => statusMutation.mutate({ status: 'maintenance' })}>
                      {t('common.save')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            {resourceData?.status === 'maintenance' && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={statusMutation.isPending}>
                    <IconSettings className="mr-2 h-4 w-4" />
                    {t('resources.activateResource')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('resources.activateResource')}</DialogTitle>
                    <DialogDescription>
                      {t('resources.activateConfirmation')}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {}}>{t('common.cancel')}</Button>
                    <Button onClick={() => statusMutation.mutate({ status: 'active' })}>
                      {t('common.save')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            <Button onClick={() => navigate(webRoutes.resources.edit.replace(':id', id!))}>
              <IconEdit className="mr-2 h-4 w-4" />
              {t('common.edit')}
            </Button>
          </div>
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('resources.title')}</CardTitle>
              <CardDescription>{t('common.view')} {resourceData?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('resources.resourceName')}</p>
                  <p className="text-base mt-1">{resourceData?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('resources.resourceType')}</p>
                  <div className="mt-1">{getTypeBadge(resourceData?.type)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('resources.capacity')}</p>
                  <p className="text-base mt-1">{resourceData?.capacity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('resources.location')}</p>
                  <p className="text-base mt-1">{resourceData?.location || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('resources.status')}</p>
                  <div className="mt-1">{getStatusBadge(resourceData?.status)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout.Body>
    </Layout>
  );
}
