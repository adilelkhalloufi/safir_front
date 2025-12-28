import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { ServiceType } from '@/interfaces/models';
import { LayoutSh as Layout } from '@/components/custom/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { IconArrowLeft, IconLoader2 } from '@tabler/icons-react';

export default function EditService() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    type_service: 'massage' as ServiceType,
    duration_minutes: '',
    price: '',
    description: '',
    requires_room: false,
    requires_chair: false,
    requires_wash_station: false,
    requires_hammam_session: false,
    is_active: true
  });

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () => http.get(apiRoutes.adminServiceById(Number(id))),
    enabled: !!id,
  });

  useEffect(() => {
    if (service?.data) {
      setFormData({
        name: service.data.name || '',
        type_service: service.data.type_service || 'massage',
        duration_minutes: service.data.duration_minutes?.toString() || '',
        price: service.data.price?.toString() || '',
        description: service.data.description || '',
        requires_room: service.data.requires_room || false,
        requires_chair: service.data.requires_chair || false,
        requires_wash_station: service.data.requires_wash_station || false,
        requires_hammam_session: service.data.requires_hammam_session || false,
        is_active: service.data.is_active ?? true
      });
    }
  }, [service]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => http.put(apiRoutes.adminServiceById(Number(id)), data),
    onSuccess: () => {
      toast({
        title: t('services.updateSuccess'),
        description: t('services.updateSuccessDesc'),
      });
      navigate(webRoutes.services.index);
    },
    onError: (error: any) => {
      toast({
        title: t('services.saveError'),
        description: error?.message || t('services.saveErrorDesc'),
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      ...formData,
      duration_minutes: parseInt(formData.duration_minutes) || 30,
      price: parseFloat(formData.price) || 0
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  return (
    <Layout>
      <Layout.Header>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(webRoutes.services.index)}
          >
            <IconArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('services.editService')}</h1>
            <p className="text-muted-foreground">{t('services.addEditDescription')}</p>
          </div>
        </div>
      </Layout.Header>

      <Layout.Body>
        <Card>
          <CardHeader>
            <CardTitle>{t('services.editService')}</CardTitle>
            <CardDescription>{t('services.addEditDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('services.serviceName')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder={t('services.serviceNamePlaceholder')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type_service">{t('services.serviceType')}</Label>
                  <Select
                    value={formData.type_service}
                    onValueChange={(value) => handleChange('type_service', value)}
                  >
                    <SelectTrigger id="type_service">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="massage">{t('services.typeMassage')}</SelectItem>
                      <SelectItem value="masso">{t('services.typeMasso')}</SelectItem>
                      <SelectItem value="hammam">{t('services.typeHammam')}</SelectItem>
                      <SelectItem value="coiffure">{t('services.typeCoiffure')}</SelectItem>
                      <SelectItem value="gommage">{t('services.typeGommage')}</SelectItem>
                      <SelectItem value="spa">{t('services.typeSpa')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration_minutes">{t('services.duration')}</Label>
                  <Input
                    id="duration_minutes"
                    type="number"
                    min="15"
                    step="15"
                    value={formData.duration_minutes}
                    onChange={(e) => handleChange('duration_minutes', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">{t('services.price')}</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">{t('services.description')}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder={t('services.descriptionPlaceholder')}
                    rows={4}
                  />
                </div>

                <div className="space-y-4 md:col-span-2">
                  <Label>{t('services.resourceRequirements', 'Resource Requirements')}</Label>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requires_room"
                        checked={formData.requires_room}
                        onCheckedChange={(checked) => handleChange('requires_room', checked)}
                      />
                      <label
                        htmlFor="requires_room"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t('services.requiresRoom', 'Requires Room')}
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requires_chair"
                        checked={formData.requires_chair}
                        onCheckedChange={(checked) => handleChange('requires_chair', checked)}
                      />
                      <label
                        htmlFor="requires_chair"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t('services.requiresChair', 'Requires Chair')}
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requires_wash_station"
                        checked={formData.requires_wash_station}
                        onCheckedChange={(checked) => handleChange('requires_wash_station', checked)}
                      />
                      <label
                        htmlFor="requires_wash_station"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t('services.requiresWashStation', 'Requires Wash Station')}
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requires_hammam_session"
                        checked={formData.requires_hammam_session}
                        onCheckedChange={(checked) => handleChange('requires_hammam_session', checked)}
                      />
                      <label
                        htmlFor="requires_hammam_session"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t('services.requiresHammamSession', 'Requires Hammam Session')}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleChange('is_active', checked)}
                  />
                  <label
                    htmlFor="is_active"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('services.isActive', 'Active Service')}
                  </label>
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(webRoutes.services.index)}
                  disabled={updateMutation.isPending}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending && (
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t('common.save')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Layout.Body>
    </Layout>
  );
}
