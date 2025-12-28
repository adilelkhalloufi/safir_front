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
import { CreditCard, Calendar, FileText, User } from 'lucide-react';

export default function PaymentsView() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        setPageTitle(t('payments.viewTitle', 'Payment Details'));
    }, [t]);

    const { data: payment, isLoading } = useQuery({
        queryKey: ['payment', id],
        queryFn: async () => {
            const response = await http.get(apiRoutes.adminPaymentById(parseInt(id!)));
            return response.data;
        },
        enabled: !!id,
    });

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            success: 'bg-green-500',
            pending: 'bg-yellow-500',
            failed: 'bg-red-500',
            refunded: 'bg-gray-500',
            cancelled: 'bg-orange-500',
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

    if (!payment) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <h2 className="text-2xl font-bold mb-4">{t('payments.notFound', 'Payment not found')}</h2>
                <Button onClick={() => navigate(webRoutes.payments.index)}>
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
                        {t('payments.viewTitle', 'Payment Details')} #{payment.id}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('payments.viewSubtitle', 'View payment information')}
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate(webRoutes.payments.index)}>
                    {t('common.back', 'Back')}
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            {t('payments.paymentInfo', 'Payment Information')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('payments.status', 'Status')}</p>
                            <Badge className={getStatusColor(payment.status)}>
                                {t(`payments.status_${payment.status}`) as string}
                            </Badge>
                        </div>

                        <Separator />

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('payments.amount', 'Amount')}</p>
                            <p className="text-3xl font-bold">{payment.amount} DH</p>
                        </div>

                        <Separator />

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('payments.method', 'Payment Method')}</p>
                            <p className="text-base capitalize">{payment.payment_method || 'N/A'}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('payments.transactionId', 'Transaction ID')}</p>
                            <p className="text-base font-mono">{payment.transaction_id || 'N/A'}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            {t('payments.dates', 'Dates & Details')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {payment.created_at && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('payments.createdAt', 'Created At')}</p>
                                <p className="text-base">{format(new Date(payment.created_at), 'PPP p')}</p>
                            </div>
                        )}

                        {payment.updated_at && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('payments.updatedAt', 'Updated At')}</p>
                                <p className="text-base">{format(new Date(payment.updated_at), 'PPP p')}</p>
                            </div>
                        )}

                        {payment.refunded_at && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('payments.refundedAt', 'Refunded At')}</p>
                                <p className="text-base">{format(new Date(payment.refunded_at), 'PPP p')}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {payment.booking && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            {t('payments.relatedBooking', 'Related Booking')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center p-4 border rounded-lg">
                            <div>
                                <p className="font-semibold">
                                    {t('bookings.booking', 'Booking')} #{payment.booking.id}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(payment.booking.start_datetime), 'PPP p')}
                                </p>
                            </div>
                            <div className="text-right">
                                <Badge>{payment.booking.status}</Badge>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => navigate(webRoutes.bookings.view.replace(':id', payment.booking.id.toString()))}
                                >
                                    {t('common.view', 'View')}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {payment.user && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {t('payments.clientInfo', 'Client Information')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t('common.name', 'Name')}</p>
                            <p className="text-base">
                                {payment.user.first_name} {payment.user.last_name}
                            </p>
                        </div>

                        {payment.user.email && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('common.email', 'Email')}</p>
                                <p className="text-base">{payment.user.email}</p>
                            </div>
                        )}

                        {payment.user.phone && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('common.phone', 'Phone')}</p>
                                <p className="text-base">{payment.user.phone}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {payment.notes && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            {t('payments.notes', 'Notes')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-base whitespace-pre-wrap">{payment.notes}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
