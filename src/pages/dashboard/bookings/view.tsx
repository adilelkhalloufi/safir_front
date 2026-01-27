import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { setPageTitle } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Calendar, Clock, User, Package, CreditCard, FileText } from 'lucide-react';

export default function BookingsView() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

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

    const handleItemClick = (item: any) => {
        if (item.healthForm) {
            setSelectedItem(item);
            setIsDialogOpen(true);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            draft: 'bg-gray-500',
            confirmed: 'bg-blue-500',
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
                    {/* <Button onClick={() => navigate(webRoutes.bookings.edit.replace(':id', id!))}>
                        {t('common.edit', 'Edit')}
                    </Button> */}
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
                                    <p className="text-base">{format(new Date(booking.booking_items[0].start_datetime), 'PPP p')}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('bookings.endDateTime', 'End Date & Time')}</p>
                                    <p className="text-base">{format(new Date(booking.booking_items[0].end_datetime), 'PPP p')}</p>
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
                            <div key={item.id} className={`flex justify-between items-start p-4 border rounded-lg ${item.healthForm ? 'cursor-pointer hover:bg-gray-50' : ''}`} onClick={() => handleItemClick(item)}>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge style={{ backgroundColor: item.service?.type?.color }} className="text-white">
                                            {item.service?.type?.name?.[booking.language] || item.service?.type?.name?.en}
                                        </Badge>
                                        <h4 className="font-semibold">{item.service?.name?.[booking.language] || item.service?.name?.en}</h4>
                                        {item.healthForm && <FileText className="h-4 w-4 text-blue-500" />}
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
                                            {format(new Date(item.start_datetime), 'p')} - {format(new Date(item.end_datetime), 'p')}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{item.price} $</p>
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
        </div>
    );
}
