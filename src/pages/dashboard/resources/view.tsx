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
    queryFn: async () => {
      const response = await http.get(apiRoutes.adminResourceById(Number(id)));
      return response.data.data;
    },
    enabled: !!id,
  });

  const statusMutation = useMutation({
    mutationFn: ({ is_active }: { is_active: boolean }) => 
      http.put(apiRoutes.adminResourceById(Number(id)), { is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource', id] });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast({
        title: t('resources.statusUpdateSuccess', 'Status updated'),
        description: t('resources.statusUpdateSuccessDesc', 'The resource status has been updated.'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('resources.statusUpdateError', 'Error'),
        description: error?.message || t('resources.statusUpdateErrorDesc', 'Failed to update status.'),
        variant: 'destructive',
      });
    },
  });

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

  const resourceData = resource;

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
              <h1 className="text-2xl font-bold tracking-tight">{resourceData?.name?.fr} | {resourceData?.name?.en}</h1>
              <p className="text-muted-foreground">{t('resources.subtitle', 'Resource details')}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {resourceData?.is_active && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={statusMutation.isPending}>
                    <IconSettings className="mr-2 h-4 w-4" />
                    {t('resources.deactivate', 'Deactivate')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('resources.deactivate', 'Deactivate')}</DialogTitle>
                    <DialogDescription>
                      {t('resources.deactivateConfirmation', 'Are you sure you want to deactivate this resource?')}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {}}>{t('common.cancel', 'Cancel')}</Button>
                    <Button onClick={() => statusMutation.mutate({ is_active: false })}>
                      {t('common.confirm', 'Confirm')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            {!resourceData?.is_active && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={statusMutation.isPending}>
                    <IconSettings className="mr-2 h-4 w-4" />
                    {t('resources.activate', 'Activate')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('resources.activate', 'Activate')}</DialogTitle>
                    <DialogDescription>
                      {t('resources.activateConfirmation', 'Are you sure you want to activate this resource?')}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {}}>{t('common.cancel', 'Cancel')}</Button>
                    <Button onClick={() => statusMutation.mutate({ is_active: true })}>
                      {t('common.confirm', 'Confirm')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            <Button onClick={() => navigate(webRoutes.resources.edit.replace(':id', id!))}>
              <IconEdit className="mr-2 h-4 w-4" />
              {t('common.edit', 'Edit')}
            </Button>
          </div>
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('resources.title', 'Resource')}</CardTitle>
              <CardDescription>{t('common.view', 'View')} {resourceData?.name?.fr}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('resources.nameFr', 'Name (French)')}</p>
                  <p className="text-base mt-1">{resourceData?.name?.fr}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('resources.nameEn', 'Name (English)')}</p>
                  <p className="text-base mt-1">{resourceData?.name?.en}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('resources.descriptionFr', 'Description (French)')}</p>
                  <p className="text-base mt-1">{resourceData?.description?.fr || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('resources.descriptionEn', 'Description (English)')}</p>
                  <p className="text-base mt-1">{resourceData?.description?.en || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('resources.typeResource', 'Type Resource')}</p>
                  <p className="text-base mt-1">{resourceData?.type_resource?.name?.fr || resourceData?.type_resource?.name?.en || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('resources.capacity', 'Capacity')}</p>
                  <p className="text-base mt-1">{resourceData?.capacity ?? '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('resources.location', 'Location')}</p>
                  <p className="text-base mt-1">{resourceData?.location || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('resources.isAvailable', 'Available')}</p>
                  <div className="mt-1">
                    <Badge variant={resourceData?.is_available ? 'default' : 'secondary'}>
                      {resourceData?.is_available ? t('common.yes', 'Yes') : t('common.no', 'No')}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('resources.status', 'Status')}</p>
                  <div className="mt-1">
                    <Badge variant={resourceData?.is_active ? 'default' : 'secondary'}>
                      {resourceData?.is_active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout.Body>
    </Layout>
  );
}
