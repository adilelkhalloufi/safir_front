import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@tanstack/react-query';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { Client } from '@/interfaces/models';
import { toast } from '@/components/ui/use-toast';
import { setPageTitle } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Combobox } from '@/components/ui/combobox';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, ChevronRight, CreditCard, Lock, Loader2, Plus, Shield } from 'lucide-react';
import { CreditCard as SquareCreditCard, PaymentForm } from 'react-square-web-payments-sdk';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import MagicForm from '@/components/custom/MagicForm';


interface BookingFormData {
  client_id?: number;
  client_create?: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  services: Array<{
    id: number;
    quantity: number;
    start_datetime: string;
    end_datetime: string;
    assigned_staff: Array<{ staff_id: number }>;
    preferred_gender?: 'female' | 'male' | 'mixed';
  }>;
  group_size: number;
  language: string;
  notes?: string;
  payment?: {
    type: string;
    amount: number;
    partial: boolean;
  };
  block_slots?: boolean;
}

export default function BookingsAdd() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [step, setStep] = useState<'client' | 'services' | 'payment'>('client');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [createClientMode, setCreateClientMode] = useState(false);
    const [selectedServiceIds, setSelectedServiceIds] = useState<Set<number>>(new Set());
    const [serviceDates, setServiceDates] = useState<Record<number, Date | undefined>>({});
    const [serviceSlots, setServiceSlots] = useState<Record<number, any>>({});
    const [serviceGenders, setServiceGenders] = useState<Record<number, 'female' | 'male' | 'mixed'>>({});
    const [selectedStaff, setSelectedStaff] = useState<Record<number, any>>({});
    const [serviceQuantities, setServiceQuantities] = useState<Record<number, number>>({});
    const [formData, setFormData] = useState<BookingFormData>({
        services: [],
        group_size: 1,
        language: 'en',
    });
    const [paymentType, setPaymentType] = useState<'cash' | 'card' | 'bank_transfer' | 'online'>('cash');
    const [paymentAmount, setPaymentAmount] = useState<string>('');
    const [cardHolderName, setCardHolderName] = useState<string>('');
    const [paymentFormKey, setPaymentFormKey] = useState(0);

    const squareApplicationId = import.meta.env.VITE_SQUARE_APP_ID;
    const squareLocationId = import.meta.env.VITE_SQUARE_LOCATION_ID;
    const squareConfigured = Boolean(squareApplicationId && squareLocationId);

    useEffect(() => {
        setPageTitle(t('bookings.addTitle', 'Create New Booking'));
    }, [t]);

    // Fetch clients
    const { data: clients = [], isLoading: clientsLoading } = useQuery({
        queryKey: ['admin-clients'],
        queryFn: async () => {
            const response = await http.get(apiRoutes.adminClients);
            return response.data?.data || response.data || [];
        },
    });

    // Fetch services
    const { data: services = [] } = useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            const response = await http.get(apiRoutes.services);
            return response.data?.data || response.data || [];
        },
    });

    const serviceDepositTotal = Array.from(selectedServiceIds).reduce((sum, serviceId) => {
        const svc = services.find((s: any) => s.id === serviceId);
        const qty = serviceQuantities[serviceId] || 1;
        return sum + ((Number(svc?.minimum_booking_deposit) || 0) * qty);
    }, 0);

    // Fetch available slots for selected services
    const { data: availableSlots = {} } = useQuery({
        queryKey: ['available-slots', Array.from(selectedServiceIds), Object.values(serviceDates), Array.from(selectedServiceIds).map(id => serviceQuantities[id] || 1)],
        queryFn: async () => {
            if (selectedServiceIds.size === 0) return {};
            
            const slots: Record<number, any[]> = {};
            for (const serviceId of selectedServiceIds) {
                const date = serviceDates[serviceId];
                if (!date) continue;
                
                const response = await http.post(apiRoutes.availability, {
                    services: [
                        {
                            service_id: serviceId,
                            group_size: serviceQuantities[serviceId] || 1,
                        }
                    ],
                    date: format(date, 'yyyy-MM-dd'),
                });
                
                // Extract slots from the new API response structure
                const combinedSlots = response.data?.data?.combined_available_slots || [];
                const serviceSlots = combinedSlots.find((s: any) => s.service_id === serviceId);
                slots[serviceId] = serviceSlots?.available_slots || [];
            }
            return slots;
        },
        enabled: selectedServiceIds.size > 0,
    });

    const createBookingMutation = useMutation({
        mutationFn: async (data: BookingFormData) => {
            return http.post(apiRoutes.adminBookings, data);
        },
        onSuccess: () => {
            toast({
                title: t('common.success', 'Success'),
                description: t('bookings.createSuccess', 'Booking created successfully'),
            });
            navigate(webRoutes.bookings.index);
        },
        onError: (error: any) => {
            toast({
                variant: 'destructive',
                title: t('common.error', 'Error'),
                description: error?.response?.data?.message || t('bookings.createError', 'Failed to create booking'),
            });
        },
    });

    const handleConfirmServices = () => {
        if (selectedServiceIds.size === 0) {
            toast({
                variant: 'destructive',
                title: t('common.error', 'Error'),
                description: 'Please select at least one service',
            });
            return;
        }

        // Validate that all selected services have dates and slots selected
        for (const serviceId of selectedServiceIds) {
            if (!serviceDates[serviceId] || !serviceSlots[serviceId]) {
                toast({
                    variant: 'destructive',
                    title: t('common.error', 'Error'),
                    description: 'Please set date and time slot for all selected services',
                });
                return;
            }
        }

        // Build services array
        const servicesArray = Array.from(selectedServiceIds).map(serviceId => {
            const slot = serviceSlots[serviceId];
            const selectedSvc = services.find((s: any) => s.id === serviceId);
            const quantity = serviceQuantities[serviceId] || 1;
            let assignedStaff = [];

            if (selectedStaff[serviceId]) {
                assignedStaff = [{ staff_id: selectedStaff[serviceId].staff_id }];
            } else if (slot.available_staff && slot.available_staff.length > 0) {
                assignedStaff = slot.available_staff.slice(0, quantity).map((st: any) => ({ staff_id: st.staff_id }));
            }

            const service: any = {
                id: serviceId,
                quantity,
                start_datetime: slot.start_datetime,
                end_datetime: slot.end_datetime,
                assigned_staff: assignedStaff,
            };

            // Add gender preference for hammam services
            if (selectedSvc?.has_sessions) {
                service.preferred_gender = serviceGenders[serviceId] || 'mixed';
            }

            return service;
        });

        setFormData({
            ...formData,
            group_size: Object.values(serviceQuantities).reduce((sum, count) => sum + count, 0) || 1,
            services: servicesArray,
        });
        setPaymentAmount(serviceDepositTotal.toFixed(2));
        setStep('payment');
    };

    const handleCreateClient = (clientData: any) => {
        setFormData({
            ...formData,
            client_create: {
                name: `${clientData.first_name} ${clientData.last_name}`,
                email: clientData.email,
                phone: clientData.phone,
                address: clientData.address || '',
            },
        });
        setSelectedClient({
            id: 0,
            name: `${clientData.first_name} ${clientData.last_name}`,
            email: clientData.email,
            phone: clientData.phone,
        } as Client);
        setCreateClientMode(false);
        setStep('services');
     
    };

    const handleSubmitBooking = (paymentData: any) => {
        if (!formData.client_id && !formData.client_create) {
            toast({
                variant: 'destructive',
                title: t('common.error', 'Error'),
                description: 'Please select or create a client',
            });
            return;
        }

        if (formData.services.length === 0) {
            toast({
                variant: 'destructive',
                title: t('common.error', 'Error'),
                description: 'Please add at least one service',
            });
            return;
        }

        if (!paymentData.amount || Number(paymentData.amount) <= 0) {
            toast({
                variant: 'destructive',
                title: t('common.error', 'Error'),
                description: t('payments.amountRequired', 'Please enter a valid payment amount'),
            });
            return;
        }

        const bookingData: BookingFormData = {
            ...formData,
            payment: {
                type: paymentData.type,
                amount: parseFloat(paymentData.amount),
                partial: false,
                ...(paymentData.source_id ? { source_id: paymentData.source_id } : {}),
                ...(paymentData.card_holder ? { card_holder: paymentData.card_holder } : {}),
                ...(paymentData.verification_token ? { verification_token: paymentData.verification_token } : {}),
            },
        };

        createBookingMutation.mutate(bookingData);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{t('bookings.addTitle', 'Create New Booking')}</h1>
                    <p className="text-muted-foreground">
                        {t('bookings.addSubtitle', 'Fill in the booking details step by step')}
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate(webRoutes.bookings.index)}>
                    {t('common.cancel', 'Cancel')}
                </Button>
            </div>

            <Tabs value={step} onValueChange={(val) => setStep(val as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="client">{t('bookings.step1', 'Client')}</TabsTrigger>
                    <TabsTrigger value="services">{t('bookings.step2', 'Services')}</TabsTrigger>
                    <TabsTrigger value="payment">{t('bookings.step3', 'Payment')}</TabsTrigger>
                </TabsList>

                {/* Step 1: Client Selection */}
                <TabsContent value="client" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('bookings.selectClient', 'Select or Create Client')}</CardTitle>
                            <CardDescription>{t('bookings.selectClientDesc', 'Choose an existing client or add a new one')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!createClientMode ? (
                                <>
                                    <div className="space-y-2">
                                        <Label>{t('bookings.existingClient', 'Existing Clients')} *</Label>
                                        <Combobox
                                            data={clients.map((client: Client) => ({
                                                value: client.id,
                                                name: `${client.name} (${client.email})`
                                            }))}
                                            placeholder={clientsLoading ? 'Loading...' : t('bookings.selectClientPlaceholder', 'Select a client')}
                                            emptyMessage={t('common.noResults', 'No clients found')}
                                            isLoading={clientsLoading}
                                            defaultValue={selectedClient?.id}
                                            onSelectionChange={(clientId: any) => {
                                                if (clientId) {
                                                    const client = clients.find((c: any) => c.id === clientId);
                                                    if (client) {
                                                        setSelectedClient(client);
                                                        setFormData({ ...formData, client_id: client.id, client_create: undefined });
                                                    }
                                                }
                                            }}
                                        />
                                    </div>

                                    {selectedClient && selectedClient.id !== 0 && (
                                        <div className="bg-muted p-4 rounded-lg space-y-2">
                                            <p className="font-semibold">{selectedClient.name}</p>
                                            <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
                                            <p className="text-sm text-muted-foreground">{selectedClient.phone}</p>
                                            {selectedClient.bookings_count !== undefined && (
                                                <p className="text-sm">{t('bookings.totalBookings', 'Total Bookings')}: {selectedClient.bookings_count}</p>
                                            )}
                                        </div>
                                    )}

                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="w-full"
                                        onClick={() => setCreateClientMode(true)}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        {t('bookings.createNewClient', 'Create New Client')}
                                    </Button>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        className="mb-4"
                                        onClick={() => setCreateClientMode(false)}
                                    >
                                        ← {t('common.back', 'Back')}
                                    </Button>
                                    <MagicForm
                                        title={t('bookings.createNewClient', 'Add Client Info')}
                                        fields={[
                                            {
                                                group: 'client',
                                                fields: [
                                                    {
                                                        name: 'first_name',
                                                        label: t('common.firstName', 'First Name'),
                                                        type: 'text',
                                                        required: true,
                                                        placeholder: 'John',
                                                        width: 'half',
                                                    },
                                                    {
                                                        name: 'last_name',
                                                        label: t('common.lastName', 'Last Name'),
                                                        type: 'text',
                                                        required: true,
                                                        placeholder: 'Doe',
                                                        width: 'half',
                                                    },
                                                    {
                                                        name: 'email',
                                                        label: t('common.email', 'Email'),
                                                        type: 'text',
                                                        required: true,
                                                        placeholder: 'john@example.com',
                                                        width: 'half',
                                                    },
                                                    {
                                                        name: 'phone',
                                                        label: t('common.phone', 'Phone'),
                                                        type: 'text',
                                                        required: true,
                                                        placeholder: '+212612345678',
                                                        width: 'half',
                                                    },
                                                    {
                                                        name: 'address',
                                                        label: t('common.address', 'Address'),
                                                        type: 'text',
                                                        placeholder: 'Optional',
                                                        width: 'full',
                                                    },
                                                ],
                                            },
                                        ]}
                                        onSubmit={handleCreateClient}
                                        button={t('common.next', 'Next')}
                                    />
                                </div>
                            )}

                            <div className="pt-4 border-t flex justify-end">
                                <Button 
                                    onClick={() => setStep('services')}
                                    disabled={!selectedClient}
                                >
                                    {t('common.next', 'Next')}
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Step 2: Services Selection */}
                <TabsContent value="services" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('bookings.addServices', 'Select Services')}</CardTitle>
                            <CardDescription>{t('bookings.addServicesDesc', 'Choose services and set dates/times for each')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {selectedClient && (
                                <div className="bg-muted p-3 rounded text-sm">
                                    <strong>{t('common.client', 'Client')}:</strong> {selectedClient.name}
                                </div>
                            )}

                            {/* Service Selection Checkboxes */}
                            <div className="border rounded-lg p-4 space-y-3 bg-card">
                                <h3 className="font-semibold">{t('bookings.selectService', 'Select Services')}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {services.map((svc: any) => {
                                        const qty = serviceQuantities[svc.id] || 1;
                                        const selected = selectedServiceIds.has(svc.id);
                                        return (
                                            <div key={svc.id} className="rounded-lg border p-3 hover:bg-muted/50">
                                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                                    <div className="flex items-start gap-3">
                                                        <Checkbox
                                                            id={`service-${svc.id}`}
                                                            checked={selected}
                                                            onCheckedChange={(checked) => {
                                                                const newIds = new Set(selectedServiceIds);
                                                                const newQuantities = { ...serviceQuantities };
                                                                if (checked) {
                                                                    newIds.add(svc.id);
                                                                    newQuantities[svc.id] = newQuantities[svc.id] || 1;
                                                                    if (svc.has_sessions && !serviceGenders[svc.id]) {
                                                                        setServiceGenders({ ...serviceGenders, [svc.id]: 'mixed' });
                                                                    }
                                                                } else {
                                                                    newIds.delete(svc.id);
                                                                    const newDates = { ...serviceDates };
                                                                    const newSlts = { ...serviceSlots };
                                                                    const newGenders = { ...serviceGenders };
                                                                    const newStaff = { ...selectedStaff };
                                                                    delete newDates[svc.id];
                                                                    delete newSlts[svc.id];
                                                                    delete newGenders[svc.id];
                                                                    delete newStaff[svc.id];
                                                                    delete newQuantities[svc.id];
                                                                    setServiceDates(newDates);
                                                                    setServiceSlots(newSlts);
                                                                    setServiceGenders(newGenders);
                                                                    setSelectedStaff(newStaff);
                                                                }
                                                                setServiceQuantities(newQuantities);
                                                                setSelectedServiceIds(newIds);
                                                            }}
                                                        />
                                                        <div className="space-y-1">
                                                            <div className="text-sm text-muted-foreground">{(svc.type.name?.en || '')}</div>
                                                            <div className="font-semibold">{typeof svc.name === 'string' ? svc.name : (svc.name?.en || '')}</div>
                                                            <div className="text-sm text-muted-foreground">{svc.price} $ • {svc.duration_minutes} min</div>
                                                        </div>
                                                    </div>
                                                    <div className="grid gap-2 text-sm md:text-right">
                                                        <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{t('bookings.quantity', 'Quantity')}</div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-9 w-9 p-0"
                                                                disabled={!selected || qty <= 1}
                                                                onClick={() => {
                                                                    const value = Math.max(1, qty - 1);
                                                                    setServiceQuantities({
                                                                        ...serviceQuantities,
                                                                        [svc.id]: value,
                                                                    });
                                                                }}
                                                            >
                                                                -
                                                            </Button>
                                                            <input
                                                                id={`service-qty-${svc.id}`}
                                                                type='number'
                                                                min='1'
                                                                value={qty}
                                                                disabled={!selected}
                                                                onChange={(event) => {
                                                                    const value = Math.max(1, Number(event.target.value) || 1);
                                                                    setServiceQuantities({
                                                                        ...serviceQuantities,
                                                                        [svc.id]: value,
                                                                    });
                                                                }}
                                                                className='w-20 rounded-lg border border-input bg-white px-2 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-amber-500'
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-9 w-9 p-0"
                                                                disabled={!selected}
                                                                onClick={() => {
                                                                    setServiceQuantities({
                                                                        ...serviceQuantities,
                                                                        [svc.id]: qty + 1,
                                                                    });
                                                                }}
                                                            >
                                                                +
                                                            </Button>
                                                        </div>
                                                        {!selected && (
                                                            <div className='text-xs text-muted-foreground'>Select the service to enable quantity</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Date/Time/Staff Configuration for Selected Services */}
                            {selectedServiceIds.size > 0 && (
                                <div className="space-y-4 border-t pt-4">
                                    <h3 className="font-semibold">{t('bookings.configureServices', 'Configure Selected Services')}</h3>
                                    {Array.from(selectedServiceIds).map((serviceId) => {
                                        const service = services.find((s: any) => s.id === serviceId);
                                        const slots = (availableSlots[serviceId] || []) as any[];
                                        return (
                                            <div key={serviceId} className="border rounded-lg p-4 space-y-3 bg-muted/30">
                                                <p className="font-semibold">{typeof service?.name === 'string' ? service.name : (service?.name?.en || '')}</p>

                                                {/* Date Picker */}
                                                <div className="space-y-2">
                                                    <Label>{t('bookings.date', 'Date')} *</Label>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className={cn('w-full justify-start', !serviceDates[serviceId] && 'text-muted-foreground')}
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {serviceDates[serviceId] ? format(serviceDates[serviceId], 'PPP') : t('common.pickDate', 'Pick a date')}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={serviceDates[serviceId]}
                                                                onSelect={(date) => setServiceDates({ ...serviceDates, [serviceId]: date })}
                                                                disabled={(date) => date < new Date()}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>

                                                {/* Time Slots */}
                                                {serviceDates[serviceId] && (
                                                    <div className="space-y-2">
                                                        <Label>{t('bookings.timeSlot', 'Time Slot')} *</Label>
                                                        {slots.length > 0 ? (
                                                            <div className="grid grid-cols-3 gap-2">
                                                                {slots.map((slot: any) => (
                                                                    <button
                                                                        key={slot.slot_id}
                                                                        onClick={() => setServiceSlots({ ...serviceSlots, [serviceId]: slot })}
                                                                        className={cn(
                                                                            'rounded-lg border-2 p-3 text-center transition-all text-sm',
                                                                            serviceSlots[serviceId]?.slot_id === slot.slot_id
                                                                                ? 'border-amber-500 bg-amber-50 font-semibold'
                                                                                : 'border-gray-200 bg-white hover:border-amber-300'
                                                                        )}
                                                                    >
                                                                        <div className="font-semibold">{slot.start_time}</div>
                                                                        <div className="text-xs text-muted-foreground">{slot.available_staff_count} staff</div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-muted-foreground">{t('bookings.noAvailableSlots', 'No available slots for this date')}</p>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Staff Assignment - Show available staff from selected slot */}
                                                {serviceSlots[serviceId]?.available_staff && (
                                                    <div className="space-y-2">
                                                        <Label>{t('bookings.staff', 'Available Staff')}</Label>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {serviceSlots[serviceId].available_staff.map((s: any) => (
                                                                <button
                                                                    key={s.staff_id}
                                                                    type="button"
                                                                    onClick={() => setSelectedStaff({ ...selectedStaff, [serviceId]: s })}
                                                                    className={cn(
                                                                        'rounded-lg border-2 p-3 text-left transition-all',
                                                                        selectedStaff[serviceId]?.staff_id === s.staff_id
                                                                            ? 'border-blue-500 bg-blue-50'
                                                                            : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                                                                    )}
                                                                >
                                                                    <div className="font-semibold text-sm">{s.staff_name}</div>
                                                                    <div className="text-xs text-muted-foreground">{s.specialization}</div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        Capacity: {s.max_concurrent_bookings - s.current_bookings}
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Gender Selection for Hammam Services */}
                                                {service?.has_sessions && (
                                                    <div className="space-y-2">
                                                        <Label>{t('bookingWizard.selectOptions.genderTitle', 'Gender for Hammam')}</Label>
                                                        <div className="flex gap-2">
                                                            {[
                                                                { id: 'female', label: t('bookingWizard.selectOptions.genderFemale', 'Women') },
                                                                { id: 'male', label: t('bookingWizard.selectOptions.genderMale', 'Men') },
                                                                { id: 'mixed', label: t('bookingWizard.selectOptions.genderMixed', 'Mixed') }
                                                            ].map((g: any) => (
                                                                <Button
                                                                    key={g.id}
                                                                    type="button"
                                                                    variant={(serviceGenders[serviceId] || 'mixed') === g.id ? 'default' : 'outline'}
                                                                    className="flex-1"
                                                                    onClick={() => setServiceGenders({ ...serviceGenders, [serviceId]: g.id })}
                                                                >
                                                                    {g.label}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="pt-4 border-t flex justify-between">
                                <Button 
                                    variant="outline"
                                    onClick={() => setStep('client')}
                                >
                                    ← {t('common.back', 'Back')}
                                </Button>
                                <Button 
                                    onClick={handleConfirmServices}
                                    disabled={selectedServiceIds.size === 0}
                                >
                                    {t('common.next', 'Next')}
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Step 3: Payment & Block Slots */}
                <TabsContent value="payment" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('bookings.addPayment', 'Payment & Confirm')}</CardTitle>
                            <CardDescription>{t('bookings.addPaymentDesc', 'Configure payment and block slots settings')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Detailed Receipt Summary */}
                            <div className="bg-muted p-4 rounded-lg space-y-3">
                                <p className="font-semibold text-lg">{t('bookings.bookingSummary', 'Booking Summary')}</p>
                                
                                {/* Client Info */}
                                <div className="border-b pb-3 space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">{t('common.client', 'Client')}</p>
                                    <p className="text-sm font-semibold">{selectedClient?.name}</p>
                                </div>
                                
                                {/* Services Detail */}
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">{t('bookings.services', 'Services')}</p>
                                    <div className="space-y-2">
                                        {formData.services.map((service, idx) => {
                                            const svc = services.find((s: any) => s.id === service.id);
                                            let staff = selectedStaff[service.id];
                                            const slot = serviceSlots[service.id];
                                            let isAutoSelected = false;

                                            // If no manual staff selection, get highest priority staff
                                            if (!staff && slot?.available_staff && slot.available_staff.length > 0) {
                                                const highestPriorityStaff = slot.available_staff.reduce((prev: any, current: any) => 
                                                    (current.priority > prev.priority) ? current : prev
                                                );
                                                staff = highestPriorityStaff;
                                                isAutoSelected = true;
                                            }

                                            return (
                                                <div key={idx} className="bg-white p-3 rounded border border-gray-200 space-y-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-semibold text-sm">{typeof svc?.name === 'string' ? svc.name : (svc?.name?.en || '')}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {new Date(service.start_datetime).toLocaleDateString()} • {new Date(service.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                        <p className="font-semibold text-sm">{svc?.price} DH</p>
                                                    </div>
                                                    {staff && (
                                                        <p className={cn(
                                                            'text-xs font-medium',
                                                            isAutoSelected ? 'text-green-600' : 'text-blue-600'
                                                        )}>
                                                            👤 {staff.staff_name} {isAutoSelected && '(auto-assigned)'}
                                                        </p>
                                                    )}
                                                    {service.preferred_gender && (
                                                        <p className="text-xs text-amber-600">
                                                            {service.preferred_gender === 'female' ? '👩 Femmes' : service.preferred_gender === 'male' ? '👨 Hommes' : '👥 Mixte'}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Form */}
                            <div className='space-y-6'>
                                <div className='grid gap-4 md:grid-cols-2'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='payment-amount'>{t('payments.amount', 'Amount')}</Label>
                                        <input
                                            id='payment-amount'
                                            type='number'
                                            min='0'
                                            value={paymentAmount}
                                            onChange={(event) => setPaymentAmount(event.target.value)}
                                            placeholder={serviceDepositTotal > 0 ? `${serviceDepositTotal.toFixed(2)}` : '0.00'}
                                            className='w-full rounded-lg border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500'
                                        />
                                        {serviceDepositTotal > 0 && (
                                            <p className='text-sm text-muted-foreground'>
                                                {t('bookings.depositRequired', 'Deposit required')}:{' '}
                                                <strong>{serviceDepositTotal.toFixed(2)} $</strong>
                                            </p>
                                        )}
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='payment-type'>{t('payments.method', 'Payment Method')}</Label>
                                        <select
                                            id='payment-type'
                                            value={paymentType}
                                            onChange={(event) => setPaymentType(event.target.value as any)}
                                            className='w-full rounded-lg border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500'
                                        >
                                            <option value='cash'>{t('payments.method_cash', 'Cash')}</option>
                                            <option value='card'>{t('payments.method_card', 'Card')}</option>
                                            <option value='bank_transfer'>{t('payments.method_transfer', 'Bank Transfer')}</option>
                                            <option value='online'>{t('payments.method_online', 'Online')}</option>
                                        </select>
                                    </div>
                                </div>

                                {paymentType === 'card' ? (
                                    <div className='rounded-xl border border-amber-200 bg-white p-4 shadow-sm'>
                                        <div className='mb-4 flex items-center gap-3'>
                                            <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-900'>
                                                <CreditCard className='h-5 w-5' />
                                            </div>
                                            <div>
                                                <p className='text-base font-semibold text-amber-900'>
                                                    {t('bookingWizard.review.securePayment', 'Secure payment')}
                                                </p>
                                                <p className='text-sm text-muted-foreground'>
                                                    {t('bookingWizard.review.paymentDescription', 'Enter your card details below to complete your booking payment.')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className='space-y-4'>
                                            <div className='space-y-2'>
                                                <Label htmlFor='card-holder-name'>{t('subscriptionCheckout.cardHolder', 'Card holder name')}</Label>
                                                <input
                                                    id='card-holder-name'
                                                    value={cardHolderName}
                                                    onChange={(event) => setCardHolderName(event.target.value)}
                                                    placeholder={t('subscriptionCheckout.cardHolderPlaceholder', 'Name on card')}
                                                    className='w-full rounded-lg border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500'
                                                />
                                            </div>

                                            {squareConfigured ? (
                                                <PaymentForm
                                                    key={paymentFormKey}
                                                    applicationId={squareApplicationId!}
                                                    locationId={squareLocationId!}
                                                    cardTokenizeResponseReceived={(tokenResult: any, verifiedBuyer?: any) => {
                                                        if (!paymentAmount || Number(paymentAmount) <= 0) {
                                                            toast({
                                                                variant: 'destructive',
                                                                title: t('common.error', 'Error'),
                                                                description: t('payments.amountRequired', 'Please enter a valid payment amount'),
                                                            });
                                                            return;
                                                        }

                                                        if (!cardHolderName.trim()) {
                                                            toast({
                                                                variant: 'destructive',
                                                                title: t('common.error', 'Error'),
                                                                description: t('subscriptionCheckout.cardHolderRequired', 'Please enter the card holder name.'),
                                                            });
                                                            return;
                                                        }

                                                        if (tokenResult?.status !== 'OK' || !tokenResult?.token) {
                                                            const errorMessages = tokenResult?.errors?.map((error: any) => error.message).filter(Boolean) || [];
                                                            const errorString = errorMessages.join(', ').toLowerCase();
                                                            const isSessionExpired = errorString.includes('expired') || errorString.includes('session') || errorString.includes('timeout');

                                                            if (isSessionExpired) {
                                                                toast({
                                                                    variant: 'destructive',
                                                                    title: t('common.error', 'Error'),
                                                                    description: t('bookingWizard.payment.sessionExpired', 'Your payment session has expired. Please enter your card details again.'),
                                                                });
                                                                setPaymentFormKey(prev => prev + 1);
                                                            } else {
                                                                toast({
                                                                    variant: 'destructive',
                                                                    title: t('common.error', 'Error'),
                                                                    description: errorMessages.join(', ') || t('subscriptionCheckout.cardError', 'Card processing error'),
                                                                });
                                                            }
                                                            return;
                                                        }

                                                        handleSubmitBooking({
                                                            type: 'card',
                                                            amount: paymentAmount,
                                                            source_id: tokenResult.token,
                                                            card_holder: cardHolderName.trim(),
                                                            verification_token: verifiedBuyer?.token,
                                                        });
                                                    }}
                                                    createVerificationDetails={() => {
                                                        const fallbackName = (cardHolderName || selectedClient?.name || 'Guest User').trim();
                                                        const [givenName, ...familyNameParts] = fallbackName.split(' ');
                                                        return {
                                                            amount: String(paymentAmount),
                                                            currencyCode: import.meta.env.VITE_SQUARE_CURRENCY || 'CAD',
                                                            intent: 'CHARGE',
                                                            billingContact: {
                                                                givenName,
                                                                familyName: familyNameParts.join(' ') || givenName,
                                                                email: selectedClient?.email || '',
                                                                phone: selectedClient?.phone || '',
                                                                countryCode: 'CA',
                                                            },
                                                        };
                                                    }}
                                                >
                                                    <SquareCreditCard
                                                        buttonProps={{
                                                            isLoading: createBookingMutation.isPending,
                                                            className: 'mt-4 w-full h-12 rounded-lg bg-amber-600 text-white hover:bg-amber-700',
                                                        }}
                                                        className='w-full rounded-2xl border border-slate-200 bg-slate-50 p-4'
                                                    >
                                                        {createBookingMutation.isPending ? (
                                                            <>
                                                                <Loader2 className='mr-2 inline h-4 w-4 animate-spin' />
                                                                {t('bookingWizard.review.confirming', 'Confirming...')}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Lock className='mr-2 inline h-4 w-4' />
                                                                {t('bookings.payWithCard', 'Pay with card')}
                                                            </>
                                                        )}
                                                    </SquareCreditCard>
                                                </PaymentForm>
                                            ) : (
                                                <Alert>
                                                    <AlertDescription className='text-sm'>
                                                        Add `VITE_SQUARE_APP_ID` and `VITE_SQUARE_LOCATION_ID` to your Vite env to enable card payments.
                                                    </AlertDescription>
                                                </Alert>
                                            )}

                                            <div className='flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800'>
                                                <Shield className='h-4 w-4 shrink-0' />
                                                {t('bookingWizard.guarantee.securedBy', 'Secured payment by Square')}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => handleSubmitBooking({ type: paymentType, amount: paymentAmount })}
                                        disabled={createBookingMutation.isPending}
                                    >
                                        {t('bookings.createBooking', 'Create Booking')}
                                    </Button>
                                )}
                            </div>

                            {/* Block Slots Checkbox */}
                            <div className="border-t pt-4 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Checkbox 
                                        id="block-slots"
                                        checked={formData.block_slots || false}
                                        onCheckedChange={(checked) => setFormData({ ...formData, block_slots: !!checked })}
                                    />
                                    <label htmlFor="block-slots" className="text-sm font-medium cursor-pointer">
                                        {t('bookings.blockSlots', 'Block slots to prevent other bookings during this time')}
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 border-t flex justify-between">
                                <Button 
                                    variant="outline"
                                    onClick={() => setStep('services')}
                                >
                                    ← {t('common.back', 'Back')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
