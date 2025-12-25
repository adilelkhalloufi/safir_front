import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ServicesDataTable } from './data-table';
import { Service, GetServiceColumns } from './columns';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';

export default function ServicesPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'massage' as 'massage' | 'hammam' | 'coiffure',
    duration: 60,
    price: 0,
    description: '',
    status: 'active' as 'active' | 'inactive',
  });

  // Fetch services
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: () => http.get(apiRoutes.adminServices),
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

  // Add/Edit service mutation
  const saveServiceMutation = useMutation({
    mutationFn: (data: typeof formData & { id?: number }) => {
      if (data.id) {
        return http.put(apiRoutes.adminServiceById(data.id), data);
      }
      return http.post(apiRoutes.adminServices, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: t(
          selectedService ? 'services.updateSuccess' : 'services.createSuccess',
          selectedService ? 'Service updated successfully' : 'Service created successfully'
        ),
        description: t(
          selectedService ? 'services.updateSuccessDesc' : 'services.createSuccessDesc',
          selectedService ? 'Service details have been updated.' : 'New service has been added to the system.'
        ),
      });
      setIsAddEditDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: t('services.saveError', 'Error'),
        description: t('services.saveErrorDesc', 'Failed to save service. Please try again.'),
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'massage',
      duration: 60,
      price: 0,
      description: '',
      status: 'active',
    });
    setSelectedService(null);
  };

  const handleView = (service: Service) => {
    // TODO: Navigate to service details page or show details dialog
    console.log('View service:', service);
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      type: service.type,
      duration: service.duration,
      price: service.price,
      description: '',
      status: service.status,
    });
    setIsAddEditDialogOpen(true);
  };

  const handleDelete = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleAddNew = () => {
    resetForm();
    setIsAddEditDialogOpen(true);
  };

  const handleSaveService = () => {
    saveServiceMutation.mutate(
      selectedService ? { ...formData, id: selectedService.id } : formData
    );
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
      <div className='grid gap-4 md:grid-cols-4'>
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
            <div className='text-2xl font-bold'>{services.filter((s) => s.status === 'active').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('services.totalBookings', 'Total Bookings')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {services.reduce((sum, service) => sum + service.total_bookings, 0)}
            </div>
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
                ? (services.reduce((sum, service) => sum + service.price, 0) / services.length).toFixed(2)
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

      {/* Add/Edit Service Dialog */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>
              {selectedService
                ? t('services.editService', 'Edit Service')
                : t('services.addService', 'Add New Service')}
            </DialogTitle>
            <DialogDescription>
              {t(
                'services.addEditDescription',
                'Fill in the service details below. Click save when you are done.'
              )}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>{t('services.serviceName', 'Service Name')}</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('services.serviceNamePlaceholder', 'e.g. Swedish Massage')}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='type'>{t('services.serviceType', 'Service Type')}</Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'massage' | 'hammam' | 'coiffure') =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='massage'>{t('services.typeMassage', 'Massage')}</SelectItem>
                  <SelectItem value='hammam'>{t('services.typeHammam', 'Hammam')}</SelectItem>
                  <SelectItem value='coiffure'>{t('services.typeCoiffure', 'Hair Salon')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='duration'>{t('services.duration', 'Duration (minutes)')}</Label>
                <Input
                  id='duration'
                  type='number'
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='price'>{t('services.price', 'Price (€)')}</Label>
                <Input
                  id='price'
                  type='number'
                  step='0.01'
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='description'>{t('services.description', 'Description')}</Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('services.descriptionPlaceholder', 'Describe the service...')}
                rows={3}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='status'>{t('services.status', 'Status')}</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='active'>{t('services.statusActive', 'Active')}</SelectItem>
                  <SelectItem value='inactive'>{t('services.statusInactive', 'Inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsAddEditDialogOpen(false)}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button onClick={handleSaveService} disabled={saveServiceMutation.isPending}>
              {saveServiceMutation.isPending
                ? t('common.saving', 'Saving...')
                : t('common.save', 'Save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              onClick={() => selectedService && deleteMutation.mutate(selectedService.id)}
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
