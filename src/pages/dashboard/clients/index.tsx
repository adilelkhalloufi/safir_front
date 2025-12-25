import { GetClientColumns, Client } from './columns';
import { ClientsDataTable } from './data-table';
import { useEffect, useMemo, useState } from 'react';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { webRoutes } from '@/routes/web';
import { useTranslation } from 'react-i18next';
import { setPageTitle } from '@/utils';

export default function ClientsIndex() {
  const { t } = useTranslation();
  const [data, setData] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle(t('clients.title', 'Clients Management'));
    fetchClients();
  }, [t]);

  const fetchClients = () => {
    setLoading(true);
    http
      .get(apiRoutes.adminClients)
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: t('common.error', 'Error'),
          description: t('clients.fetchError', 'Failed to fetch clients'),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleView = (client: Client) => {
    navigate(webRoutes.clients.view.replace(':id', client.id.toString()));
  };

  const handleEdit = (client: Client) => {
    navigate(webRoutes.clients.edit.replace(':id', client.id.toString()));
  };

  const columns = useMemo(
    () =>
      GetClientColumns({
        onView: handleView,
        onEdit: handleEdit,
      }),
    [t]
  );

  return (
    <>
      <div className='mb-4 flex w-full items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>{t('clients.title', 'Clients Management')}</h1>
          <p className='text-muted-foreground'>
            {t('clients.subtitle', 'Manage your client database')}
          </p>
        </div>
        <Button onClick={() => navigate(webRoutes.clients.add)}>
          {t('clients.addNew', 'Add New Client')}
        </Button>
      </div>

      <ClientsDataTable columns={columns} data={data} loading={loading} />
    </>
  );
}
