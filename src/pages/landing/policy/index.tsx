import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';
import { setPageTitle } from '@/utils';
import HeaderBooking from '../booking/HeaderBooking';

export default function PolicyPage() {
    const { t } = useTranslation();

    useEffect(() => {
        setPageTitle(t('policy.title', 'Policy'));
    }, [t]);

    return (
        <>
        <HeaderBooking/>
         <div className='min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-12 px-4 md:px-8 mt-20'>
            <div className='mx-auto max-w-4xl space-y-6'>
                {/* Header */}
                <div className='space-y-2 text-center'>
                    <h1 className='text-4xl font-bold text-gray-900'>
                        {t('policy.title', 'Policy')}
                    </h1>
                    <p className='text-lg text-gray-600'>
                        {t('policy.subtitle', 'Terms and Conditions')}
                    </p>
                </div>

                {/* Terms of Service */}
                <Card className='border-none shadow-lg'>
                    <CardHeader>
                        <CardTitle className='text-2xl'>
                            {t('policy.termsOfService', 'Terms of Service')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='prose prose-sm max-w-none space-y-4 text-gray-700'>
                            <p>
                                {t('policy.termsContent1', 'I accept the terms of use and regulations of SAFIR Moroccan Hammam & Spa, as well as the receipt of essential SMS notifications (booking confirmations, appointment reminders and security alerts). Messaging fees may apply. Reply STOP to (506) 312-0931 to unsubscribe from SMS communications.')}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Booking Deposit Policy */}
                <Card className='border-none shadow-lg'>
                    <CardHeader>
                        <CardTitle className='text-2xl'>
                            {t('policy.bookingDepositPolicy', 'Booking Deposit Policy')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='prose prose-sm max-w-none space-y-4 text-gray-700'>
                            <div>
                                <h4 className='font-semibold text-gray-900'>
                                    {t('policy.depositImportance', 'Why We Require a Deposit')}
                                </h4>
                                <p>
                                    {t('policy.depositImportanceContent', 'At SAFIR Moroccan Hammam & Spa, we respect your time and that of our team. To ensure optimal planning and maintain service availability for all our clients, a booking deposit is required at the time of reservation by credit card.')}
                                </p>
                            </div>

                            <div>
                                <h4 className='font-semibold text-gray-900'>
                                    {t('policy.depositAmounts', 'Deposit Amounts')}
                                </h4>
                                <p>
                                    {t('policy.depositAmountsContent', 'The amount of the deposit varies depending on the services booked and the number of people:')}
                                </p>
                                <ul className='list-inside list-disc space-y-2 pl-4'>
                                    <li>{t('policy.hamam', 'Hammam: $45 per person')}</li>
                                    <li>{t('policy.massage', 'Massage and naturopathy treatments: $40 per person')}</li>
                                    <li>{t('policy.haircare', 'Hair care: $20 per person')}</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className='font-semibold text-gray-900'>
                                    {t('policy.cancellationPolicy', 'Cancellation and Modification Policy')}
                                </h4>
                                <ul className='list-inside list-disc space-y-2 pl-4'>
                                    <li>
                                        {t('policy.cancellation48h', 'Cancellation or modification made more than 48 hours before the appointment time will result in a full refund of the deposit')}
                                    </li>
                                    <li>
                                        {t('policy.cancellationLess48h', 'Cancellation or modification made less than 48 hours before the appointment will result in forfeiture of the deposit')}
                                    </li>
                                    <li>
                                        {t('policy.noShow', 'In case of no-show without notice, the total amount of booked services will be automatically charged to the registered credit card')}
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className='font-semibold text-gray-900'>
                                    {t('policy.depositApplication', 'How the Deposit Is Applied')}
                                </h4>
                                <p>
                                    {t('policy.depositApplicationContent', 'If you attend your appointment, the deposit paid will be applied to the total amount of your invoice, and only the remaining balance will be payable at the end of the service.')}
                                </p>
                            </div>

                            <div className='rounded-lg bg-amber-50 p-4'>
                                <p className='text-sm font-semibold text-amber-900'>
                                    {t('policy.acknowledgePolicy', 'By booking your appointment, you acknowledge that you have read and accepted this cancellation and deposit policy, and authorize SAFIR Moroccan Hammam & Spa to immediately deduct the booking deposit corresponding to the services selected.')}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    
        </>);
       
}
