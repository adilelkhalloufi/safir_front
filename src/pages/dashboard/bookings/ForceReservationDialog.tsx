import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox';
import { Textarea } from '@/components/ui/textarea';

interface ForceReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export default function ForceReservationDialog({
  open,
  onOpenChange,
  onSubmit,
  loading = false,
}: ForceReservationDialogProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [clientMode, setClientMode] = useState<'existing' | 'new'>('existing');
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
   const [paymentType, setPaymentType] = useState<'cash' | 'card' | 'bank_transfer' | 'online'>('cash');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const [newClient, setNewClient] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
  });

  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['admin-clients-force'],
    queryFn: async () => {
      const response = await http.get(apiRoutes.adminClients);
      return response.data?.data || [];
    },
    enabled: open,
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['admin-services-force'],
    queryFn: async () => {
      const response = await http.get(apiRoutes.adminServices);
      return response.data?.data || [];
    },
    enabled: open,
  });

  const { data: staff = [], isLoading: staffLoading } = useQuery({
    queryKey: ['admin-staff-force'],
    queryFn: async () => {
      const response = await http.get(apiRoutes.adminStaff);
      return response.data?.data || [];
    },
    enabled: open,
  });

  const clientOptions = useMemo(
    () =>
      clients.map((client: any) => ({
        value: client.id,
        name: `${client.name || `Client #${client.id}`} ${client.email ? `(${client.email})` : client.phone ? `(${client.phone})` : ''}`,
      })),
    [clients]
  );

  const serviceOptions = useMemo(
    () =>
      services.map((service: any) => ({
        value: service.id,
        name: typeof service.name === 'string' ? service.name : service.name?.en || service.name?.fr || `Service #${service.id}`,
      })),
    [services]
  );

  const staffOptions = useMemo(
    () =>
      staff.map((member: any) => ({
        value: member.id,
        name: member.user?.name || member.user?.email || `Staff #${member.id}`,
      })),
    [staff]
  );

  const resetForm = () => {
    setStep(1);
    setClientMode('existing');
    setSelectedClientId(null);
    setSelectedServiceId(null);
    setSelectedStaffId(null);
    setDate('');
    setStartTime('');
    setEndTime('');
  
    setPaymentType('cash');
    setPaymentAmount('');
    setNotes('');
    setError('');
    setNewClient({ first_name: '', last_name: '', email: '', phone: '', address: '' });
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const goNext = () => {
    if (step < 3) setStep((prev) => (prev + 1) as 2 | 3);
  };

  const goPrevious = () => {
    if (step > 1) setStep((prev) => (prev - 1) as 1 | 2);
  };

  const stepTitle = step === 1 ? t('bookings.forceStepClient', 'Client')
    : step === 2 ? t('bookings.forceStepService', 'Service')
    : t('bookings.forceStepPayment', 'Payment');

  const handleSubmit = () => {
    setError('');

    if (clientMode === 'existing' && !selectedClientId) {
      setError(t('bookings.selectExistingClientError', 'Please select an existing client.'));
      return;
    }

    if (clientMode === 'new') {
      if (!newClient.first_name || !newClient.last_name || !newClient.email || !newClient.phone) {
        setError(t('bookings.newClientRequiredFieldsError', 'Please fill all required client fields.'));
        return;
      }
    }

    if (!selectedServiceId) {
      setError(t('bookings.selectServiceError', 'Please select a service.'));
      return;
    }

    if (!selectedStaffId) {
      setError(t('bookings.selectStaffError', 'Please select a staff member.'));
      return;
    }

    if (!date || !startTime || !endTime) {
      setError(t('bookings.selectDateTimeError', 'Please select date and time.'));
      return;
    }

    if (!paymentAmount || Number(paymentAmount) <= 0) {
      setError(t('bookings.paymentAmountError', 'Please enter a valid payment amount.'));
      return;
    }

    const payload: any = {
      service_id: selectedServiceId,
      staff_id: selectedStaffId,
      date,
      start_time: startTime,
      end_time: endTime,
       payment: {
        type: paymentType,
        amount: Number(paymentAmount),
      },
      notes: notes || null,
    };

    if (clientMode === 'existing') {
      payload.client_id = selectedClientId;
    } else {
      payload.client_create = {
        name: `${newClient.first_name} ${newClient.last_name}`,
        email: newClient.email,
        phone: newClient.phone,
        address: newClient.address || null,
      };
    }

    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('bookings.forceReservationTitle', 'Force Reservation')}</DialogTitle>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className={step === 1 ? 'font-semibold text-foreground' : ''}>{t('bookings.forceStepClient', 'Client')}</span>
            <span>•</span>
            <span className={step === 2 ? 'font-semibold text-foreground' : ''}>{t('bookings.forceStepService', 'Service')}</span>
            <span>•</span>
            <span className={step === 3 ? 'font-semibold text-foreground' : ''}>{t('bookings.forceStepPayment', 'Payment')}</span>
          </div>
        </DialogHeader>

        <div className="mb-4 rounded-lg border border-input bg-muted p-4">
          <p className="text-sm font-medium">{t('bookings.forceStepTitle', 'Step')} {step} / 3</p>
          <p className="text-sm text-muted-foreground">{stepTitle}</p>
        </div>

        {step === 1 && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>{t('bookings.clientInfo', 'Client')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 md:grid-cols-2">
                <Button
                  type="button"
                  variant={clientMode === 'existing' ? 'default' : 'outline'}
                  onClick={() => setClientMode('existing')}
                  className="w-full"
                >
                  {t('bookings.existingClient', 'Existing Client')}
                </Button>
                <Button
                  type="button"
                  variant={clientMode === 'new' ? 'default' : 'outline'}
                  onClick={() => setClientMode('new')}
                  className="w-full"
                >
                  {t('bookings.createNewClient', 'Create New Client')}
                </Button>
              </div>

              {clientMode === 'existing' ? (
                <div>
                  <Label>{t('bookings.selectClient', 'Select Client')}</Label>
                  <Combobox
                    data={clientOptions}
                    placeholder={t('bookings.selectClientPlaceholder', 'Select a client')}
                    emptyMessage={t('common.noResults', 'No clients found')}
                    isLoading={clientsLoading}
                    defaultValue={selectedClientId ?? ''}
                    onSelectionChange={(value: any) => setSelectedClientId(Number(value) || null)}
                  />
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>{t('common.firstName', 'First Name')}</Label>
                    <Input
                      type="text"
                      value={newClient.first_name}
                      onChange={(event) => setNewClient({ ...newClient, first_name: event.target.value })}
                    />
                  </div>
                  <div>
                    <Label>{t('common.lastName', 'Last Name')}</Label>
                    <Input
                      type="text"
                      value={newClient.last_name}
                      onChange={(event) => setNewClient({ ...newClient, last_name: event.target.value })}
                    />
                  </div>
                  <div>
                    <Label>{t('common.email', 'Email')}</Label>
                    <Input
                      type="email"
                      value={newClient.email}
                      onChange={(event) => setNewClient({ ...newClient, email: event.target.value })}
                    />
                  </div>
                  <div>
                    <Label>{t('common.phone', 'Phone')}</Label>
                    <Input
                      type="tel"
                      value={newClient.phone}
                      onChange={(event) => setNewClient({ ...newClient, phone: event.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>{t('common.address', 'Address')}</Label>
                    <Textarea
                      value={newClient.address}
                      onChange={(event) => setNewClient({ ...newClient, address: event.target.value })}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>{t('bookings.serviceDetails', 'Service Details')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>{t('bookings.service', 'Service')}</Label>
                <Combobox
                  data={serviceOptions}
                  placeholder={t('bookings.selectService', 'Select service')}
                  emptyMessage={t('common.noResults', 'No services found')}
                  isLoading={servicesLoading}
                  defaultValue={selectedServiceId ?? ''}
                  onSelectionChange={(value: any) => setSelectedServiceId(Number(value) || null)}
                />
              </div>
              <div>
                <Label>{t('bookings.staff', 'Staff')}</Label>
                <Combobox
                  data={staffOptions}
                  placeholder={t('bookings.selectStaff', 'Select staff')}
                  emptyMessage={t('common.noResults', 'No staff found')}
                  isLoading={staffLoading}
                  defaultValue={selectedStaffId ?? ''}
                  onSelectionChange={(value: any) => setSelectedStaffId(Number(value) || null)}
                />
              </div>
              <div>
                <Label>{t('bookings.date', 'Date')}</Label>
                <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
              </div>
              <div>
                <Label>{t('bookings.time', 'Time')}</Label>
                <div className="grid gap-2 md:grid-cols-2">
                  <Input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} />
                  <Input type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} />
                </div>
              </div>
           
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>{t('bookings.payment', 'Payment')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>{t('payments.method', 'Payment Method')}</Label>
                <select
                  value={paymentType}
                  onChange={(event) => setPaymentType(event.target.value as any)}
                  className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="cash">{t('payments.method_cash', 'Cash')}</option>
                  <option value="card">{t('payments.method_card', 'Card')}</option>
                  <option value="bank_transfer">{t('payments.method_transfer', 'Bank Transfer')}</option>
                  <option value="online">{t('payments.method_online', 'Online')}</option>
                </select>
              </div>
              <div>
                <Label>{t('payments.amount', 'Amount')}</Label>
                <Input
                  type="number"
                  min="0"
                  value={paymentAmount}
                  onChange={(event) => setPaymentAmount(event.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label>{t('bookings.notes', 'Notes')}</Label>
                <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
              </div>
            </CardContent>
          </Card>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <DialogFooter>
          <Button variant="outline" onClick={goPrevious} disabled={step === 1 || loading}>
            {t('common.back', 'Back')}
          </Button>
          {step < 3 ? (
            <Button onClick={goNext} disabled={loading}>
              {t('common.next', 'Next')}
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? t('common.saving', 'Saving...') : t('bookings.forceReservation', 'Force Reservation')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
