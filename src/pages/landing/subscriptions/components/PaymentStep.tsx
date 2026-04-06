import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Loader2, Lock, Shield, User, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SubscriptionPlan } from '@/interfaces/models/subscriptionPlan';

interface PaymentStepProps {
    plan: SubscriptionPlan;
    cardName: string;
    setCardName: (val: string) => void;
    cardContainerRef: React.RefObject<HTMLDivElement>;
    squareReady: boolean;
    paymentProcessing: boolean;
    isProcessing: boolean;
    onBack: () => void;
    onPay: () => void;
    getPlanName: (plan: SubscriptionPlan) => string;
}

export function PaymentStep({
    plan,
    cardName,
    setCardName,
    cardContainerRef,
    squareReady,
    paymentProcessing,
    isProcessing,
    onBack,
    onPay,
    getPlanName,
}: PaymentStepProps) {
    const { t } = useTranslation();

    return (
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
                            <div className='font-semibold text-lg'>{getPlanName(plan)}</div>
                            <div className='text-sm text-muted-foreground'>
                                {plan.total_sessions} {t('subscriptionPublic.sessions', 'Sessions')} &middot; {plan.duration_days} {t('common.days', 'days')}
                            </div>
                        </div>
                        <div className='text-3xl font-bold'>{plan.price} $</div>
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
                <Button variant='outline' onClick={onBack}>
                    <ArrowLeft className='mr-2 h-4 w-4' />{t('subscriptionCheckout.back', 'Back')}
                </Button>
                <Button
                    className='h-12 px-8 text-base'
                    onClick={onPay}
                >
                    {(paymentProcessing || isProcessing) ? (
                        <><Loader2 className='mr-2 h-4 w-4 animate-spin' />{t('subscriptionCheckout.processing', 'Processing...')}</>
                    ) : (
                        <><Lock className='mr-2 h-4 w-4' />{t('subscriptionCheckout.payAndActivate', 'Pay and activate subscription')}</>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
