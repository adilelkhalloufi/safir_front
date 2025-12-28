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
import { Calendar, Package, Clock, CheckCircle2 } from 'lucide-react';

export default function SubscriptionsView() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        setPageTitle(t('subscriptions.viewTitle', 'Subscription Details'));
    }, [t]);

    const { data: subscription, isLoading } = useQuery({
        queryKey: ['subscription', id],
        queryFn: async () => {
            const response = await http.get(apiRoutes.adminSubscriptionById(parseInt(id!)));
            return response.data;
        },
        enabled: !!id,
    });

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            active: 'bg-green-500',
            expired: 'bg-red-500',
            suspended: 'bg-orange-500',
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

    if (!subscription) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <h2 className="text-2xl font-bold mb-4">{t('subscriptions.notFound', 'Subscription not found')}</h2>
                <Button onClick={() => navigate(webRoutes.subscriptions.index)}>
                    {t('common.backToList', 'Back to list')}
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{subscription.name}</h1>
                    <p className="text-muted-foreground">
                        {t('subscriptions.viewSubtitle', 'Subscription package details')}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(webRoutes.subscriptions.index)}>
                        {t('common.back', 'Back')}
                    </Button>
                    <Button onClick={() => navigate(webRoutes.subscriptions.edit.replace(':id', id!))}>
                        {t('common.edit', 'Edit')}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            {t('subscriptions.subscriptionInfo', 'Subscription Information')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('subscriptions.status', 'Status')}</p>
                            <Badge className={getStatusColor(subscription.status)}>
                                {t(`subscriptions.status_${subscription.status}`) as string}
                            </Badge>
                        </div>

                        <Separator />

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('subscriptions.description', 'Description')}</p>
                            <p className="text-base">{subscription.description || '-'}</p>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('subscriptions.totalSessions', 'Total Sessions')}</p>
                                <p className="text-2xl font-bold">{subscription.total_sessions}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('subscriptions.usedSessions', 'Used Sessions')}</p>
                                <p className="text-2xl font-bold">{subscription.used_sessions || 0}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('subscriptions.remainingSessions', 'Remaining Sessions')}</p>
                            <p className="text-2xl font-bold text-green-600">
                                {subscription.total_sessions - (subscription.used_sessions || 0)}
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('subscriptions.validityDays', 'Validity')}</p>
                            <p className="text-base">{subscription.validity_days} {t('common.days', 'days')}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            {t('subscriptions.dates', 'Dates & Pricing')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {subscription.start_date && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('subscriptions.startDate', 'Start Date')}</p>
                                <p className="text-base">{format(new Date(subscription.start_date), 'PPP')}</p>
                            </div>
                        )}

                        {subscription.end_date && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('subscriptions.endDate', 'End Date')}</p>
                                <p className="text-base">{format(new Date(subscription.end_date), 'PPP')}</p>
                            </div>
                        )}

                        <Separator />

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('subscriptions.price', 'Price')}</p>
                            <p className="text-3xl font-bold">{subscription.price} DH</p>
                        </div>

                        {subscription.user && (
                            <>
                                <Separator />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('subscriptions.client', 'Client')}</p>
                                    <p className="text-base">
                                        {subscription.user.first_name} {subscription.user.last_name}
                                    </p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {subscription.services && subscription.services.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            {t('subscriptions.includedServices', 'Included Services')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            {subscription.services.map((service: any) => (
                                <div key={service.id} className="flex items-start justify-between p-4 border rounded-lg">
                                    <div className="flex-1">
                                        <h4 className="font-semibold">{service.name}</h4>
                                        <p className="text-sm text-muted-foreground">{service.description}</p>
                                        <div className="flex items-center gap-2 mt-2 text-sm">
                                            <Clock className="h-4 w-4" />
                                            <span>{service.duration_minutes} min</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{service.price} DH</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {subscription.bookings && subscription.bookings.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>{t('subscriptions.bookingHistory', 'Booking History')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {subscription.bookings.map((booking: any) => (
                                <div key={booking.id} className="flex justify-between items-center p-4 border rounded-lg">
                                    <div>
                                        <p className="font-semibold">
                                            {t('bookings.booking', 'Booking')} #{booking.id}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(booking.start_datetime), 'PPP p')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <Badge>{booking.status}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
