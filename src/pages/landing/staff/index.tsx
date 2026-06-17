import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';
import { setPageTitle } from '@/utils';
import { Users, Heart, Award } from 'lucide-react';

export default function StaffPage() {
    const { t } = useTranslation();

    useEffect(() => {
        setPageTitle(t('staff.title', 'Our Staff'));
    }, [t]);

    return (
        <div className='min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-12 px-4 md:px-8'>
            <div className='mx-auto max-w-6xl space-y-12'>
                {/* Header */}
                <div className='space-y-2 text-center'>
                    <h1 className='text-4xl font-bold text-gray-900'>
                        {t('staff.title', 'Our Staff')}
                    </h1>
                    <p className='text-lg text-gray-600'>
                        {t('staff.subtitle', 'Meet our dedicated team of wellness professionals')}
                    </p>
                </div>

                {/* Staff Introduction */}
                <Card className='border-none shadow-lg'>
                    <CardHeader>
                        <CardTitle className='text-2xl'>
                            {t('staff.introduction', 'Professional & Experienced Team')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <p className='text-gray-700'>
                            {t('staff.introductionContent', 'At SAFIR Moroccan Hammam & Spa, our team is composed of highly trained wellness professionals dedicated to providing you with exceptional service. Each team member is selected for their expertise, professionalism, and commitment to your well-being.')}
                        </p>
                    </CardContent>
                </Card>

                {/* Staff Features */}
                <div className='grid gap-6 md:grid-cols-3'>
                    <Card className='border-none shadow-lg'>
                        <CardHeader>
                            <Award className='h-8 w-8 text-amber-600' />
                            <CardTitle className='text-xl'>
                                {t('staff.certified', 'Certified Professionals')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-gray-700'>
                                {t('staff.certifiedContent', 'All our staff members hold recognized certifications in their respective fields including massage therapy, spa treatments, and wellness services.')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className='border-none shadow-lg'>
                        <CardHeader>
                            <Heart className='h-8 w-8 text-amber-600' />
                            <CardTitle className='text-xl'>
                                {t('staff.dedicated', 'Dedicated Care')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-gray-700'>
                                {t('staff.dedicatedContent', 'Our team is passionate about providing personalized care that meets your individual needs and preferences.')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className='border-none shadow-lg'>
                        <CardHeader>
                            <Users className='h-8 w-8 text-amber-600' />
                            <CardTitle className='text-xl'>
                                {t('staff.experienced', 'Years of Experience')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-gray-700'>
                                {t('staff.experiencedContent', 'With over 50 years of combined experience in the wellness industry, our staff brings expertise and excellence to every service.')}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Services Provided */}
                <Card className='border-none shadow-lg'>
                    <CardHeader>
                        <CardTitle className='text-2xl'>
                            {t('staff.servicesProvided', 'Our Services')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='grid gap-6 md:grid-cols-2'>
                            <div>
                                <h4 className='font-semibold text-amber-600 mb-2'>
                                    {t('staff.hamam', 'Hammam Services')}
                                </h4>
                                <p className='text-gray-700 text-sm'>
                                    {t('staff.hamamContent', 'Traditional Moroccan hammam services with female and male specialists to ensure your comfort and privacy.')}
                                </p>
                            </div>
                            <div>
                                <h4 className='font-semibold text-amber-600 mb-2'>
                                    {t('staff.massage', 'Massage & Treatments')}
                                </h4>
                                <p className='text-gray-700 text-sm'>
                                    {t('staff.massageContent', 'Professional massage therapy and naturopathy treatments tailored to your wellness goals.')}
                                </p>
                            </div>
                            <div>
                                <h4 className='font-semibold text-amber-600 mb-2'>
                                    {t('staff.haircare', 'Hair Care Services')}
                                </h4>
                                <p className='text-gray-700 text-sm'>
                                    {t('staff.haircareContent', 'Expert hair care services using premium products and traditional techniques.')}
                                </p>
                            </div>
                            <div>
                                <h4 className='font-semibold text-amber-600 mb-2'>
                                    {t('staff.wellness', 'Wellness Consultation')}
                                </h4>
                                <p className='text-gray-700 text-sm'>
                                    {t('staff.wellnessContent', 'Personalized wellness consultations to help you achieve your health and relaxation goals.')}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Booking Message */}
                <div className='rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 p-6 text-center'>
                    <p className='text-lg font-semibold text-amber-900'>
                        {t('staff.bookingMessage', 'Book your appointment with our team today and experience the difference professional care can make!')}
                    </p>
                </div>
            </div>
        </div>
    );
}
