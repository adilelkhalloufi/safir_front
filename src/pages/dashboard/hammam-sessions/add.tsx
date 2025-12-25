import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { LayoutSh as Layout } from '@/components/custom/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { IconArrowLeft, IconLoader2 } from '@tabler/icons-react';

export default function AddHammamSession() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    date: '',
    time_slot: '',
    session_type: 'women_only',
    capacity: '20',
    status: 'scheduled'
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => http.post(apiRoutes.adminHammamSessions, data),
    onSuccess: () => {
      toast({
        title: t('hammamSessions.createSuccess'),
        description: t('hammamSessions.createSuccessDesc'),
      });
      navigate(webRoutes.hammamSessions.index);
    },
    onError: (error: any) => {
      toast({
        title: t('hammamSessions.saveError'),
        description: error?.message || t('hammamSessions.saveErrorDesc'),
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      capacity: parseInt(formData.capacity) || 20
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout>
      <Layout.Header>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(webRoutes.hammamSessions.index)}
          >
            <IconArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('hammamSessions.addSession')}</h1>
            <p className="text-muted-foreground">{t('hammamSessions.addEditDescription')}</p>
          </div>
        </div>
      </Layout.Header>

      <Layout.Body>
        <Card>
          <CardHeader>
            <CardTitle>{t('hammamSessions.addSession')}</CardTitle>
            <CardDescription>{t('hammamSessions.addEditDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">{t('hammamSessions.date')}</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time_slot">{t('hammamSessions.timeSlot')}</Label>
                  <Select
                    value={formData.time_slot}
                    onValueChange={(value) => handleChange('time_slot', value)}
                  >
                    <SelectTrigger id="time_slot">
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (9:00 - 12:00)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (14:00 - 17:00)</SelectItem>
                      <SelectItem value="evening">Evening (18:00 - 21:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session_type">{t('hammamSessions.sessionType')}</Label>
                  <Select
                    value={formData.session_type}
                    onValueChange={(value) => handleChange('session_type', value)}
                  >
                    <SelectTrigger id="session_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="women_only">{t('hammamSessions.typeWomenOnly')}</SelectItem>
                      <SelectItem value="men_only">{t('hammamSessions.typeMenOnly')}</SelectItem>
                      <SelectItem value="mixed">{t('hammamSessions.typeMixed')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">{t('hammamSessions.capacity')}</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => handleChange('capacity', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="rounded-lg border p-4 bg-muted/50">
                <h4 className="font-medium mb-2">{t('hammamSessions.scheduleRules')}</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• {t('hammamSessions.rule1')}</li>
                  <li>• {t('hammamSessions.rule2')}</li>
                  <li>• {t('hammamSessions.rule3')}</li>
                </ul>
              </div>

              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(webRoutes.hammamSessions.index)}
                  disabled={createMutation.isPending}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && (
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
