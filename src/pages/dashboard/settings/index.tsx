import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import MagicForm, { MagicFormFieldProps, MagicFormGroupProps } from '@/components/custom/MagicForm';

interface Setting {
  id: number;
  key: string;
  value: string;
  type: string;
  description: string;
  created_at: string;
  updated_at: string;
}

 

export default function SettingsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch settings
  const { data: settingsResponse, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => http.get(apiRoutes.settings).then(res => { return res.data?.data})
  });

  // Handle different response structures - MEMOIZED
  const settings: Setting[] = useMemo(() => {
    if (!settingsResponse) return [];
    
    if (Array.isArray(settingsResponse)) {
      return settingsResponse;
    } else if (typeof settingsResponse === 'object') {
      // Convert object to array format
      return Object.entries(settingsResponse.data).map(([key, value]) => ({
        id: 0,
        key,
        value: String(value),
        type: 'string',
        description: key,
        created_at: '',
        updated_at: '',
      }));
    }
    return [];
  }, [settingsResponse]);

  // Convert settings to MagicForm format
  const magicFormFields: MagicFormGroupProps[] = useMemo(() => {
    if (settings.length === 0) return [];

    const fields: MagicFormFieldProps[] = settings.map(setting => {
      let fieldType: MagicFormFieldProps['type'] = 'text';

      // Map setting type to MagicForm type
      switch (setting.type) {
        case 'boolean':
          fieldType = 'checkbox';
          break;
        case 'integer':
        case 'number':
          fieldType = 'number';
          break;
        case 'date':
          fieldType = 'date';
          break;
        case 'textarea':
          fieldType = 'textarea';
          break;
        default:
          fieldType = 'text';
      }

      return {
        name: setting.key,
        label: `${setting.description || setting.key}`,
        type: fieldType,
        defaultValue: setting.value,
        width: 'full',
      };
    });

    return [{
      group: 'settings',
      hideGroupTitle: true,
      fields,
      layout: {
        type: 'vertical',
      },
    }];
  }, [settings]);

  // Create initial values object for MagicForm
  const initialFormValues = useMemo(() => {
    const values: Record<string, string> = {};
    settings.forEach(setting => {
      values[setting.key] = setting.value;
    });
    return values;
  }, [settings]);
  const saveSettingsMutation = useMutation({
    mutationFn: (data: Record<string, string>) => {
      // Send as array format for admin settings update
      const updates = Object.entries(data).map(([key, value]) => ({
        key,
        value,
      }));
      return http.put(apiRoutes.adminSettings, { settings: updates });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: t('settings.saveSuccess', 'Settings saved successfully'),
        description: t('settings.saveSuccessDesc', 'Your settings have been updated.'),
      });
    },
    onError: () => {
      toast({
        title: t('settings.saveError', 'Failed to save settings'),
        description: t('settings.saveErrorDesc', 'Please try again.'),
        variant: 'destructive',
      });
    },
  });

  const handleSave = (data: Record<string, any>) => {
    // Convert all values to strings for API
    // data keys are setting.key, values are the new values
    const stringData: Record<string, string> = {};
    Object.entries(data).forEach(([key, value]) => {
      // Only include if value actually changed
      const originalSetting = settings.find(s => s.key === key);
      if (originalSetting) {
        stringData[key] = String(value);
      }
    });
    saveSettingsMutation.mutate(stringData);
  };

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
          <h2 className='text-3xl font-bold tracking-tight'>{t('settings.title', 'Settings')}</h2>
          <p className='text-muted-foreground'>{t('settings.subtitle', 'Configure system settings')}</p>
        </div>
      </div>

      {magicFormFields.length > 0 ? (
        <MagicForm
          fields={magicFormFields}
          onSubmit={handleSave}
          title=""
          button={t('settings.saveSettings', 'Save Settings')}
          initialValues={initialFormValues}
          loading={saveSettingsMutation.isPending}
          showButton={true}
        />
      ) : (
        <div className='text-center py-8 text-muted-foreground'>
          {t('settings.noSettings', 'No settings available')}
        </div>
      )}
    </div>
  );
}
