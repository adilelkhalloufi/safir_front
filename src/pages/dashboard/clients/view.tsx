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
import { Mail, Phone, MapPin, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

export default function ClientsView() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        setPageTitle(t('clients.viewTitle', 'Client Details'));
    }, [t]);

    const { data: client, isLoading } = useQuery({
        queryKey: ['client', id],
        queryFn: async () => {
            const response = await http.get(apiRoutes.adminClientById(parseInt(id!)));
            return response.data;
        },
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (!client) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <h2 className="text-2xl font-bold mb-4">{t('clients.notFound', 'Client not found')}</h2>
                <Button onClick={() => navigate(webRoutes.clients.index)}>
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
                        {client.first_name} {client.last_name}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('clients.viewSubtitle', 'Client information and history')}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(webRoutes.clients.index)}>
                        {t('common.back', 'Back')}
                    </Button>
                    <Button onClick={() => navigate(webRoutes.clients.edit.replace(':id', id!))}>
                        {t('common.edit', 'Edit')}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {t('clients.personalInfo', 'Personal Information')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('common.name', 'Name')}</p>
                            <p className="text-base">
                                {client.first_name} {client.last_name}
                            </p>
                        </div>

                        <Separator />

                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('common.email', 'Email')}</p>
                                <p className="text-base">{client.email}</p>
                            </div>
                        </div>

                        {client.phone && (
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('common.phone', 'Phone')}</p>
                                    <p className="text-base">{client.phone}</p>
                                </div>
                            </div>
                        )}

                        {client.address && (
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('common.address', 'Address')}</p>
                                    <p className="text-base">{client.address}</p>
                                </div>
                            </div>
                        )}

                        <Separator />

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('clients.status', 'Status')}</p>
                            <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                                {t(`clients.status_${client.status}`) as string}
                            </Badge>
                        </div>

                        {client.created_at && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('clients.memberSince', 'Member Since')}</p>
                                    <p className="text-base">{format(new Date(client.created_at), 'PPP')}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('clients.statistics', 'Statistics')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('clients.totalBookings', 'Total Bookings')}</p>
                            <p className="text-3xl font-bold">{client.bookings_count || 0}</p>
                        </div>

                        <Separator />

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('clients.totalSpent', 'Total Spent')}</p>
                            <p className="text-3xl font-bold">{client.total_spent || 0} DH</p>
                        </div>

                        <Separator />

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('clients.activeSubscriptions', 'Active Subscriptions')}</p>
                            <p className="text-3xl font-bold">{client.active_subscriptions_count || 0}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {client.bookings && client.bookings.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>{t('clients.recentBookings', 'Recent Bookings')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {client.bookings.slice(0, 5).map((booking: any) => (
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
                                        <p className="text-sm font-semibold mt-1">{booking.total_price} DH</p>
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
