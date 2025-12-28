import { useEffect } from 'react';
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
            return response.data;
        },
        enabled: !!id,
    });

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            draft: 'bg-gray-500',
            confirmed: 'bg-blue-500',
            cancelled: 'bg-red-500',
            no_show: 'bg-orange-500',
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
                        {t('bookings.viewTitle', 'Booking Details')} #{booking.id}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('bookings.viewSubtitle', 'View booking information')}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(webRoutes.bookings.index)}>
                        {t('common.back', 'Back')}
                    </Button>
                    <Button onClick={() => navigate(webRoutes.bookings.edit.replace(':id', id!))}>
                        {t('common.edit', 'Edit')}
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

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('bookings.startDateTime', 'Start Date & Time')}</p>
                            <p className="text-base">{format(new Date(booking.start_datetime), 'PPP p')}</p>
                        </div>

                        {booking.end_datetime && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('bookings.endDateTime', 'End Date & Time')}</p>
                                <p className="text-base">{format(new Date(booking.end_datetime), 'PPP p')}</p>
                            </div>
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
                                {booking.user?.first_name} {booking.user?.last_name}
                            </p>
                        </div>

                        {booking.user?.email && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('common.email', 'Email')}</p>
                                <p className="text-base">{booking.user.email}</p>
                            </div>
                        )}

                        {booking.user?.phone && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('common.phone', 'Phone')}</p>
                                <p className="text-base">{booking.user.phone}</p>
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
                            <div key={item.id} className="flex justify-between items-start p-4 border rounded-lg">
                                <div className="flex-1">
                                    <h4 className="font-semibold">{item.service?.name}</h4>
                                    <p className="text-sm text-muted-foreground">{item.service?.description}</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {item.service?.duration_minutes} min
                                        </span>
                                        {item.staff && (
                                            <span className="flex items-center gap-1">
                                                <User className="h-4 w-4" />
                                                {item.staff.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{item.service?.price} DH</p>
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
                            <span className="text-2xl font-bold">{booking.total_price} DH</span>
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
        </div>
    );
}
