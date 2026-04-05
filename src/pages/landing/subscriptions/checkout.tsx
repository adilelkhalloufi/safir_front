import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Admin } from '@/interfaces/models/admin';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { login } from '@/store/slices/adminSlice';
import { RootState } from '@/store';
import http, { defaultHttp } from '@/utils/http';
import { setPageTitle } from '@/utils';
import { PasswordInput } from '@/components/custom/password-input';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Check, CreditCard, Loader2, Lock, Mail, Phone, Building2, Shield, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { SubscriptionPlan } from '@/interfaces/models/subscriptionPlan';
import HeaderBooking from '../booking/HeaderBooking';




export default function SubscriptionCheckoutPage() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const admin = useSelector((state: RootState) => state.admin);
    const isAuthenticated = Boolean(admin?.token || admin?.user?.id);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [step, setStep] = useState(0);
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPhone, setRegisterPhone] = useState('');
    const [registerCompany, setRegisterCompany] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('');
    const [cardName, setCardName] = useState('');
    const [squareCard, setSquareCard] = useState<any>(null);
    const [squareReady, setSquareReady] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const cardContainerRef = useRef<HTMLDivElement>(null);

    const serviceStep = isAuthenticated ? 0 : 1;
    const planStep = isAuthenticated ? 1 : 2;
    const paymentStep = isAuthenticated ? 2 : 3;

    useEffect(() => {
        setPageTitle(t('subscriptionCheckout.title', 'Subscription checkout'));
    }, [t]);

    const { data: plans = [], isLoading } = useQuery<SubscriptionPlan[]>({
        queryKey: ['subscription-plans-checkout'],
        queryFn: async () => {
            const response = await defaultHttp.get(apiRoutes.subscriptionPlans);
            const payload = response?.data?.data ?? response?.data;
            return Array.isArray(payload) ? payload : [];
        },
    });

    useEffect(() => {
        const qServiceId = Number(searchParams.get('service_id') || '0');
        const qPlanId = Number(searchParams.get('plan_id') || '0');

        // Pre-select service/plan from URL params
        if (qServiceId > 0) {
            setSelectedServiceId(qServiceId);
        }
        if (qPlanId > 0) {
            setSelectedPlanId(qPlanId);
        }

        // Guests must create an account first (step 0), authenticated users go to plan review
        if (!isAuthenticated) {
            setStep(0);
        } else {
            setStep(qServiceId > 0 ? planStep : serviceStep);
        }
    }, [searchParams, isAuthenticated, serviceStep, planStep, paymentStep]);

    const services = useMemo(() => {
        const map = new Map<number, string>();
        plans.forEach((plan) => {
            if (plan.service?.id) map.set(plan.service.id, plan.service.name[i18n.language as keyof typeof plan.service.name] || plan.service.name.en);
        });
        return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
    }, [plans, i18n.language]);

    const filteredPlans = useMemo(() => {
        if (!selectedServiceId) return [];
        return plans.filter((plan) => plan.service?.id === selectedServiceId && plan.is_active !== false);
    }, [plans, selectedServiceId]);

    const selectedPlan = useMemo(() => {
        return plans.find((plan) => plan.id === selectedPlanId) || null;
    }, [plans, selectedPlanId]);

    useEffect(() => {
        if (!selectedServiceId && selectedPlanId) {
            const selected = plans.find((plan) => plan.id === selectedPlanId);
            if (selected?.service?.id) {
                setSelectedServiceId(selected.service.id);
            }
        }
    }, [plans, selectedPlanId, selectedServiceId]);

    // --- Square Web Payments SDK initialization ---
    const initializeSquareCard = useCallback(async () => {
        if (squareCard) return;
        const Square = (window as any).Square;
        if (!Square) {
            console.error('Square SDK not loaded');
            return;
        }
        try {
            const payments = Square.payments(
                import.meta.env.VITE_SQUARE_APP_ID,
                import.meta.env.VITE_SQUARE_LOCATION_ID,
            );
            const card = await payments.card();
            if (cardContainerRef.current) {
                await card.attach(cardContainerRef.current);
                setSquareCard(card);
                setSquareReady(true);
            }
        } catch (err) {
            console.error('Square card init error', err);
        }
    }, [squareCard]);

    useEffect(() => {
        if (step === paymentStep && isAuthenticated && !squareCard) {
            const timer = setTimeout(() => initializeSquareCard(), 300);
            return () => clearTimeout(timer);
        }
    }, [step, paymentStep, isAuthenticated, squareCard, initializeSquareCard]);

    // Cleanup Square card on unmount
    useEffect(() => {
        return () => {
            if (squareCard) {
                try { squareCard.destroy(); } catch (_) { /* noop */ }
            }
        };
    }, [squareCard]);

    const createAccountMutation = useMutation({
        mutationFn: async () => {
            if (registerPassword !== registerPasswordConfirm) {
                throw new Error(t('subscriptionCheckout.passwordMismatch', 'Passwords do not match'));
            }
            await defaultHttp.post(apiRoutes.register, {
                name: registerName,
                email: registerEmail,
                phone: registerPhone,
                company: registerCompany,
                password: registerPassword,
                password_confirmation: registerPasswordConfirm,
            });
            const loginResponse = await defaultHttp.post(apiRoutes.login, {
                email: registerEmail,
                password: registerPassword,
            });
            return loginResponse.data;
        },
        onSuccess: (data) => {
            const authData: Admin = {
                token: data?.token,
                user: data?.user,
            };
            dispatch(login(authData));
            toast.success(t('subscriptionCheckout.accountCreated', 'Account created successfully'));
            if (selectedPlanId) {
                setStep(paymentStep);
                return;
            }
            if (selectedServiceId) {
                setStep(planStep);
                return;
            }
            setStep(serviceStep);
        },
        onError: (error: any) => {
            toast.error(error?.message || t('subscriptionCheckout.accountCreationError', 'Could not create account'));
        },
    });

    const createSubscriptionMutation = useMutation({
        mutationFn: async (sourceId: string) => {
            return http.post(apiRoutes.subscriptionPayment, {
                subscription_plan_id: selectedPlanId,
                source_id: sourceId,
                card_holder: cardName,
            });
        },
        onSuccess: () => {
            toast.success(t('subscriptionCheckout.success', 'Subscription created successfully'));
            navigate(webRoutes.Dashboard);
        },
        onError: () => {
            toast.error(t('subscriptionCheckout.error', 'Failed to create subscription'));
        },
    });

    const handleSquarePayment = async () => {
        if (!squareCard || !cardName.trim()) return;
        setPaymentProcessing(true);
        try {
            const result = await squareCard.tokenize();
            if (result.status === 'OK' && result.token) {
                createSubscriptionMutation.mutate(result.token);
            } else {
                const errorMsg = result.errors?.map((e: any) => e.message).join(', ') || 'Card error';
                toast.error(errorMsg);
            }
        } catch (err: any) {
            toast.error(err?.message || t('subscriptionCheckout.cardError', 'Card processing error'));
        } finally {
            setPaymentProcessing(false);
        }
    };

    const updateUrl = (serviceId: number | null, planId: number | null) => {
        const next = new URLSearchParams(searchParams);
        if (serviceId) next.set('service_id', String(serviceId));
        else next.delete('service_id');

        if (planId) next.set('plan_id', String(planId));
        else next.delete('plan_id');

        setSearchParams(next, { replace: true });
    };

    const getPlanName = (plan: SubscriptionPlan) => {
        return i18n.language === 'fr' ? plan.name.fr : plan.name.en;
    };

    const canCreateAccount =
        registerName.trim().length > 0 &&
        registerEmail.trim().length > 0 &&
        registerPhone.trim().length > 0 &&
        registerCompany.trim().length > 0 &&
        registerPassword.trim().length >= 6 &&
        registerPasswordConfirm.trim().length >= 6;

    const totalSteps = isAuthenticated ? 3 : 4;
    const stepsConfig = isAuthenticated
        ? [
            { label: t('subscriptionCheckout.stepService', 'Service'), icon: Building2 },
            { label: t('subscriptionCheckout.stepPlan', 'Plan'), icon: Check },
            { label: t('subscriptionCheckout.stepPayment', 'Payment'), icon: CreditCard },
        ]
        : [
            { label: t('subscriptionCheckout.stepAccount', 'Account'), icon: User },
            { label: t('subscriptionCheckout.stepService', 'Service'), icon: Building2 },
            { label: t('subscriptionCheckout.stepPlan', 'Plan'), icon: Check },
            { label: t('subscriptionCheckout.stepPayment', 'Payment'), icon: CreditCard },
        ];

    return (
        <div className='min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-28 px-4'>
            <HeaderBooking />
            <div className='mx-auto max-w-4xl space-y-8'>
                {/* Header */}
                <div className='text-center space-y-2'>
                    <h1 className='text-4xl font-bold tracking-tight'>{t('subscriptionCheckout.title', 'Subscription checkout')}</h1>
                    <p className='text-muted-foreground text-lg'>
                        {t('subscriptionCheckout.subtitle', 'Service, plan, payment, then activation')}
                    </p>
                </div>

                {/* Stepper */}
                <div className='flex items-center justify-center gap-0'>
                    {stepsConfig.map((s, i) => {
                        const StepIcon = s.icon;
                        const isActive = step === i;
                        const isDone = step > i;
                        return (
                            <div key={i} className='flex items-center'>
                                <div className='flex flex-col items-center gap-1.5'>
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${isDone
                                        ? 'border-primary bg-primary text-white'
                                        : isActive
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-muted-foreground/30 bg-muted/50 text-muted-foreground'
                                        }`}>
                                        {isDone ? <Check className='h-5 w-5' /> : <StepIcon className='h-4 w-4' />}
                                    </div>
                                    <span className={`text-xs font-medium whitespace-nowrap ${isActive || isDone ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < totalSteps - 1 && (
                                    <div className={`mx-3 mt-[-18px] h-0.5 w-12 md:w-20 transition-colors duration-300 ${step > i ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Step 0 (guest only): Create Account */}
                {!isAuthenticated && step === 0 && (
                    <Card className='overflow-hidden border-0 shadow-xl'>
                        <div className='bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-5'>
                            <div className='flex items-center gap-3'>
                                <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white'>
                                    <User className='h-5 w-5' />
                                </div>
                                <div>
                                    <CardTitle className='text-xl'>{t('subscriptionCheckout.createAccountTitle', 'Create your account')}</CardTitle>
                                    <p className='text-sm text-muted-foreground mt-0.5'>
                                        {t('subscriptionCheckout.createAccountDescription', 'Create an account to continue with your subscription and payment.')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <CardContent className='p-6 space-y-6'>
                            {/* Personal info */}
                            <div className='space-y-4'>
                                <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider'>
                                    {t('subscriptionCheckout.personalInfo', 'Personal information')}
                                </h3>
                                <div className='grid gap-4 md:grid-cols-2'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='reg-name'>{t('subscriptionCheckout.fullName', 'Full name')}</Label>
                                        <div className='relative'>
                                            <User className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                                            <Input
                                                id='reg-name'
                                                className='pl-10'
                                                value={registerName}
                                                onChange={(e) => setRegisterName(e.target.value)}
                                                placeholder='John Doe'
                                            />
                                        </div>
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='reg-email'>{t('subscriptionCheckout.email', 'Email')}</Label>
                                        <div className='relative'>
                                            <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                                            <Input
                                                id='reg-email'
                                                type='email'
                                                className='pl-10'
                                                value={registerEmail}
                                                onChange={(e) => setRegisterEmail(e.target.value)}
                                                placeholder='you@example.com'
                                            />
                                        </div>
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='reg-phone'>{t('subscriptionCheckout.phone', 'Phone number')}</Label>
                                        <div className='relative'>
                                            <Phone className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                                            <Input
                                                id='reg-phone'
                                                className='pl-10'
                                                value={registerPhone}
                                                onChange={(e) => setRegisterPhone(e.target.value)}
                                                placeholder='+1 XXX XXX XXXX'
                                            />
                                        </div>
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='reg-company'>{t('subscriptionCheckout.company', 'Company')}</Label>
                                        <div className='relative'>
                                            <Building2 className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                                            <Input
                                                id='reg-company'
                                                className='pl-10'
                                                value={registerCompany}
                                                onChange={(e) => setRegisterCompany(e.target.value)}
                                                placeholder={t('subscriptionCheckout.companyPlaceholder', 'Your company')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Password */}
                            <div className='space-y-4'>
                                <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider'>
                                    {t('subscriptionCheckout.securitySection', 'Security')}
                                </h3>
                                <div className='grid gap-4 md:grid-cols-2'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='reg-password'>{t('subscriptionCheckout.password', 'Password')}</Label>
                                        <PasswordInput
                                            id='reg-password'
                                            value={registerPassword}
                                            onChange={(e) => setRegisterPassword(e.target.value)}
                                            placeholder='••••••••'
                                        />
                                        <p className='text-xs text-muted-foreground'>
                                            {t('subscriptionCheckout.passwordHint', 'Minimum 6 characters')}
                                        </p>
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='reg-password-confirm'>{t('subscriptionCheckout.passwordConfirm', 'Confirm password')}</Label>
                                        <PasswordInput
                                            id='reg-password-confirm'
                                            value={registerPasswordConfirm}
                                            onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                                            placeholder='••••••••'
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground'>
                                <Lock className='h-4 w-4 shrink-0' />
                                {t('subscriptionCheckout.privacyNote', 'Your information is secure and will never be shared with third parties.')}
                            </div>

                            <Button
                                className='w-full h-12 text-base'
                                disabled={!canCreateAccount || createAccountMutation.isPending}
                                onClick={() => createAccountMutation.mutate()}
                            >
                                {createAccountMutation.isPending ? (
                                    <><Loader2 className='mr-2 h-4 w-4 animate-spin' />{t('subscriptionCheckout.creatingAccount', 'Creating account...')}</>
                                ) : (
                                    <>{t('subscriptionCheckout.createAndContinue', 'Create account and continue')}<ArrowRight className='ml-2 h-4 w-4' /></>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Service step */}
                {step === serviceStep && (
                    <Card className='border-0 shadow-xl'>
                        <CardHeader>
                            <CardTitle>{t('subscriptionCheckout.chooseService', 'Choose a service')}</CardTitle>
                        </CardHeader>
                        <CardContent className='flex flex-wrap gap-3'>
                            {services.map((service) => (
                                <Button
                                    key={service.id}
                                    variant={selectedServiceId === service.id ? 'default' : 'outline'}
                                    onClick={() => {
                                        setSelectedServiceId(service.id);
                                        setSelectedPlanId(null);
                                        updateUrl(service.id, null);
                                    }}
                                >
                                    {service.name}
                                </Button>
                            ))}
                        </CardContent>
                        <CardContent className='flex justify-end'>
                            <Button
                                disabled={!selectedServiceId}
                                onClick={() => setStep(planStep)}
                            >
                                {t('subscriptionCheckout.continue', 'Continue')}<ArrowRight className='ml-2 h-4 w-4' />
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Plan step */}
                {step === planStep && (
                    <Card className='border-0 shadow-xl'>
                        <CardHeader>
                            <CardTitle>{t('subscriptionCheckout.choosePlan', 'Choose a plan')}</CardTitle>
                            <CardDescription>
                                {isLoading ? t('common.loading', 'Loading...') : t('subscriptionCheckout.planHelp', 'Select one subscription plan')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            {filteredPlans.map((plan) => (
                                <button
                                    key={plan.id}
                                    type='button'
                                    className={`w-full rounded-xl border-2 p-5 text-left transition-all duration-200 ${selectedPlanId === plan.id
                                        ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/20'
                                        : 'border-transparent bg-muted/30 hover:border-primary/30 hover:shadow-sm'
                                        }`}
                                    onClick={() => {
                                        setSelectedPlanId(plan.id);
                                        updateUrl(selectedServiceId, plan.id);
                                    }}
                                >
                                    <div className='flex items-center justify-between gap-2'>
                                        <div className='font-semibold text-lg'>{getPlanName(plan)}</div>
                                        <div className='flex items-center gap-2'>
                                            {plan.max_members > 1 && <Badge>{t('subscriptionPublic.shared', 'Shared')}</Badge>}
                                            {selectedPlanId === plan.id && (
                                                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white'>
                                                    <Check className='h-4 w-4' />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className='mt-2 text-sm text-muted-foreground'>
                                        {plan.total_sessions} {t('subscriptionPublic.sessions', 'Sessions')} &middot; {plan.duration_days} {t('common.days', 'days')}
                                    </div>
                                    <div className='mt-2 text-2xl font-bold'>{plan.price} $</div>
                                </button>
                            ))}
                        </CardContent>
                        <CardContent className='flex justify-between'>
                            <Button variant='outline' onClick={() => setStep(serviceStep)}>
                                <ArrowLeft className='mr-2 h-4 w-4' />{t('subscriptionCheckout.back', 'Back')}
                            </Button>
                            <Button disabled={!selectedPlanId} onClick={() => setStep(paymentStep)}>
                                {t('subscriptionCheckout.continue', 'Continue')}<ArrowRight className='ml-2 h-4 w-4' />
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Payment step */}
                {step === paymentStep && selectedPlan && (
                    <Card className='border-0 shadow-xl overflow-hidden'>
                        <div className='bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-5'>
                            <div className='flex items-center gap-3'>
                                <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white'>
                                    <CreditCard className='h-5 w-5' />
                                </div>
                                <div>
                                    <CardTitle className='text-xl'>{t('subscriptionCheckout.paymentTitle', 'Secure payment')}</CardTitle>
                                    <p className='text-sm text-muted-foreground mt-0.5'>
                                        {t('subscriptionCheckout.paymentDescription', 'Enter your card details below to complete payment via Square.')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <CardContent className='p-6 space-y-5'>
                            {/* Order summary */}
                            <div className='rounded-xl border bg-muted/20 p-5'>
                                <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2'>
                                    {t('subscriptionCheckout.orderSummary', 'Order summary')}
                                </p>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <div className='font-semibold text-lg'>{getPlanName(selectedPlan)}</div>
                                        <div className='text-sm text-muted-foreground'>
                                            {selectedPlan.total_sessions} {t('subscriptionPublic.sessions', 'Sessions')} &middot; {selectedPlan.duration_days} {t('common.days', 'days')}
                                        </div>
                                    </div>
                                    <div className='text-3xl font-bold'>{selectedPlan.price} $</div>
                                </div>
                            </div>

                            <Separator />

                            {/* Card holder */}
                            <div className='space-y-2'>
                                <Label htmlFor='card-name'>{t('subscriptionCheckout.cardHolder', 'Card holder name')}</Label>
                                <div className='relative'>
                                    <User className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                                    <Input
                                        id='card-name'
                                        className='pl-10'
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        placeholder={t('subscriptionCheckout.cardHolderPlaceholder', 'Name on card')}
                                    />
                                </div>
                            </div>

                            {/* Square card container */}
                            <div className='space-y-2'>
                                <Label>{t('subscriptionCheckout.cardDetails', 'Card details')}</Label>
                                <div
                                    ref={cardContainerRef}
                                    className='min-h-[90px] rounded-lg border-2 border-dashed bg-white p-4 transition-colors focus-within:border-primary'
                                />
                                {!squareReady && (
                                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                                        <Loader2 className='h-4 w-4 animate-spin' />
                                        {t('subscriptionCheckout.loadingCard', 'Loading secure card form...')}
                                    </div>
                                )}
                            </div>

                            <div className='flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800'>
                                <Shield className='h-4 w-4 shrink-0' />
                                {t('subscriptionCheckout.securedBy', 'Secured payment by Square')}
                            </div>
                        </CardContent>
                        <CardContent className='flex justify-between p-6 pt-0'>
                            <Button variant='outline' onClick={() => setStep(planStep)}>
                                <ArrowLeft className='mr-2 h-4 w-4' />{t('subscriptionCheckout.back', 'Back')}
                            </Button>
                            <Button
                                className='h-12 px-8 text-base'
                                disabled={!squareReady || !cardName.trim() || paymentProcessing || createSubscriptionMutation.isPending}
                                onClick={handleSquarePayment}
                            >
                                {(paymentProcessing || createSubscriptionMutation.isPending) ? (
                                    <><Loader2 className='mr-2 h-4 w-4 animate-spin' />{t('subscriptionCheckout.processing', 'Processing...')}</>
                                ) : (
                                    <><Lock className='mr-2 h-4 w-4' />{t('subscriptionCheckout.payAndActivate', 'Pay and activate subscription')}</>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
