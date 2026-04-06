import { Card, CardContent, CardTitle } from '@/components/ui/card';
import MagicForm, { MagicFormGroupProps } from '@/components/custom/MagicForm';
import { User, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

interface AccountCreationStepProps {
    
    isCreating: boolean;
    onCreateAccount: (data: any) => void;
}

export function AccountCreationStep({
 
    isCreating,
    onCreateAccount,
}: AccountCreationStepProps) {
    const { t } = useTranslation();

    const fields: MagicFormGroupProps[] = useMemo(() => [
        {
            group: "",
            groupTitle: t('subscriptionCheckout.personalInfo', 'Personal information'),
            layout: {
                type: "grid",
                columns: 2
            },
            fields: [
                {
                    name: "name",
                    label: t('subscriptionCheckout.fullName', 'Full name'),
                    type: "text",
                    placeholder: "John Doe",
                    required: true
                },
                {
                    name: "email",
                    label: t('subscriptionCheckout.email', 'Email'),
                    type: "text",
                    placeholder: "you@example.com",
                    required: true
                },
                {
                    name: "phone",
                    label: t('subscriptionCheckout.phone', 'Phone number'),
                    type: "text",
                    placeholder: "+1 XXX XXX XXXX",
                    required: true
                },
           
            ]
        },
        {
            group: "security",
            groupTitle: t('subscriptionCheckout.securitySection', 'Security'),
            layout: {
                type: "grid",
                columns: 2
            },
            fields: [
                {
                    name: "password",
                    label: t('subscriptionCheckout.password', 'Password'),
                    type: "text",
                    placeholder: "••••••••",
                    required: true
                },
                {
                    name: "password_confirmation",
                    label: t('subscriptionCheckout.passwordConfirm', 'Confirm password'),
                    type: "text",
                    placeholder: "••••••••",
                    required: true
                }
            ]
        }
    ], [t]);

    return (
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
            <CardContent className='p-6 space-y-4'>
                <MagicForm
                    fields={fields}
                     onSubmit={onCreateAccount}
                    button={isCreating ? t('subscriptionCheckout.creatingAccount', 'Creating account...') : t('subscriptionCheckout.createAndContinue', 'Create account and continue')}
                    loading={isCreating}
                    showButton={true}
                    title=''
                />
                
                <div className='flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground mt-4'>
                    <Lock className='h-4 w-4 shrink-0' />
                    {t('subscriptionCheckout.privacyNote', 'Your information is secure and will never be shared with third parties.')}
                </div>
            </CardContent>
        </Card>
    );
}
