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
import { Combobox } from '@/components/ui/combobox';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, ChevronRight, Plus } from 'lucide-react';
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
    const [formData, setFormData] = useState<BookingFormData>({
        services: [],
        group_size: 1,
        language: 'en',
    });

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

    // Fetch available slots for selected services
    const { data: availableSlots = {} } = useQuery({
        queryKey: ['available-slots', Array.from(selectedServiceIds), Object.values(serviceDates)],
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
                            group_size: formData.group_size || 1,
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
            let staff = selectedStaff[serviceId];

            // If no staff manually selected, auto-select highest priority staff
            if (!staff && slot.available_staff && slot.available_staff.length > 0) {
                const highestPriorityStaff = slot.available_staff.reduce((prev: any, current: any) => 
                    (current.priority > prev.priority) ? current : prev
                );
                staff = highestPriorityStaff;
            }

            const service: any = {
                id: serviceId,
                quantity: formData.group_size,
                start_datetime: slot.start_datetime,
                end_datetime: slot.end_datetime,
                assigned_staff: staff ? [{ staff_id: staff.staff_id }] : [],
            };

            // Add gender preference for hammam services
            if (selectedSvc?.has_sessions) {
                service.preferred_gender = serviceGenders[serviceId] || 'mixed';
            }

            return service;
        });

        setFormData({
            ...formData,
            services: servicesArray,
        });
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

        const bookingData: BookingFormData = {
            ...formData,
            payment: {
                type: paymentData.type,
                amount: parseFloat(paymentData.amount),
                partial: false,
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
                                    {services.map((svc: any) => (
                                        <div key={svc.id} className="flex items-center space-x-2 p-3 border rounded hover:bg-muted/50 cursor-pointer">
                                            <Checkbox
                                                id={`service-${svc.id}`}
                                                checked={selectedServiceIds.has(svc.id)}
                                                onCheckedChange={(checked) => {
                                                    const newIds = new Set(selectedServiceIds);
                                                    if (checked) {
                                                        newIds.add(svc.id);
                                                        // Set default gender to mixed for new services
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
                                                        setServiceDates(newDates);
                                                        setServiceSlots(newSlts);
                                                        setServiceGenders(newGenders);
                                                        setSelectedStaff(newStaff);
                                                    }
                                                    setSelectedServiceIds(newIds);
                                                }}
                                            />
                                            <label htmlFor={`service-${svc.id}`} className="flex-1 cursor-pointer space-y-1">
                                                <div>{(svc.type.name?.en || '')}</div>
                                                <div className="font-semibold">{typeof svc.name === 'string' ? svc.name : (svc.name?.en || '')}</div>
                                                <div className="text-sm text-muted-foreground">{svc.price} $ • {svc.duration_minutes} min</div>
                                            </label>
                                        </div>
                                    ))}
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
                            <MagicForm
                                title={t('bookings.paymentDetails', 'Payment Details')}
                                fields={[
                                    {
                                        group: 'payment',
                                        fields: [
                                            {
                                                name: 'amount',
                                                label: t('payments.amount', 'Amount'),
                                                type: 'number',
                                                required: true,
                                                placeholder: '0.00',
                                                width: 'half',
                                            },
                                            {
                                                name: 'type',
                                                label: t('payments.method', 'Payment Method'),
                                                type: 'select',
                                                required: true,
                                                width: 'half',
                                                defaultValue: 'cash',
                                                options: [
                                                    { value: 'cash', name: t('payments.method_cash', 'Cash') },
                                                    { value: 'card', name: t('payments.method_card', 'Card') },
                                                    { value: 'bank_transfer', name: t('payments.method_transfer', 'Bank Transfer') },
                                                    { value: 'online', name: t('payments.method_online', 'Online') },
                                                ],
                                            },

                                        ],
                                    },
                                ]}
                                onSubmit={handleSubmitBooking}
                                button={t('bookings.createBooking', 'Create Booking')}
                                loading={createBookingMutation.isPending}
                            />

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
