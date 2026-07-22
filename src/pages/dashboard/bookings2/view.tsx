import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { setPageTitle } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Clock, User, Package, CreditCard, FileText, ExternalLink, Edit } from 'lucide-react';

// Helper function to safely parse and format dates by hand for Safari compatibility
const formatDateTimeByHand = (dateString: string, formatType: 'full' | 'time' | 'time24' = 'full') => {
    if (!dateString) return '';

    // Safari fix: convert "YYYY-MM-DD HH:mm:ss" to "YYYY-MM-DDTHH:mm:ss"
    const safeString = dateString.includes('T') ? dateString : dateString.replace(' ', 'T');
    const d = new Date(safeString);

    if (isNaN(d.getTime())) return dateString;

    const pad = (n: number) => String(n).padStart(2, '0');

    if (formatType === 'time24') {
        return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    let hours = d.getHours();
    const minutes = pad(d.getMinutes());
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours || 12; // convert 0 to 12

    const timeString = `${hours}:${minutes} ${ampm}`;

    if (formatType === 'time') {
        return timeString;
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();

    // Equivalent to 'PPP p' format
    return `${month} ${day}, ${year}, ${timeString}`;
};

export default function BookingsView() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    useEffect(() => {
        setPageTitle(t('bookings.viewTitle', 'Booking Details'));
    }, [t]);

    const { data: booking, isLoading } = useQuery({
        queryKey: ['booking', id],
        queryFn: async () => {
            const response = await http.get(apiRoutes.adminBookingById(parseInt(id!)));
            return response.data.data;
        },
        enabled: !!id,
    });

    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDateDialogOpen, setIsEditDateDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [editDate, setEditDate] = useState<Date | undefined>(undefined);
    const [editStartTime, setEditStartTime] = useState('');
    const [editEndTime, setEditEndTime] = useState('');
    const [editServiceId, setEditServiceId] = useState<number | undefined>(undefined);

    const handleItemClick = (item: any) => {
        if (item.healthForm) {
            setSelectedItem(item);
            setIsDialogOpen(true);
        }
    };

    const { data: services } = useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            const response = await http.get(apiRoutes.adminServices);
            return response.data.data;
        },
    });

    const handleEditDateClick = (item: any) => {
        // Safari fix: ensure the date string has a 'T' before passing to new Date()
        const safeDateStr = item.start_datetime.includes('T') ? item.start_datetime : item.start_datetime.replace(' ', 'T');
        const startDate = new Date(safeDateStr);

        setEditingItem(item);
        setEditDate(startDate);
        setEditStartTime(formatDateTimeByHand(item.start_datetime, 'time24'));
        setEditEndTime(formatDateTimeByHand(item.end_datetime, 'time24'));
        setEditServiceId(item.service?.id || item.service_id);
        setIsEditDateDialogOpen(true);
    };

    const updateBookingMutation = useMutation({
        mutationFn: async (data: { itemId: number; date: Date; startTime: string; endTime: string; serviceId?: number }) => {
            const { itemId, date, startTime, endTime, serviceId } = data;

            // Format date as YYYY-MM-DD
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            // Combine date and time without timezone conversion
            const startDateTimeStr = `${dateStr}T${startTime}:00`;
            const endDateTimeStr = `${dateStr}T${endTime}:00`;

            const payload: any = {
                start_datetime: startDateTimeStr,
                end_datetime: endDateTimeStr,
            };

            if (serviceId) {
                payload.service_id = serviceId;
            }

            const response = await http.patch(apiRoutes.adminBookingItemUpdate(parseInt(id!), itemId), payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['booking', id] });
            toast({
                title: t('common.success', 'Success'),
                description: t('bookings.serviceUpdated', 'Booking updated successfully'),
            });
            setIsEditDateDialogOpen(false);
        },
        onError: (error: any) => {
            toast({
                title: t('common.error', 'Error'),
                description: error?.response?.data?.message || t('bookings.serviceUpdateError', 'Failed to update booking'),
                variant: 'destructive',
            });
        },
    });

    const handleSaveDateChange = () => {
        if (!editDate || !editStartTime || !editEndTime || !editingItem) {
            toast({
                title: t('common.error', 'Error'),
                description: t('bookings.fillAllFields', 'Please fill all fields'),
                variant: 'destructive',
            });
            return;
        }

        updateBookingMutation.mutate({
            itemId: editingItem.id,
            date: editDate,
            startTime: editStartTime,
            endTime: editEndTime,
            serviceId: editServiceId,
        });
    };

    const handleGoToHealthForm = (itemId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const healthFormUrl = webRoutes.healthFormClient.replace(':id', itemId.toString());
        window.open(healthFormUrl, '_blank');
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            draft: 'bg-gray-500',
            confirmed: 'bg-blue-500',
            deposit_paid: 'bg-emerald-500',
            cancelled: 'bg-red-500',
            'no-show': 'bg-orange-500',
            completed: 'bg-green-500',
        };
        return colors[status] || 'bg-gray-500';
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <h2 className="text-2xl font-bold mb-4">{t('bookings.notFound', 'Booking not found')}</h2>
                <Button onClick={() => navigate(webRoutes.bookings.index)}>
                    {t('common.backToList', 'Back to list')}
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        {t('bookings.viewTitle', 'Booking Details')} #{booking.id} ({booking.reference})
                    </h1>
                    <p className="text-muted-foreground">
                        {t('bookings.viewSubtitle', 'View booking information')}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(webRoutes.bookings.index)}>
                        {t('common.back', 'Back')}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            {t('bookings.bookingInfo', 'Booking Information')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('bookings.status', 'Status')}</p>
                            <Badge className={getStatusColor(booking.status)}>
                                {t(`bookings.status_${booking.status}`) as string}
                            </Badge>
                        </div>

                        <Separator />

                        {booking.booking_items && booking.booking_items.length > 0 && (
                            <>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('bookings.startDateTime', 'Start Date & Time')}</p>
                                    <p className="text-base">{formatDateTimeByHand(booking.booking_items[0].start_datetime, 'full')}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('bookings.endDateTime', 'End Date & Time')}</p>
                                    <p className="text-base">{formatDateTimeByHand(booking.booking_items[0].end_datetime, 'full')}</p>
                                </div>
                            </>
                        )}

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('bookings.groupSize', 'Group Size')}</p>
                            <p className="text-base">{booking.group_size || 1}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('bookings.language', 'Language')}</p>
                            <p className="text-base">{booking.language === 'fr' ? 'Français' : 'English'}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {t('bookings.clientInfo', 'Client Information')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('common.name', 'Name')}</p>
                            <p className="text-base">
                                {booking.client?.name || 'N/A'}
                            </p>
                        </div>

                        {booking.client?.email && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('common.email', 'Email')}</p>
                                <p className="text-base">{booking.client.email}</p>
                            </div>
                        )}

                        {booking.client?.phone && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('common.phone', 'Phone')}</p>
                                <p className="text-base">{booking.client.phone}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        {t('bookings.services', 'Services')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {booking.booking_items?.map((item: any) => (
                            <div key={item.id} className="border rounded-lg">
                                <div className={`flex justify-between items-start p-4 ${item.healthForm ? 'cursor-pointer hover:bg-gray-50' : ''}`} onClick={() => handleItemClick(item)}>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge style={{ backgroundColor: item.service?.type?.color }} className="text-white">
                                                {item.service?.type?.name?.[booking.language] || item.service?.type?.name?.en}
                                            </Badge>
                                            <h4 className="font-semibold">{item.service?.name?.[booking.language] || item.service?.name?.en}</h4>
                                            {item.healthForm && <FileText className="h-4 w-4 text-blue-500" />}
                                            {item.service?.requires_health_form && !item.healthForm && (
                                                <Badge variant="outline" className="text-orange-600 border-orange-600">
                                                    {t('bookings.healthFormRequired', 'Health Form Required')}
                                                </Badge>
                                            )}
                                        </div>
                                        {item.service?.description?.[booking.language] && (
                                            <p className="text-sm text-muted-foreground mb-2">{item.service.description[booking.language]}</p>
                                        )}
                                        <div className="flex items-center gap-4 mt-2 text-sm">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {item.duration_minutes} min
                                            </span>
                                            {item.staff && (
                                                <span className="flex items-center gap-1">
                                                    <User className="h-4 w-4" />
                                                    {item.staff.user?.name || item.staff.user?.email || `Staff #${item.staff.id}`} ({item.staff.specialization})
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {formatDateTimeByHand(item.start_datetime, 'full')} - {formatDateTimeByHand(item.end_datetime, 'time')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col gap-2 items-end">
                                        <p className="font-semibold">{item.price} $</p>
                                        {item.service?.requires_health_form && !item.healthForm && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={(e) => handleGoToHealthForm(item.id, e)}
                                                className="flex items-center gap-1"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                {t('bookings.goToHealthForm', 'Fill Health Form')}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="border-t px-4 py-2 bg-gray-50 flex justify-end">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditDateClick(item);
                                        }}
                                        className="flex items-center gap-1"
                                    >
                                        <Edit className="h-4 w-4" />
                                        {t('bookings.changeService', 'Change Service')}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {booking.total_price && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            {t('bookings.payment', 'Payment')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-medium">{t('bookings.totalPrice', 'Total Price')}</span>
                            <span className="text-2xl font-bold">{booking.total_price} $</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {booking.payments && booking.payments.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            {t('bookings.paymentHistory', 'Payment History')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {booking.payments.map((payment: any) => (
                                <div key={payment.id} className="flex justify-between items-start p-4 border rounded-lg">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant={payment.status === 'completed' || payment.status === 'deposit_paid' ? 'default' : payment.status === 'pending' ? 'secondary' : 'destructive'}>
                                                {payment.status}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {payment.payment_method.toUpperCase()}
                                            </span>
                                        </div>

                                        {payment.notes && (
                                            <p className="text-sm text-muted-foreground mb-2">{payment.notes}</p>
                                        )}
                                        <div className="flex flex-col gap-1 text-sm">
                                            {payment.paid_at && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {formatDateTimeByHand(payment.paid_at, 'full')}
                                                </span>
                                            )}
                                            {payment.square_payment_id && (
                                                <span className="text-muted-foreground font-mono text-xs">
                                                    ID: {payment.square_payment_id}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col gap-2 items-end">
                                        <p className="text-xl font-bold">{payment.amount} {payment.currency}</p>
                                        {payment.square_receipt_url && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => window.open(payment.square_receipt_url, '_blank')}
                                                className="flex items-center gap-1"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                {t('bookings.viewReceipt', 'View Receipt')}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {booking.notes && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            {t('bookings.notes', 'Notes')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-base whitespace-pre-wrap">{booking.notes}</p>
                    </CardContent>
                </Card>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{t('bookings.healthForm', 'Health Form')}</DialogTitle>
                    </DialogHeader>
                    {selectedItem && selectedItem.healthForm && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">{t('bookings.clientInfo', 'Client Information')}</h3>
                                <div className="space-y-2">
                                    <p><strong>{t('common.name', 'Name')}:</strong> {selectedItem.healthForm.user.name}</p>
                                    <p><strong>{t('common.email', 'Email')}:</strong> {selectedItem.healthForm.user.email}</p>
                                    <p><strong>{t('common.phone', 'Phone')}:</strong> {selectedItem.healthForm.user.phone}</p>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <h3 className="text-lg font-semibold mb-2">{t('bookings.answers', 'Answers')}</h3>
                                <div className="space-y-3">
                                    {selectedItem.healthForm.form_data.answers.map((answer: any, index: number) => (
                                        <div key={index} className="border-b pb-2">
                                            <p className="font-medium">{answer.question}</p>
                                            <p className="text-muted-foreground">{answer.value || t('common.notAnswered', 'Not answered')}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDateDialogOpen} onOpenChange={setIsEditDateDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {t('bookings.changeService', 'Change Service')}
                            {editingItem && (
                                <span className="block text-sm font-normal text-muted-foreground mt-1">
                                    {editingItem.service?.name?.[booking?.language] || editingItem.service?.name?.en}
                                </span>
                            )}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-service">{t('bookings.service', 'Service')}</Label>
                            <Select value={editServiceId?.toString()} onValueChange={(value) => setEditServiceId(parseInt(value))}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('bookings.selectService', 'Select a service')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {services?.map((service: any) => (
                                        <SelectItem key={service.id} value={service.id.toString()}>
                                            {service.name?.[booking?.language] || service.name?.en}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-date">{t('bookings.date', 'Date')}</Label>
                            <DatePicker
                                defaultValue={editDate}
                                onChange={(date) => setEditDate(date)}
                                label={t('bookings.selectDate', 'Select a date')}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-start-time">{t('bookings.startTime', 'Start Time')}</Label>
                            <Input
                                id="edit-start-time"
                                type="time"
                                value={editStartTime}
                                onChange={(e) => setEditStartTime(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-end-time">{t('bookings.endTime', 'End Time')}</Label>
                            <Input
                                id="edit-end-time"
                                type="time"
                                value={editEndTime}
                                onChange={(e) => setEditEndTime(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDateDialogOpen(false)}
                            disabled={updateBookingMutation.isPending}
                        >
                            {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button
                            onClick={handleSaveDateChange}
                            disabled={updateBookingMutation.isPending}
                        >
                            {updateBookingMutation.isPending ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}