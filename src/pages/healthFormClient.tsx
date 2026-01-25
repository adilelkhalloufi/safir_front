import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiRoutes } from '@/routes/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import http from '@/utils/http';
import HeaderBooking from './landing/booking/HeaderBooking';
import HealthQuestionsForm from '@/components/custom/HealthQuestionsForm';
import { useMemo, useState } from 'react';

const HealthFormClient = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();

    // State for common fields
    const [commonFields, setCommonFields] = useState({
        email: '',
        nom: '',
        telephone: '',
        codePostal: '',
        acceptConditions: false,
        acceptMarketing: false,
    });

    // State to store answers from each service's health form
    const [serviceAnswers, setServiceAnswers] = useState<Record<number, Record<string, { question: string; value: any }>>>({});

    const { data: healthFormData, isLoading, error } = useQuery({
        queryKey: ['healthFormBooking', id],
        queryFn: () =>
            http.get(apiRoutes.healthFormBooking(id!)).then((res) => res.data?.data),
        enabled: !!id,
    });

    // Extract health questions from booking items that require health forms
    const healthQuestionsData = useMemo(() => {
        if (!healthFormData?.booking_items) return null;

        const questionsByService: Array<{
            serviceId: number;
            serviceName: string;
            questions: any[];
        }> = [];

        healthFormData.booking_items.forEach((item: any) => {
            if (item.service?.requires_health_form && item.service?.health_questions) {
                // Add common fields to each service's questions
                const commonQuestions = [
                    {
                        id: 'email',
                        question: { en: 'Email', fr: 'Email' },
                        type: 'email',
                        required: true,
                        placeholder: { en: 'your.email@example.com', fr: 'votre.email@example.com' }
                    },
                    {
                        id: 'nom',
                        question: { en: 'Name', fr: 'Nom' },
                        type: 'text',
                        required: true,
                        placeholder: { en: 'Your full name', fr: 'Votre nom complet' }
                    },
                    {
                        id: 'telephone',
                        question: { en: 'Phone Number', fr: 'Numéro de téléphone' },
                        type: 'tel',
                        required: true,
                        placeholder: { en: '(506) 123-4567', fr: '(506) 123-4567' }
                    },
                    {
                        id: 'codePostal',
                        question: { en: 'Postal Code', fr: 'Code Postal' },
                        type: 'text',
                        required: false,
                        placeholder: { en: 'E1A 1A1', fr: 'E1A 1A1' }
                    }
                ];

                questionsByService.push({
                    serviceId: item.service.id,
                    serviceName: item.service.name?.[healthFormData.language || 'en'] || item.service.name?.en,
                    questions: [...commonQuestions, ...item.service.health_questions],
                });
            }
        });

        return questionsByService.length > 0 ? questionsByService : null;
    }, [healthFormData]);

    const handleHealthFormSubmit = (serviceId: number, answers: Record<string, { question: string; value: any }>) => {
        console.log(`Health form submitted for service ${serviceId} with answers:`, answers);
        // Store the answers for this service
        setServiceAnswers(prev => ({
            ...prev,
            [serviceId]: answers
        }));
    };

    const handleCommonFieldChange = (field: string, value: any) => {
        setCommonFields(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFinalSubmit = () => {
        // Create array of client objects with answers
        const clientsData = healthQuestionsData?.map(serviceData => {
            const answers = serviceAnswers[serviceData.serviceId] || {};
            return {
                serviceId: serviceData.serviceId,
                serviceName: serviceData.serviceName,
                client: {
                    email: answers.email?.value || '',
                    nom: answers.nom?.value || '',
                    telephone: answers.telephone?.value || '',
                    codePostal: answers.codePostal?.value || '',
                },
                answers: Object.entries(answers).reduce((acc, [key, answer]) => {
                    if (key !== 'email' && key !== 'nom' && key !== 'telephone' && key !== 'codePostal') {
                        acc[key] = answer;
                    }
                    return acc;
                }, {} as Record<string, { question: string; value: any }>),
                acceptConditions: { question: 'J\'accepte les Conditions générales', value: commonFields.acceptConditions },
                acceptMarketing: { question: 'Communications marketing (optionnelles)', value: commonFields.acceptMarketing },
            };
        }) || [];

        const allFormData = {
            bookingReference: healthFormData?.reference,
            clientInfo: healthFormData?.client,
            clients: clientsData,
        };

        console.log('Final form submission:', allFormData);
        // Here you would send allFormData to the backend
    };

    if (isLoading) {
        return (
            <>
                <HeaderBooking />
                <div className="container mx-auto p-4 mt-28">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('health.loading', 'Loading Health Form...')}</CardTitle>
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
                            <CardTitle>{t('health.errorTitle', 'Health Form Error')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {t('health.errorMessage', 'Unable to load health form. Please try again later.')}
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    if (!healthFormData) {
        return (
            <>
                <HeaderBooking />
                <div className="container mx-auto p-4 mt-28">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('health.notFoundTitle', 'Health Form Not Found')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Alert>
                                <AlertDescription>
                                    {t('health.notFoundMessage', 'No health form found for this booking.')}
                                </AlertDescription>
                            </Alert>
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
                        <CardTitle>{t('health.bookingSummary', 'Booking Summary')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('health.bookingReference', 'Booking Reference')}
                                </p>
                                <p className="text-base font-mono">{healthFormData.reference}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('health.clientName', 'Client Name')}
                                </p>
                                <p className="text-base">{healthFormData.client?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('health.totalPrice', 'Total Price')}
                                </p>
                                <p className="text-base font-semibold">${healthFormData.total_price}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('health.servicesRequiringHealthForm', 'Services Requiring Health Form')}
                                </p>
                                <p className="text-base">
                                    {healthFormData.booking_items?.filter((item: any) => item.service?.requires_health_form).length || 0}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Health Forms for each service */}
                {healthQuestionsData ? (
                    healthQuestionsData.map((serviceData) => (
                        <Card key={serviceData.serviceId}>
                            <CardHeader>
                                <CardTitle>
                                    {t('health.formTitle', 'Déclaration de santé')} - {serviceData.serviceName}
                                </CardTitle>
                                <div className="space-y-2">


                                    <p className="text-sm text-muted-foreground">
                                        {t('health.formDescription', 'Merci de remplir ce formulaire avant de pouvoir accéder au Hammam pour s\'assurer de votre santé et sécurité.')}
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <HealthQuestionsForm
                                    healthQuestions={serviceData.questions}
                                    initialAnswers={healthFormData.existing_answers?.[serviceData.serviceId] || {}}
                                    onSubmit={(answers) => handleHealthFormSubmit(serviceData.serviceId, answers)}
                                    onChange={(answers) => handleHealthFormSubmit(serviceData.serviceId, answers)}
                                    title={`${t('health.formTitle', 'Health Information')} - ${serviceData.serviceName}`}
                                    buttonText={t('health.submit', 'Submit Health Information')}
                                    showSubmitButton={false}
                                />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('health.noFormsRequired', 'No Health Forms Required')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Alert>
                                <AlertDescription>
                                    {t('health.noQuestions', 'No health questions required for the services in this booking.')}
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                )}

                {/* Acceptance Fields */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('health.termsAndConditions', 'Conditions et Communications')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start space-x-2">
                            <Checkbox
                                id="acceptConditions"
                                checked={commonFields.acceptConditions}
                                onCheckedChange={(checked) => handleCommonFieldChange('acceptConditions', checked)}
                                required
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="acceptConditions" className="text-sm font-medium">
                                    J'accepte les Conditions générales *
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    J'accepte les termes d'utilisation et le règlement de SAFIR Moroccan Hammam and Spa, ainsi que la réception de notifications SMS essentielles (confirmations de réservation, rappels de rendez-vous et alertes sécurité). Des frais de messages/textes peuvent s'appliquer. STOP au (506) 312-0931 pour annuler.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-2">
                            <Checkbox
                                id="acceptMarketing"
                                checked={commonFields.acceptMarketing}
                                onCheckedChange={(checked) => handleCommonFieldChange('acceptMarketing', checked)}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="acceptMarketing" className="text-sm font-medium">
                                    Communications marketing (optionnelles)
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Offres exclusives et promotions Nouveautés et événements du spa
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Final Submit Button */}
                <div className="flex justify-center">
                    <Button
                        onClick={handleFinalSubmit}
                        size="lg"
                        disabled={!commonFields.acceptConditions}
                        className="px-8"
                    >
                        {t('health.submitAllForms', 'Soumettre tous les formulaires')}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default HealthFormClient;