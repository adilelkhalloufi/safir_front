import { Admin } from '@/interfaces/models/admin';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { login } from '@/store/slices/adminSlice';
import { RootState } from '@/store';
import http, { defaultHttp } from '@/utils/http';
import { setPageTitle } from '@/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CreditCard, User } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
        },
        onError: (error: any) => {
            toast.error(error?.message || t('subscriptionCheckout.accountCreationError', 'Could not create account'));
        },
    });

    const createSubscriptionMutation = useMutation({
        mutationFn: async (payload: { sourceId: string; verificationToken?: string }) => {
            return http.post(apiRoutes.subscriptions, {
                subscription_plan_id: selectedPlanId,
                source_id: payload.sourceId,
                card_holder: cardName,
                ...(payload.verificationToken ? { verification_token: payload.verificationToken } : {}),
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

    const handleCardTokenizeResponseReceived = async (tokenResult: any, verifiedBuyer?: any) => {
        if (!cardName.trim()) {
            toast.error(t('subscriptionCheckout.cardHolderRequired', 'Please enter the card holder name.'));
            return;
        }

        if (tokenResult?.status !== 'OK' || !tokenResult?.token) {
            const message = tokenResult?.errors?.map((error: any) => error.message).filter(Boolean).join(', ')
                || t('subscriptionCheckout.cardError', 'Card processing error');
            toast.error(message);
            return;
        }

        await Promise.resolve(
            createSubscriptionMutation.mutate({
                sourceId: tokenResult.token,
                ...(verifiedBuyer?.token ? { verificationToken: verifiedBuyer.token } : {}),
            })
        );
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
                        isProcessing={createSubscriptionMutation.isPending}
                        customerEmail={admin?.user?.email || ''}
                        customerPhone={admin?.user?.phone || ''}
                        onBack={() => navigate(-1)}
                        onCardTokenizeResponseReceived={handleCardTokenizeResponseReceived}
                        getPlanName={getPlanName}
                    />
                )}
            </div>
        </div>
    );
}
