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
import MagicForm from '@/components/custom/MagicForm';
import { useMemo, useState, useCallback, memo } from 'react';

const normalizeAnswerValue = (v: any) => {
    if (v && typeof v === 'object' && 'question' in v && 'value' in v) return v.value;
    return v;
};

const HealthFormClient = () => {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    // (common fields are stored per-service in MagicForm answers)

    // State to store answers from each service's health form
    const [serviceAnswers, setServiceAnswers] = useState<Record<number, Record<string, { question: string; value: any }>>>({});

    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Get current language from i18n
    const currentLang = i18n.language?.startsWith('fr') ? 'fr' : 'en';

    const { data: healthFormData, isLoading, error } = useQuery({
        queryKey: ['healthFormBooking', id],
        queryFn: () =>
            http.get(apiRoutes.healthFormBooking(id!)).then((res) => {
                setSubmitError(res.data.message || null);
                return res.data?.data
            }),
        enabled: !!id,
    });

    // Extract health questions from booking items that require health forms
    const healthQuestionsData = useMemo(() => {
        if (!healthFormData?.bookingItem) return null;

        const questionsByService: Array<{
            serviceId: number;
            bookingItemId: number;
            serviceName: string;
            questions: any[];
        }> = [];

        const item = healthFormData.bookingItem;
        const lang = currentLang;

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

            // Get service name based on language or fallback
            let serviceName = item.service.name;
            if (typeof serviceName === 'string') {
                // name is already a string
            } else if (serviceName?.[lang]) {
                serviceName = serviceName[lang];
            } else {
                serviceName = serviceName?.en || serviceName?.name_fr || 'Service';
            }

            questionsByService.push({
                serviceId: item.service.id,
                bookingItemId: item.id,
                serviceName: serviceName,
                questions: [...commonQuestions, ...item.service.health_questions],
            });
        }

        return questionsByService.length > 0 ? questionsByService : null;
    }, [healthFormData, currentLang]);


    // Build combined MagicForm groups (one group per service) and global initialValues
    const groups = useMemo(() => {
        if (!healthQuestionsData) return [] as any[];
        const lang = currentLang;
        return healthQuestionsData.map((serviceData) => {
            const idPrefix = `b${serviceData.bookingItemId}__`;
            const group: any = {
                serviceId: serviceData.serviceId,
                bookingItemId: serviceData.bookingItemId,
                group: serviceData.serviceName,
                hideGroupTitle: false,

                card: true,
                fields: [] as any[],
            };

            // Process all questions from serviceData (including common ones)
            (serviceData.questions || []).forEach((q: any) => {
                const fieldName = `${idPrefix}${q.id}`;
                const baseField: any = {
                    name: fieldName,
                    label: q.question?.[lang] || q.question?.en || q.id,
                    type: q.type === 'textarea' ? 'textarea' : q.type === 'number' ? 'number' : q.type === 'radio' ? 'radio' : q.type === 'label' ? 'label' : q.type === 'checkbox' ? 'checkbox' : 'text',
                    required: !!q.required,
                    placeholder: q.placeholder?.[lang] || undefined,
                };
                if (q.options && Array.isArray(q.options)) {
                    baseField.options = q.options.map((opt: any) => ({ value: opt.value, name: (opt.label?.[lang] || opt.label?.en || String(opt.value)) }));
                }
                if (q.conditional && q.conditional.field) {
                    const targetField = `${idPrefix}${q.conditional.field}`;
                    const expected = q.conditional.value;
                    baseField.showIf = (data: any) => data?.[targetField] === expected;
                }
                group.fields.push(baseField);
            });

            // (do not add accept fields per-service; add a single acceptance group later)

            return group;
        });
    }, [healthQuestionsData, currentLang]);

    const initialValues = useMemo(() => {
        const init: any = {};
        if (!groups || groups.length === 0) return init;
        groups.forEach((g: any) => {
            const p = `b${g.bookingItemId}__`;
            // Start client fields empty; prefill only from previously saved answers
            init[`${p}email`] = '';
            init[`${p}nom`] = '';
            init[`${p}telephone`] = '';
            init[`${p}codePostal`] = '';
            // prefill from saved answers if present (keyed by bookingItemId)
            const saved = serviceAnswers[g.bookingItemId];
            if (saved) {
                Object.entries(saved).forEach(([k, v]: any) => {
                    init[`${p}${k}`] = v?.value ?? v;
                });
            }
        });
        // Global acceptance fields (single instance)
        init['acceptConditions'] = false;
        init['acceptMarketing'] = false;
        return init;
    }, [groups, healthFormData, serviceAnswers]);

    // Add a single acceptance group appended to the service groups
    const groupsWithAcceptance = useMemo(() => {
        const lang = currentLang;
        const acceptanceGroup = {
            group: lang === 'fr' ? 'Termes et Conditions' : 'Terms and Conditions',
            hideGroupTitle: false,
            card: true,
            fields: [
                {
                    name: 'acceptConditions',
                    label: lang === 'fr'
                        ? "J'accepte les Conditions générales"
                        : 'I accept the Terms and Conditions',
                    type: 'checkbox',
                    required: true
                },
                {
                    name: 'acceptMarketing',
                    label: lang === 'fr'
                        ? "J'accepte de recevoir des communications marketing (optionnel)"
                        : 'I accept to receive marketing communications (optional)',
                    type: 'checkbox',
                    required: false
                },
            ],
        } as any;

        return [...groups, acceptanceGroup];
    }, [groups, currentLang]);

    const handleSubmit = useCallback((formResult: any) => {
        // Global acceptance values
        const globalAccept = formResult['acceptConditions'];
        const globalMarketing = formResult['acceptMarketing'];
        const lang = currentLang;

        // Build per-service answers and overall payload
        const clientsData = (groups || []).map((g: any) => {
            const p = `b${g.bookingItemId}__`;
            const answers: Record<string, { question: string; value: any }> = {};
            g.fields.forEach((f: any) => {
                const key = f.name;
                const rawKey = key.replace(p, '');
                const val = formResult[key];
                answers[rawKey] = { question: f.label || rawKey, value: val === undefined ? null : val };
            });

            return {
                bookingItemId: g.bookingItemId,
                serviceName: g.group,
                client: {
                    email: answers.email?.value || '',
                    name: answers.nom?.value || '',
                    phone: answers.telephone?.value || '',
                    postalCode: answers.codePostal?.value || '',
                },
                answers: Object.entries(answers).reduce((acc, [k, answer]) => {
                    if (k !== 'email' && k !== 'nom' && k !== 'telephone' && k !== 'codePostal') {
                        acc.push({ question: answer.question, value: normalizeAnswerValue(answer.value) });
                    }
                    return acc;
                }, [] as Array<{ question: string; value: any }>),
                acceptConditions: {
                    question: lang === 'fr'
                        ? "J'accepte les Conditions générales"
                        : 'I accept the Terms and Conditions',
                    value: globalAccept ?? null
                },
                acceptMarketing: {
                    question: lang === 'fr'
                        ? 'Communications marketing (optionnelles)'
                        : 'Marketing communications (optional)',
                    value: globalMarketing ?? null
                },
            };
        });

        // Persist all service answers in state (without acceptance fields)
        const newServiceAnswers: any = {};
        (groups || []).forEach((g: any) => {
            const p = `b${g.bookingItemId}__`;
            const map: any = {};
            g.fields.forEach((f: any) => {
                const raw = f.name.replace(p, '');
                map[raw] = { question: f.label || raw, value: formResult[f.name] === undefined ? null : formResult[f.name] };
            });
            newServiceAnswers[g.bookingItemId] = map;
        });
        setServiceAnswers(newServiceAnswers);

        const allFormData = {
            bookingReference: healthFormData?.booking?.reference,
            bookingItemId: healthFormData?.bookingItem?.id,
            clientInfo: healthFormData?.client,
            clients: clientsData,
        };

        console.log('Combined form submission:', allFormData);
        // send it to healthFormSubmit endpoint
        http.post(apiRoutes.healthFormSubmit, allFormData)
            .then((res) => {
                if (res.data.success === false) {
                    setSubmitError(res.data.message);
                    setSubmitSuccess(false);
                } else {
                    setSubmitError(null);
                    setSubmitSuccess(true);
                    console.log('Health form submission successful:', res.data);
                    // Optionally show a success message or redirect
                }
            })
            .catch((err) => {
                console.error('Health form submission error:', err);
                setSubmitError('An error occurred while submitting the form. Please try again.');
            });

    }, [groups, healthFormData, currentLang]);

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
                            <Alert variant={'destructive'}>
                                <AlertDescription>
                                    {submitError || t('health.notFoundMessage')}

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
                            <CardTitle>{t('health.thankYou', 'Thank You')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center mb-4">
                                <CheckCircle2 className="h-16 w-16 text-green-500" />
                            </div>
                            <p className="text-center mb-4">
                                {t('health.thankYouMessage', 'Thank you for your time and for completing the health forms. Our staff will review them shortly.')}
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
                        <CardTitle>{t('health.bookingSummary', 'Booking Summary')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('health.bookingReference', 'Booking Reference')}
                                </p>
                                <p className="text-base font-mono">{healthFormData.booking?.reference}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('health.clientName', 'Client Name')}
                                </p>
                                <p className="text-base">{healthFormData.client?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('health.serviceName', 'Service')}
                                </p>
                                <p className="text-base">{healthFormData.bookingItem?.service?.name || healthFormData.bookingItem?.service?.name_fr}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('health.session', 'Session')}
                                </p>
                                <p className="text-base">
                                    {healthFormData.bookingItem?.start_datetime ? new Date(healthFormData.bookingItem.start_datetime).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {healthFormData?.message && (
                    <Alert variant="destructive">
                        <AlertDescription>{healthFormData.message}</AlertDescription>
                    </Alert>
                )}

                {submitError && (
                    <Alert variant="destructive">
                        <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                )}

                {/* Combined Health Forms using a single MagicForm */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('health.fillForms')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MagicForm
                            fields={groupsWithAcceptance}
                            title={''}
                            button={t('health.submitAllForms')}
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default memo(HealthFormClient);