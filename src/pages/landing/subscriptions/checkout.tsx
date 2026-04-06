import { Admin } from '@/interfaces/models/admin';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { login } from '@/store/slices/adminSlice';
import { RootState } from '@/store';
import http, { defaultHttp } from '@/utils/http';
import { setPageTitle } from '@/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CreditCard, User } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { SubscriptionPlan } from '@/interfaces/models/subscriptionPlan';
import HeaderBooking from '../booking/HeaderBooking';
import { AccountCreationStep } from './components/AccountCreationStep';
import { PaymentStep } from './components/PaymentStep';
import { CheckoutStepper } from './components/CheckoutStepper';




export default function SubscriptionCheckoutPage() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const admin = useSelector((state: RootState) => state.admin);
    const isAuthenticated = Boolean(admin?.token || admin?.user?.id);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const selectedPlanId = Number(searchParams.get('plan_id') || '0');
    const [cardName, setCardName] = useState('');
    const [squareCard, setSquareCard] = useState<any>(null);
    const [squareReady, setSquareReady] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const cardContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setPageTitle(t('subscriptionCheckout.title', 'Subscription checkout'));
    }, [t]);

    // Redirect if no plan_id provided
    useEffect(() => {
        if (!selectedPlanId) {
            toast.error(t('subscriptionCheckout.noPlanSelected', 'Please select a plan first'));
            navigate('/subscriptions');
        }
    }, [selectedPlanId, navigate, t]);

    const { data: plans = [] } = useQuery<SubscriptionPlan[]>({
        queryKey: ['subscription-plans-checkout'],
        queryFn: async () => {
            const response = await defaultHttp.get(apiRoutes.subscriptionPlans);
            const payload = response?.data?.data ?? response?.data;
            return Array.isArray(payload) ? payload : [];
        },
    });

    const selectedPlan = useMemo(() => {
        return plans.find((plan) => plan.id === selectedPlanId) || null;
    }, [plans, selectedPlanId]);

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
        if (isAuthenticated && !squareCard) {
            const timer = setTimeout(() => initializeSquareCard(), 300);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, squareCard, initializeSquareCard]);

    // Cleanup Square card on unmount
    useEffect(() => {
        return () => {
            if (squareCard) {
                try { squareCard.destroy(); } catch (_) { /* noop */ }
            }
        };
    }, [squareCard]);

    const createAccountMutation = useMutation({
        mutationFn: async (formData: any) => {
            if (formData.password !== formData.password_confirmation) {
                throw new Error(t('subscriptionCheckout.passwordMismatch', 'Passwords do not match'));
            }
            await defaultHttp.post(apiRoutes.register, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                company: formData.company,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
            });
            const loginResponse = await defaultHttp.post(apiRoutes.login, {
                email: formData.email,
                password: formData.password,
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
            // Initialize Square card after successful account creation
            setTimeout(() => initializeSquareCard(), 300);
        },
        onError: (error: any) => {
            toast.error(error?.message || t('subscriptionCheckout.accountCreationError', 'Could not create account'));
        },
    });

    const createSubscriptionMutation = useMutation({
        mutationFn: async (sourceId: string) => {
            return http.post(apiRoutes.subscriptions, {
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
        // For testing: Skip Square payment and create subscription directly
        setPaymentProcessing(true);
        try {
            createSubscriptionMutation.mutate('test_token_' + Date.now());
        } catch (err: any) {
            toast.error(err?.message || t('subscriptionCheckout.cardError', 'Card processing error'));
        } finally {
            setPaymentProcessing(false);
        }
    };

    const getPlanName = (plan: SubscriptionPlan) => {
        return i18n.language === 'fr' ? plan.name.fr : plan.name.en;
    };

    const stepsConfig = isAuthenticated
        ? [
            { label: t('subscriptionCheckout.stepPayment', 'Payment'), icon: CreditCard },
        ]
        : [
            { label: t('subscriptionCheckout.stepAccount', 'Account'), icon: User },
            { label: t('subscriptionCheckout.stepPayment', 'Payment'), icon: CreditCard },
        ];

    const currentStep = isAuthenticated ? 0 : (createAccountMutation.isSuccess ? 1 : 0);

    return (
        <div className='min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-28 px-4'>
            <HeaderBooking />
            <div className='mx-auto max-w-4xl space-y-8'>
                {/* Header */}
                <div className='text-center space-y-2'>
                    <h1 className='text-4xl font-bold tracking-tight'>{t('subscriptionCheckout.title', 'Subscription checkout')}</h1>
                    <p className='text-muted-foreground text-lg'>
                        {t('subscriptionCheckout.subtitle', 'Complete your subscription')}
                    </p>
                </div>

                {/* Stepper */}
                <CheckoutStepper steps={stepsConfig} currentStep={currentStep} />

                {/* Account Creation (for guests only) - shown first */}
                {!isAuthenticated && !createAccountMutation.isSuccess && (
                    <AccountCreationStep
                        isCreating={createAccountMutation.isPending}
                        onCreateAccount={(data) => createAccountMutation.mutate(data)}
                    />
                )}

                {/* Payment step - shown after account creation or immediately for authenticated users */}
                {(isAuthenticated || createAccountMutation.isSuccess) && selectedPlan && (
                    <PaymentStep
                        plan={selectedPlan}
                        cardName={cardName}
                        setCardName={setCardName}
                        cardContainerRef={cardContainerRef}
                        squareReady={squareReady}
                        paymentProcessing={paymentProcessing}
                        isProcessing={createSubscriptionMutation.isPending}
                        onBack={() => navigate(-1)}
                        onPay={handleSquarePayment}
                        getPlanName={getPlanName}
                    />
                )}
            </div>
        </div>
    );
}
