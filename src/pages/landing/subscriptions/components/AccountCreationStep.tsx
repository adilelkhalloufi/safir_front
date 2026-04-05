import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PasswordInput } from '@/components/custom/password-input';
import { User, Mail, Phone, Building2, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AccountCreationStepProps {
    registerName: string;
    setRegisterName: (val: string) => void;
    registerEmail: string;
    setRegisterEmail: (val: string) => void;
    registerPhone: string;
    setRegisterPhone: (val: string) => void;
    registerCompany: string;
    setRegisterCompany: (val: string) => void;
    registerPassword: string;
    setRegisterPassword: (val: string) => void;
    registerPasswordConfirm: string;
    setRegisterPasswordConfirm: (val: string) => void;
    canCreateAccount: boolean;
    isCreating: boolean;
    onCreateAccount: () => void;
}

export function AccountCreationStep({
    registerName,
    setRegisterName,
    registerEmail,
    setRegisterEmail,
    registerPhone,
    setRegisterPhone,
    registerCompany,
    setRegisterCompany,
    registerPassword,
    setRegisterPassword,
    registerPasswordConfirm,
    setRegisterPasswordConfirm,
    canCreateAccount,
    isCreating,
    onCreateAccount,
}: AccountCreationStepProps) {
    const { t } = useTranslation();

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
                    disabled={!canCreateAccount || isCreating}
                    onClick={onCreateAccount}
                >
                    {isCreating ? (
                        <><Loader2 className='mr-2 h-4 w-4 animate-spin' />{t('subscriptionCheckout.creatingAccount', 'Creating account...')}</>
                    ) : (
                        <>{t('subscriptionCheckout.createAndContinue', 'Create account and continue')}<ArrowRight className='ml-2 h-4 w-4' /></>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
