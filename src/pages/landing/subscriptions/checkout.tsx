import { Admin } from '@/interfaces/models/admin';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { login } from '@/store/slices/adminSlice';
import { RootState } from '@/store';
import http, { defaultHttp } from '@/utils/http';
import { setPageTitle } from '@/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Check, CreditCard, Building2, User } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { SubscriptionPlan } from '@/interfaces/models/subscriptionPlan';
import HeaderBooking from '../booking/HeaderBooking';
import { AccountCreationStep } from './components/AccountCreationStep';
import { ServiceSelectionStep } from './components/ServiceSelectionStep';
import { PlanSelectionStep } from './components/PlanSelectionStep';
import { PaymentStep } from './components/PaymentStep';
import { CheckoutStepper } from './components/CheckoutStepper';




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
                <CheckoutStepper steps={stepsConfig} currentStep={step} />

                {/* Step 0 (guest only): Create Account */}
                {!isAuthenticated && step === 0 && (
                    <AccountCreationStep
                        registerName={registerName}
                        setRegisterName={setRegisterName}
                        registerEmail={registerEmail}
                        setRegisterEmail={setRegisterEmail}
                        registerPhone={registerPhone}
                        setRegisterPhone={setRegisterPhone}
                        registerCompany={registerCompany}
                        setRegisterCompany={setRegisterCompany}
                        registerPassword={registerPassword}
                        setRegisterPassword={setRegisterPassword}
                        registerPasswordConfirm={registerPasswordConfirm}
                        setRegisterPasswordConfirm={setRegisterPasswordConfirm}
                        canCreateAccount={canCreateAccount}
                        isCreating={createAccountMutation.isPending}
                        onCreateAccount={() => createAccountMutation.mutate()}
                    />
                )}

                {/* Service step */}
                {step === serviceStep && (
                    <ServiceSelectionStep
                        services={services}
                        selectedServiceId={selectedServiceId}
                        onSelectService={(serviceId) => {
                            setSelectedServiceId(serviceId);
                            setSelectedPlanId(null);
                            updateUrl(serviceId, null);
                        }}
                        onContinue={() => setStep(planStep)}
                    />
                )}

                {/* Plan step */}
                {step === planStep && (
                    <PlanSelectionStep
                        plans={filteredPlans}
                        selectedPlanId={selectedPlanId}
                        isLoading={isLoading}
                        onSelectPlan={(planId) => {
                            setSelectedPlanId(planId);
                            updateUrl(selectedServiceId, planId);
                        }}
                        onBack={() => setStep(serviceStep)}
                        onContinue={() => setStep(paymentStep)}
                        getPlanName={getPlanName}
                    />
                )}

                {/* Payment step */}
                {step === paymentStep && selectedPlan && (
                    <PaymentStep
                        plan={selectedPlan}
                        cardName={cardName}
                        setCardName={setCardName}
                        cardContainerRef={cardContainerRef}
                        squareReady={squareReady}
                        paymentProcessing={paymentProcessing}
                        isProcessing={createSubscriptionMutation.isPending}
                        onBack={() => setStep(planStep)}
                        onPay={handleSquarePayment}
                        getPlanName={getPlanName}
                    />
                )}
            </div>
        </div>
    );
}
