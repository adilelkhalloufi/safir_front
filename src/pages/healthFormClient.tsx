import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiRoutes } from '@/routes/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import http from '@/utils/http';
import HeaderBooking from './landing/booking/HeaderBooking';
import MagicForm from '@/components/custom/MagicForm';
import { useMemo, useState } from 'react';

const HealthFormClient = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();

    // (common fields are stored per-service in MagicForm answers)

    // State to store answers from each service's health form
    const [serviceAnswers, setServiceAnswers] = useState<Record<number, Record<string, { question: string; value: any }>>>({});

    // Normalize values that may be nested answer objects ({ question, value })
    const normalizeAnswerValue = (v: any) => {
        if (v && typeof v === 'object' && 'question' in v && 'value' in v) return v.value;
        return v;
    };

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
                    bookingItemId: item.id,
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

    // common field changes are handled inside each MagicForm and saved per-service

    const handleFinalSubmit = () => {
        // Create array of client objects with answers (uses per-service saved answers)
        const clientsData = healthQuestionsData?.map(serviceData => {
            const answers = serviceAnswers[serviceData.bookingItemId] || {};
            return {
                bookingItemId: serviceData.bookingItemId,
                serviceName: serviceData.serviceName,
                client: {
                    email: answers.email?.value || '',
                    nom: answers.nom?.value || '',
                    telephone: answers.telephone?.value || '',
                    codePostal: answers.codePostal?.value || '',
                },
                answers: Object.entries(answers).reduce((acc, [key, answer]) => {
                    if (key !== 'email' && key !== 'nom' && key !== 'telephone' && key !== 'codePostal' && key !== 'acceptConditions' && key !== 'acceptMarketing') {
                        acc.push({ question: answer.question, value: normalizeAnswerValue(answer.value) });
                    }
                    return acc;
                }, [] as Array<{ question: string; value: any }>),
                acceptConditions: { question: "J'accepte les Conditions générales", value: answers.acceptConditions?.value ?? null },
                acceptMarketing: { question: 'Communications marketing (optionnelles)', value: answers.acceptMarketing?.value ?? null },
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

    // Build combined MagicForm groups (one group per service) and global initialValues
    const groups = useMemo(() => {
        if (!healthQuestionsData) return [] as any[];
        const lang = healthFormData?.language || 'en';
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

            // common fields (prefixed)
            group.fields.push({ name: `${idPrefix}email`, label: 'Email', type: 'text', required: true, placeholder: '' });
            group.fields.push({ name: `${idPrefix}nom`, label: lang === 'fr' ? 'Nom' : 'Name', type: 'text', required: true, placeholder: '' });
            group.fields.push({ name: `${idPrefix}telephone`, label: lang === 'fr' ? 'Téléphone' : 'Phone', type: 'text', required: true, placeholder: '' });
            group.fields.push({ name: `${idPrefix}codePostal`, label: lang === 'fr' ? 'Code Postal' : 'Postal Code', type: 'text', required: false, placeholder: '' });

            // backend health questions
            (serviceData.questions || []).forEach((q: any) => {
                if (['email','nom','telephone','codePostal'].includes(q.id)) return;
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
    }, [healthQuestionsData, healthFormData]);

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
        const acceptanceGroup = {
            group: t('health.termsAndConditions', 'Conditions et Communications'),
            hideGroupTitle: false,
            card: true,
            fields: [
                { name: 'acceptConditions', label: "J'accepte les Conditions générales", type: 'checkbox', required: true },
                { name: 'acceptMarketing', label: 'Communications marketing (optionnelles)', type: 'checkbox', required: false },
            ],
        } as any;

        return [...groups, acceptanceGroup];
    }, [groups, t]);

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

                {/* Combined Health Forms using a single MagicForm */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('health.fillForms', 'Fill Health Forms')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MagicForm
                            fields={groupsWithAcceptance}
                            title={t('health.fillForms', 'Fill Health Forms')}
                            button={t('health.submitAllForms', 'Soumettre tous les formulaires')}
                            initialValues={initialValues}
                            onSubmit={(formResult: any) => {
                                // Global acceptance values
                                const globalAccept = formResult['acceptConditions'];
                                const globalMarketing = formResult['acceptMarketing'];

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
                                            nom: answers.nom?.value || '',
                                            telephone: answers.telephone?.value || '',
                                            codePostal: answers.codePostal?.value || '',
                                        },
                                        answers: Object.entries(answers).reduce((acc, [k, answer]) => {
                                            if (k !== 'email' && k !== 'nom' && k !== 'telephone' && k !== 'codePostal') {
                                                acc.push({ question: answer.question, value: normalizeAnswerValue(answer.value) });
                                            }
                                            return acc;
                                        }, [] as Array<{ question: string; value: any }>),
                                        acceptConditions: { question: "J'accepte les Conditions générales", value: globalAccept ?? null },
                                        acceptMarketing: { question: 'Communications marketing (optionnelles)', value: globalMarketing ?? null },
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
                                    bookingReference: healthFormData?.reference,
                                    clientInfo: healthFormData?.client,
                                    clients: clientsData,
                                };

                                console.log('Combined form submission:', allFormData);
                                // send allFormData to backend if needed
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default HealthFormClient;