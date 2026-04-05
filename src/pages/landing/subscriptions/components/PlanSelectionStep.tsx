import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SubscriptionPlan {
    id: number;
    name_fr: string;
    name_en: string;
    total_sessions: number;
    price: string;
    duration_days: number;
    max_members: number;
}

interface PlanSelectionStepProps {
    plans: SubscriptionPlan[];
    selectedPlanId: number | null;
    isLoading: boolean;
    onSelectPlan: (planId: number) => void;
    onBack: () => void;
    onContinue: () => void;
    getPlanName: (plan: SubscriptionPlan) => string;
}

export function PlanSelectionStep({
    plans,
    selectedPlanId,
    isLoading,
    onSelectPlan,
    onBack,
    onContinue,
    getPlanName,
}: PlanSelectionStepProps) {
    const { t } = useTranslation();

    return (
        <Card className='border-0 shadow-xl'>
            <CardHeader>
                <CardTitle>{t('subscriptionCheckout.choosePlan', 'Choose a plan')}</CardTitle>
                <CardDescription>
                    {isLoading ? t('common.loading', 'Loading...') : t('subscriptionCheckout.planHelp', 'Select one subscription plan')}
                </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                {plans.map((plan) => (
                    <button
                        key={plan.id}
                        type='button'
                        className={`w-full rounded-xl border-2 p-5 text-left transition-all duration-200 ${selectedPlanId === plan.id
                                ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/20'
                                : 'border-transparent bg-muted/30 hover:border-primary/30 hover:shadow-sm'
                            }`}
                        onClick={() => onSelectPlan(plan.id)}
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
                <Button variant='outline' onClick={onBack}>
                    <ArrowLeft className='mr-2 h-4 w-4' />{t('subscriptionCheckout.back', 'Back')}
                </Button>
                <Button disabled={!selectedPlanId} onClick={onContinue}>
                    {t('subscriptionCheckout.continue', 'Continue')}<ArrowRight className='ml-2 h-4 w-4' />
                </Button>
            </CardContent>
        </Card>
    );
}
