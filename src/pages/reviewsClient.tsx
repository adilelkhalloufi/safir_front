import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiRoutes } from '@/routes/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';
import http from '@/utils/http';
import HeaderBooking from './landing/booking/HeaderBooking';
import { useState, useCallback, memo, useMemo } from 'react';
import MagicForm, { MagicFormGroupProps } from '@/components/custom/MagicForm';

const ReviewsClient = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const { data: bookingData, isLoading, error } = useQuery({
        queryKey: ['reviewsBooking', id],
        queryFn: () =>
            http.get(apiRoutes.reviewsBooking(id!)).then((res) => {
                setSubmitError(res.data.message || null);
                return res.data?.data;
            }),
        enabled: !!id,
    });

    const formFields = useMemo(() => {
        if (!bookingData?.booking_items) return [];

        const groups: MagicFormGroupProps[] = bookingData.booking_items.map((item: any) => ({
            group: item.service?.name?.en || item.service?.name || 'Service',
            fields: [
            
                {
                    name: `staff_${item.id}`,
                    label: t('reviews.staff', 'Staff'),
                    type: 'label',
                    value: item.staff?.user?.name || 'N/A',
                },
                {
                    name: `rating_${item.id}`,
                    label: t('reviews.rating', 'Rating'),
                    type: 'rating',
                    required: true,
                },
                {
                    name: `comment_${item.id}`,
                    label: t('reviews.comment', 'Comment'),
                    type: 'textarea',
                    placeholder: t('reviews.commentPlaceholder', 'Share your experience...'),
                },
            ],
        }));

        return groups;
    }, [bookingData, t]);

    const handleSubmit = useCallback((formData: any) => {
        const reviewsData = bookingData?.booking_items?.map((item: any) => ({
            bookingItemId: item.id,
            serviceName: item.service?.name?.en || item.service?.name,
            rating: formData[`rating_${item.id}`] || 0,
            comment: formData[`comment_${item.id}`] || '',
        })) || [];

        const payload = {
            bookingId: bookingData?.id,
            clientId: bookingData?.client?.id,
            bookingReference: bookingData?.reference,
            reviews: reviewsData,
        };

        http.post(apiRoutes.reviewsSubmit, payload)
            .then((res) => {
                if (res.data.success === false) {
                    setSubmitError(res.data.message);
                    setSubmitSuccess(false);
                } else {
                    setSubmitError(null);
                    setSubmitSuccess(true);
                }
            })
            .catch((err) => {
                console.error('Reviews submission error:', err);
                setSubmitError('An error occurred while submitting the reviews. Please try again.');
            });
    }, [bookingData]);

    if (isLoading) {
        return (
            <>
                <HeaderBooking />
                <div className="container mx-auto p-4 mt-28">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('reviews.loading', 'Loading Reviews...')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <HeaderBooking />
                <div className="container mx-auto p-4 mt-28">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('reviews.errorTitle', 'Reviews Error')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {t('reviews.errorMessage', 'Unable to load reviews. Please try again later.')}
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    if (!bookingData) {
        return (
            <>
                <HeaderBooking />
                <div className="container mx-auto p-4 mt-28">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('reviews.notFoundTitle', 'Reviews Not Found')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Alert variant="destructive">
                                <AlertDescription>
                                     {submitError || t('reviews.notFoundMessage')}

                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    if (submitSuccess) {
        return (
            <>
                <HeaderBooking />
                <div className="container mx-auto p-4 mt-28">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('reviews.thankYou', 'Thank You')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center mb-4">
                                <CheckCircle2 className="h-16 w-16 text-green-500" />
                            </div>
                            <p className="text-center mb-4">
                                {t('reviews.thankYouMessage', 'Thank you for your reviews!')}
                            </p>
                            <div className="flex justify-center">
                                <Button onClick={() => navigate(-1)}>
                                    {t('common.back', 'Back')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    return (
        <>
            <HeaderBooking />
            <div className="container mx-auto p-4 mt-28 space-y-6">
                {/* Booking Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('reviews.bookingSummary', 'Booking Summary')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('reviews.bookingReference', 'Booking Reference')}
                                </p>
                                <p className="text-base font-mono">{bookingData.reference}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('reviews.clientName', 'Client Name')}
                                </p>
                                <p className="text-base">{bookingData.client?.name}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {submitError && (
                    <Alert variant="destructive">
                        <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                )}

                {/* Reviews */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('reviews.title', 'Leave Your Reviews')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MagicForm
                            fields={formFields}
                            onSubmit={handleSubmit}
                            title=''
                            showButton={true}
                            button={t('reviews.submit', 'Submit Reviews')}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default memo(ReviewsClient);