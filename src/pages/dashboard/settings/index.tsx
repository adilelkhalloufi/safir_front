import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';

interface Settings {
  business_name: string;
  email: string;
  phone: string;
  address: string;
  buffer_time: number;
  advance_booking_days: number;
  default_hammam_capacity: number;
  enable_card_payment: boolean;
  enable_cash_payment: boolean;
  enable_bank_transfer: boolean;
}

export default function SettingsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Settings>({
    business_name: '',
    email: '',
    phone: '',
    address: '',
    buffer_time: 15,
    advance_booking_days: 30,
    default_hammam_capacity: 10,
    enable_card_payment: true,
    enable_cash_payment: true,
    enable_bank_transfer: false,
  });

  // Fetch settings
  const { data: settings, isLoading } = useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: () => http.get(apiRoutes.adminSettings),
  });

  // Update formData when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: (data: Settings) => http.put(apiRoutes.adminSettings, data),
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

  const handleSave = () => {
    saveSettingsMutation.mutate(formData);
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

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.businessInfo', 'Business Information')}</CardTitle>
          <CardDescription>Basic information about your business</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-2'>
            <Label htmlFor='business_name'>{t('settings.businessName', 'Business Name')}</Label>
            <Input
              id='business_name'
              value={formData.business_name}
              onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
            />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>{t('settings.email', 'Email')}</Label>
              <Input
                id='email'
                type='email'
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='phone'>{t('settings.phone', 'Phone')}</Label>
              <Input
                id='phone'
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='address'>{t('settings.address', 'Address')}</Label>
            <Textarea
              id='address'
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Booking Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.bookingSettings', 'Booking Settings')}</CardTitle>
          <CardDescription>Configure booking parameters</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='buffer_time'>{t('settings.bufferTime', 'Buffer Time (minutes)')}</Label>
              <Input
                id='buffer_time'
                type='number'
                value={formData.buffer_time}
                onChange={(e) => setFormData({ ...formData, buffer_time: parseInt(e.target.value) })}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='advance_booking_days'>{t('settings.advanceDays', 'Advance Booking Days')}</Label>
              <Input
                id='advance_booking_days'
                type='number'
                value={formData.advance_booking_days}
                onChange={(e) => setFormData({ ...formData, advance_booking_days: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hammam Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.hammamSettings', 'Hammam Settings')}</CardTitle>
          <CardDescription>Default settings for hammam sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-2'>
            <Label htmlFor='default_hammam_capacity'>{t('settings.defaultCapacity', 'Default Capacity')}</Label>
            <Input
              id='default_hammam_capacity'
              type='number'
              value={formData.default_hammam_capacity}
              onChange={(e) => setFormData({ ...formData, default_hammam_capacity: parseInt(e.target.value) })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.paymentSettings', 'Payment Settings')}</CardTitle>
          <CardDescription>Enable or disable payment methods</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='enable_card_payment'>{t('settings.enableCard', 'Enable Card Payments')}</Label>
            <Switch
              id='enable_card_payment'
              checked={formData.enable_card_payment}
              onCheckedChange={(checked) => setFormData({ ...formData, enable_card_payment: checked })}
            />
          </div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='enable_cash_payment'>{t('settings.enableCash', 'Enable Cash Payments')}</Label>
            <Switch
              id='enable_cash_payment'
              checked={formData.enable_cash_payment}
              onCheckedChange={(checked) => setFormData({ ...formData, enable_cash_payment: checked })}
            />
          </div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='enable_bank_transfer'>{t('settings.enableBank', 'Enable Bank Transfer')}</Label>
            <Switch
              id='enable_bank_transfer'
              checked={formData.enable_bank_transfer}
              onCheckedChange={(checked) => setFormData({ ...formData, enable_bank_transfer: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className='flex justify-end'>
        <Button onClick={handleSave} disabled={saveSettingsMutation.isPending}>
          {saveSettingsMutation.isPending ? t('common.saving', 'Saving...') : t('settings.saveSettings', 'Save Settings')}
        </Button>
      </div>
    </div>
  );
}
