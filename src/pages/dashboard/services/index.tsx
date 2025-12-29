import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ServicesDataTable } from './data-table';
import {  GetServiceColumns } from './columns';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import MagicForm, { MagicFormGroupProps } from '@/components/custom/MagicForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Service } from '@/interfaces/models';
import { ServiceType } from '@/interfaces/models/serviceType';

export default function ServicesPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formInitialValues, setFormInitialValues] = useState<any>({});

  // MagicForm fields configuration
  const getFormFields = (): MagicFormGroupProps[] => [
    {
      group: selectedService ? t('services.editService', 'Edit Service') : t('services.addService', 'Add New Service'),
      fields: [
        {
          name: 'name_fr',
          label: t('services.serviceNameFr', 'Service Name (FR)'),
          type: 'text',
          required: true,
          placeholder: t('services.serviceNamePlaceholder', 'e.g. Massage Suédois'),
          width: 'half',
        },
        {
          name: 'name_en',
          label: t('services.serviceNameEn', 'Service Name (EN)'),
          type: 'text',
          required: true,
          placeholder: t('services.serviceNamePlaceholder', 'e.g. Swedish Massage'),
          width: 'half',
        },
        {
          name: 'type_service_id',
          label: t('services.serviceType', 'Service Type'),
          type: 'select',
          required: true,
          width: 'full',
          options: serviceTypes.map(type => ({
            value: type.id,
            name: `${type.name.fr} | ${type.name.en}`,
          })),
        },
        {
          name: 'duration_minutes',
          label: t('services.duration', 'Duration (minutes)'),
          type: 'number',
          required: true,
          width: 'half',
        },
        {
          name: 'price',
          label: t('services.price', 'Price (€)'),
          type: 'number',
          required: true,
          width: 'half',
        },
        {
          name: 'description_fr',
          label: t('services.descriptionFr', 'Description (FR)'),
          type: 'textarea',
          placeholder: t('services.descriptionPlaceholder', 'Décrivez le service...'),
          width: 'half',
        },
        {
          name: 'description_en',
          label: t('services.descriptionEn', 'Description (EN)'),
          type: 'textarea',
          placeholder: t('services.descriptionPlaceholder', 'Describe the service...'),
          width: 'half',
        },
        {
          name: 'is_active',
          label: t('services.status', 'Active Status'),
          type: 'checkbox',
          width: 'full',
        },
        {
          name: 'requires_room',
          label: t('services.requiresRoom', 'Requires Room'),
          type: 'checkbox',
          width: 'half',
        },
        {
          name: 'requires_chair',
          label: t('services.requiresChair', 'Requires Chair'),
          type: 'checkbox',
          width: 'half',
        },
        {
          name: 'requires_wash_station',
          label: t('services.requiresWashStation', 'Requires Wash Station'),
          type: 'checkbox',
          width: 'half',
        },
        {
          name: 'requires_hammam_session',
          label: t('services.requiresHammamSession', 'Requires Hammam Session'),
          type: 'checkbox',
          width: 'half',
        },
      ],
      position: { row: 0, column: 0, width: 'full' },
      layout: { type: 'grid', columns: 2 },
    },
  ];

  // Fetch services
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: () => http.get(apiRoutes.adminServices).then(res => res.data?.data),
  });

  // Fetch service types
  const { data: serviceTypes = [] } = useQuery<ServiceType[]>({
    queryKey: ['serviceTypes'],
    queryFn: () => http.get(apiRoutes.adminServiceTypes).then(res => res.data?.data),
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
    mutationFn: (data: any) => {
      if (selectedService?.id) {
        return http.put(apiRoutes.adminServiceById(selectedService.id), data);
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
      setSelectedService(null);
      setFormInitialValues({});
    },
    onError: () => {
      toast({
        title: t('services.saveError', 'Error'),
        description: t('services.saveErrorDesc', 'Failed to save service. Please try again.'),
        variant: 'destructive',
      });
    },
  });

  const handleView = (service: Service) => {
    // TODO: Navigate to service details page or show details dialog
    console.log('View service:', service);
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    const name = typeof service.name === 'string' ? { fr: service.name, en: service.name } : service.name || { fr: '', en: '' };
    const description = typeof service.description === 'string' ? { fr: service.description, en: service.description } : service.description || { fr: '', en: '' };
    
    setFormInitialValues({
      name_fr: name.fr || '',
      name_en: name.en || '',
      type_service_id: (service as any).type?.id || (service as any).type_service_id || '',
      duration_minutes: service.duration_minutes || service.duration || 60,
      price: typeof service.price === 'string' ? parseFloat(service.price) : service.price,
      description_fr: description.fr || '',
      description_en: description.en || '',
      is_active: service.is_active ? 1 : 0,
      requires_room: (service.requires_room ? 1 : 0) || 0,
      requires_chair: (service.requires_chair ? 1 : 0) || 0,
      requires_wash_station: (service.requires_wash_station ? 1 : 0) || 0,
      requires_hammam_session: (service.requires_hammam_session ? 1 : 0) || 0,
    });
    setIsAddEditDialogOpen(true);
  };

  const handleDelete = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedService(null);
    setFormInitialValues({
      name_fr: '',
      name_en: '',
      type_service_id: '',
      duration_minutes: 60,
      price: 0,
      description_fr: '',
      description_en: '',
      is_active: 1,
      requires_room: 0,
      requires_chair: 0,
      requires_wash_station: 0,
      requires_hammam_session: 0,
    });
    setIsAddEditDialogOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    saveServiceMutation.mutate(data);
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

      {/* Add/Edit Service Dialog */}
      {isAddEditDialogOpen && (
        <MagicForm
          fields={getFormFields()}
          onSubmit={handleFormSubmit}
          initialValues={formInitialValues}
          loading={saveServiceMutation.isPending}
          modal={true}
          onClose={() => {
            setIsAddEditDialogOpen(false);
            setSelectedService(null);
            setFormInitialValues({});
          }}
          button={t('common.save', 'Save')}
        />
      )}

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
