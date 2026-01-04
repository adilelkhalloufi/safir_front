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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ResourcesDataTable } from './data-table';
import { Resource, GetResourceColumns } from './columns';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';

export default function ResourcesPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [statusAction, setStatusAction] = useState<'maintenance' | 'activate'>('maintenance');
  const [formData, setFormData] = useState({
    name: '',
    type: 'room' as 'room' | 'chair' | 'wash_station',
    capacity: 1,
    location: '',
    status: 'active' as 'active' | 'maintenance' | 'inactive',
  });

  // Fetch resources
  const { data: resources = [], isLoading } = useQuery<Resource[]>({
    queryKey: ['resources'],
    queryFn: () => http.get(apiRoutes.adminResources).then((res) => res.data.data),
  });

  // Status change mutation
  const statusMutation = useMutation({
    mutationFn: (data: { id: number; status: string }) =>
      http.put(apiRoutes.adminResourceStatus(data.id), { status: data.status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast({
        title: t('resources.statusUpdateSuccess', 'Status updated successfully'),
        description: t('resources.statusUpdateSuccessDesc', 'Resource status has been updated.'),
      });
      setIsStatusDialogOpen(false);
      setSelectedResource(null);
    },
    onError: () => {
      toast({
        title: t('resources.statusUpdateError', 'Error'),
        description: t('resources.statusUpdateErrorDesc', 'Failed to update status. Please try again.'),
        variant: 'destructive',
      });
    },
  });

  // Add/Edit resource mutation
  const saveResourceMutation = useMutation({
    mutationFn: (data: typeof formData & { id?: number }) => {
      if (data.id) {
        return http.put(apiRoutes.adminResourceById(data.id), data);
      }
      return http.post(apiRoutes.adminResources, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast({
        title: t(
          selectedResource ? 'resources.updateSuccess' : 'resources.createSuccess',
          selectedResource ? 'Resource updated successfully' : 'Resource created successfully'
        ),
        description: t(
          selectedResource ? 'resources.updateSuccessDesc' : 'resources.createSuccessDesc',
          selectedResource ? 'Resource details have been updated.' : 'New resource has been added to the system.'
        ),
      });
      setIsAddEditDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: t('resources.saveError', 'Error'),
        description: t('resources.saveErrorDesc', 'Failed to save resource. Please try again.'),
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'room',
      capacity: 1,
      location: '',
      status: 'active',
    });
    setSelectedResource(null);
  };

  const handleView = (resource: Resource) => {
    console.log('View resource:', resource);
  };

  const handleEdit = (resource: Resource) => {
    setSelectedResource(resource);
    setFormData({
      name: resource.name,
      type: resource.type,
      capacity: resource.capacity,
      location: resource.location || '',
      status: resource.status,
    });
    setIsAddEditDialogOpen(true);
  };

  const handleMaintenance = (resource: Resource) => {
    setSelectedResource(resource);
    setStatusAction('maintenance');
    setIsStatusDialogOpen(true);
  };

  const handleActivate = (resource: Resource) => {
    setSelectedResource(resource);
    setStatusAction('activate');
    setIsStatusDialogOpen(true);
  };

  const handleAddNew = () => {
    resetForm();
    setIsAddEditDialogOpen(true);
  };

  const handleSaveResource = () => {
    saveResourceMutation.mutate(selectedResource ? { ...formData, id: selectedResource.id } : formData);
  };

  const handleStatusChange = () => {
    if (!selectedResource) return;
    statusMutation.mutate({
      id: selectedResource.id,
      status: statusAction === 'maintenance' ? 'maintenance' : 'active',
    });
  };

  const columns = GetResourceColumns({
    onView: handleView,
    onEdit: handleEdit,
    onMaintenance: handleMaintenance,
    onActivate: handleActivate,
  });

  // Calculate stats
  // const activeResources = resources.filter((r) => r.status === 'active').length;
  // const maintenanceResources = resources.filter((r) => r.status === 'maintenance').length;
  // const avgUtilization =
  //   resources.length > 0 ? Math.round(resources.reduce((sum, r) => sum + r.utilization, 0) / resources.length) : 0;

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
          <h2 className='text-3xl font-bold tracking-tight'>{t('resources.title', 'Resources Management')}</h2>
          <p className='text-muted-foreground'>
            {t('resources.subtitle', 'Manage rooms, chairs, and wash stations')}
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className='mr-2 h-4 w-4' />
          {t('resources.addNew', 'Add Resource')}
        </Button>
      </div>

      {/* Stats Cards */}
      {/* <div className='grid gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('resources.totalResources', 'Total Resources')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{resources.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('resources.activeResources', 'Active')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{activeResources}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              {t('resources.maintenanceResources', 'In Maintenance')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{maintenanceResources}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('resources.avgUtilization', 'Avg. Utilization')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{avgUtilization}%</div>
          </CardContent>
        </Card>
      </div> */}

      {/* Resources Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('resources.resourcesList', 'Resources List')}</CardTitle>
          <CardDescription>{t('resources.resourcesListDesc', 'View and manage all resources')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResourcesDataTable columns={columns} data={resources} />
        </CardContent>
      </Card>

      {/* Add/Edit Resource Dialog */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>
              {selectedResource
                ? t('resources.editResource', 'Edit Resource')
                : t('resources.addResource', 'Add New Resource')}
            </DialogTitle>
            <DialogDescription>
              {t('resources.addEditDescription', 'Fill in the resource details below. Click save when you are done.')}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>{t('resources.resourceName', 'Resource Name')}</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('resources.resourceNamePlaceholder', 'e.g. Massage Room 1')}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='type'>{t('resources.resourceType', 'Resource Type')}</Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'room' | 'chair' | 'wash_station') => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='room'>{t('resources.typeRoom', 'Room')}</SelectItem>
                  <SelectItem value='chair'>{t('resources.typeChair', 'Chair')}</SelectItem>
                  <SelectItem value='wash_station'>{t('resources.typeWashStation', 'Wash Station')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='capacity'>{t('resources.capacity', 'Capacity')}</Label>
                <Input
                  id='capacity'
                  type='number'
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='location'>{t('resources.location', 'Location')}</Label>
                <Input
                  id='location'
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder={t('resources.locationPlaceholder', 'e.g. Floor 1')}
                />
              </div>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='status'>{t('resources.status', 'Status')}</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'maintenance' | 'inactive') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='active'>{t('resources.statusActive', 'Active')}</SelectItem>
                  <SelectItem value='maintenance'>{t('resources.statusMaintenance', 'Maintenance')}</SelectItem>
                  <SelectItem value='inactive'>{t('resources.statusInactive', 'Inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsAddEditDialogOpen(false)}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button onClick={handleSaveResource} disabled={saveResourceMutation.isPending}>
              {saveResourceMutation.isPending ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {statusAction === 'maintenance'
                ? t('resources.setMaintenance', 'Set Maintenance')
                : t('resources.activateResource', 'Activate Resource')}
            </DialogTitle>
            <DialogDescription>
              {statusAction === 'maintenance'
                ? t(
                  'resources.maintenanceConfirmation',
                  'This resource will be marked as under maintenance and unavailable for bookings.'
                )
                : t('resources.activateConfirmation', 'This resource will be activated and available for bookings.')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsStatusDialogOpen(false)}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button onClick={handleStatusChange} disabled={statusMutation.isPending}>
              {statusMutation.isPending ? t('common.updating', 'Updating...') : t('common.confirm', 'Confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
