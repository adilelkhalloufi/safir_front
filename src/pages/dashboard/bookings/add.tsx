import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import type { Service, Staff } from '@/interfaces/models';
import { toast } from '@/components/ui/use-toast';
import { setPageTitle } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const bookingFormSchema = z.object({
    service_ids: z.array(z.number()).min(1, 'At least one service is required'),
    start_datetime: z.string().min(1, 'Start date and time is required'),
    group_size: z.number().min(1).max(4).default(1),
    language: z.enum(['en', 'fr']).default('fr'),
    staff_preferences: z.array(z.number()).optional(),
    use_subscription: z.boolean().default(false),
    notes: z.string().max(500).optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function BookingsAdd() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [date, setDate] = useState<Date>();

    useEffect(() => {
        setPageTitle(t('bookings.addTitle', 'Create New Booking'));
    }, [t]);

    // Fetch services
    const { data: services = [] } = useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            const response = await http.get(apiRoutes.services);
            return response.data || [];
        },
    });

    // Fetch staff
    const { data: staff = [] } = useQuery({
        queryKey: ['staff'],
        queryFn: async () => {
            const response = await http.get(apiRoutes.staff);
            return response.data || [];
        },
    });

    const form = useForm<BookingFormValues>({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            service_ids: [],
            group_size: 1,
            language: 'fr',
            staff_preferences: [],
            use_subscription: false,
            notes: '',
        },
    });

    const createBookingMutation = useMutation({
        mutationFn: (data: BookingFormValues) => http.post(apiRoutes.bookings, data),
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
                description: error?.message || t('bookings.createError', 'Failed to create booking'),
            });
        },
    });

    const onSubmit = (data: BookingFormValues) => {
        createBookingMutation.mutate(data);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{t('bookings.addTitle', 'Create New Booking')}</h1>
                    <p className="text-muted-foreground">
                        {t('bookings.addSubtitle', 'Fill in the booking details below')}
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate(webRoutes.bookings.index)}>
                    {t('common.cancel', 'Cancel')}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('bookings.bookingDetails', 'Booking Details')}</CardTitle>
                    <CardDescription>{t('bookings.bookingDetailsDesc', 'Enter the booking information')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="service_ids"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('bookings.services', 'Services')}</FormLabel>
                                        <FormDescription>
                                            {t('bookings.servicesDesc', 'Select one or more services')}
                                        </FormDescription>
                                        <div className="space-y-2">
                                            {services.map((service: Service) => (
                                                service.id && (
                                                    <div key={service.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            checked={field.value?.includes(service.id)}
                                                            onCheckedChange={(checked) => {
                                                                if (!service.id) return;
                                                                const newValue = checked
                                                                    ? [...(field.value || []), service.id]
                                                                    : field.value?.filter((id) => id !== service.id) || [];
                                                                field.onChange(newValue);
                                                            }}
                                                        />
                                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                            {typeof service.name === 'string' ? service.name : (service.name?.fr || service.name?.en || '')} - {service.price} DH - {service.duration_minutes} min
                                                        </label>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="start_datetime"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>{t('bookings.startDateTime', 'Start Date & Time')}</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                'w-full pl-3 text-left font-normal',
                                                                !field.value && 'text-muted-foreground'
                                                            )}
                                                        >
                                                            {field.value ? format(new Date(field.value), 'PPP p') : <span>{t('common.pickDate', 'Pick a date')}</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={date}
                                                        onSelect={(date) => {
                                                            setDate(date);
                                                            if (date) {
                                                                field.onChange(date.toISOString());
                                                            }
                                                        }}
                                                        disabled={(date) => date < new Date()}
                                                        initialFocus
                                                    />
                                                    <div className="p-3 border-t">
                                                        <Input
                                                            type="time"
                                                            onChange={(e) => {
                                                                if (date) {
                                                                    const [hours, minutes] = e.target.value.split(':');
                                                                    const newDate = new Date(date);
                                                                    newDate.setHours(parseInt(hours), parseInt(minutes));
                                                                    field.onChange(newDate.toISOString());
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="group_size"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('bookings.groupSize', 'Group Size')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={4}
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="language"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('bookings.language', 'Language')}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('bookings.selectLanguage', 'Select language')} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="fr">{t('common.french', 'French')}</SelectItem>
                                                    <SelectItem value="en">{t('common.english', 'English')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="staff_preferences"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('bookings.staffPreferences', 'Staff Preferences')}</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange([parseInt(value)])}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('bookings.selectStaff', 'Select staff (optional)')} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {staff.filter((s: Staff) => s.id).map((s: Staff) => (
                                                        <SelectItem key={s.id!} value={s.id!.toString()}>
                                                            {s.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="use_subscription"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>{t('bookings.useSubscription', 'Use Subscription')}</FormLabel>
                                            <FormDescription>
                                                {t('bookings.useSubscriptionDesc', 'Deduct from available subscription sessions')}
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('bookings.notes', 'Notes')}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t('bookings.notesPlaceholder', 'Special requests or notes (optional)')}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end space-x-4">
                                <Button type="button" variant="outline" onClick={() => navigate(webRoutes.bookings.index)}>
                                    {t('common.cancel', 'Cancel')}
                                </Button>
                                <Button type="submit" disabled={createBookingMutation.isPending}>
                                    {createBookingMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t('bookings.create', 'Create Booking')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
