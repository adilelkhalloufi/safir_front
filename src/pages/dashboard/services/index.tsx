import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ServicesDataTable } from './data-table';
import { GetServiceColumns } from './columns';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Service } from '@/interfaces/models';
import { useNavigate } from 'react-router-dom';

export default function ServicesPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Fetch services
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: () => http.get(apiRoutes.adminServices).then(res => Array.isArray(res.data?.data) ? res.data?.data : []),
  });



  // Delete service mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => http.delete(apiRoutes.adminServiceById(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: t('services.deleteSuccess', 'Service deleted successfully'),
        description: t('services.deleteSuccessDesc', 'The service has been removed from the system.'),
      });
      setIsDeleteDialogOpen(false);
      setSelectedService(null);
    },
    onError: () => {
      toast({
        title: t('services.deleteError', 'Error'),
        description: t('services.deleteErrorDesc', 'Failed to delete service. Please try again.'),
        variant: 'destructive',
      });
    },
  });

  const handleView = (service: Service) => {
    navigate(webRoutes.services.view.replace(':id', service.id!.toString()));
  };

  const handleEdit = (service: Service) => {
    navigate(webRoutes.services.edit.replace(':id', service.id!.toString()));
  };

  const handleDelete = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleAddNew = () => {
    navigate(webRoutes.services.add);
  };

  const columns = GetServiceColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='text-lg'>{t('common.loading', 'Loading...')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>{t('services.title', 'Services Management')}</h2>
          <p className='text-muted-foreground'>
            {t('services.subtitle', 'Manage your massage, hammam and hair salon services')}
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className='mr-2 h-4 w-4' />
          {t('services.addNew', 'Add Service')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('services.totalServices', 'Total Services')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{services.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('services.activeServices', 'Active Services')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{services.filter((s) => s.is_active).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('services.avgPrice', 'Avg. Price')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              €
              {services.length > 0
                ? (services.reduce((sum, service) => {
                  const price = typeof service.price === 'string' ? parseFloat(service.price) : (service.price || 0);
                  return sum + price;
                }, 0) / services.length).toFixed(2)
                : '0.00'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('services.servicesList', 'Services List')}</CardTitle>
          <CardDescription>
            {t('services.servicesListDesc', 'View and manage all available services')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServicesDataTable columns={columns} data={services} />
        </CardContent>
      </Card>


      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('services.deleteService', 'Delete Service')}</DialogTitle>
            <DialogDescription>
              {t(
                'services.deleteConfirmation',
                'Are you sure you want to delete this service? This action cannot be undone.'
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsDeleteDialogOpen(false)}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              variant='destructive'
              onClick={() => selectedService?.id && deleteMutation.mutate(selectedService.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? t('common.deleting', 'Deleting...') : t('common.delete', 'Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
