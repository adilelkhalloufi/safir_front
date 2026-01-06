import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { ResourcesDataTable } from './data-table';
import { Resource, GetResourceColumns } from './columns';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';

export default function ResourcesPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
 


  // Fetch resources
  const { data: resources = [], isLoading } = useQuery<Resource[]>({
    queryKey: ['resources'],
    queryFn: () => http.get(apiRoutes.adminResources).then((res) => res.data.data),
  });

  // Fetch resource types
  const { data: resourceTypes = [] } = useQuery({
    queryKey: ['resourceTypes'],
    queryFn: () => http.get(apiRoutes.adminTypeResources).then(res => res.data?.data),
  });

   
 

  const handleView = (resource: Resource) => {
    navigate(webRoutes.resources.view.replace(':id', resource.id.toString()));
  };

  const handleEdit = (resource: Resource) => {
    navigate(webRoutes.resources.edit.replace(':id', resource.id.toString()));
  };

  const handleActivate = (_resource: Resource) => {
    // Handle activate logic
  };

  const handleAddNew = () => {
    navigate(webRoutes.resources.add);
  };

  

 

  const columns = GetResourceColumns({
    onView: handleView,
    onEdit: handleEdit,
    onActivate: handleActivate,
    t,
    currentLang: i18n.language as 'fr' | 'en',
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
 
      <Card>
        <CardHeader>
          <CardTitle>{t('resources.resourcesList', 'Resources List')}</CardTitle>
          <CardDescription>{t('resources.resourcesListDesc', 'View and manage all resources')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResourcesDataTable columns={columns} data={resources} resourceTypes={resourceTypes} />
        </CardContent>
      </Card>

 
  
 
    </div>
  );
}
