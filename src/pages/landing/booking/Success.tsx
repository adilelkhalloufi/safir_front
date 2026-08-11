import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Calendar, Mail, Phone, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'
import { webRoutes } from '@/routes/web'

export default function BookingSuccess() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Extract booking details from URL params
  const bookingId = searchParams.get('id')
  const customerEmail = searchParams.get('email')
  const totalPrice = searchParams.get('total')

  useEffect(() => {
    // Trigger Google Ads conversion tracking
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      const gtagConversionId = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_ID
      const gtagConversionLabel = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_LABEL

      if (gtagConversionId && gtagConversionLabel) {
        ;(window as any).gtag('event', 'conversion', {
          send_to: `${gtagConversionId}/${gtagConversionLabel}`,
          value: totalPrice ? parseFloat(totalPrice) : 0,
          currency: 'CAD',
          transaction_id: bookingId || '',
        })
      }
    }

    // Also trigger Facebook Pixel conversion (already implemented)
    if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
      ;(window as any).fbq('track', 'Purchase', {
        value: totalPrice ? parseFloat(totalPrice) : 0,
        currency: 'CAD',
        content_ids: [bookingId],
        content_type: 'product',
      })
    }
  }, [bookingId, totalPrice])

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-16 px-4'>
      <div className='mx-auto max-w-3xl'>
        {/* Success Header */}
        <div className='mb-8 text-center'>
          <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100'>
            <CheckCircle2 className='h-16 w-16 text-green-600' />
          </div>
          <h1 className='mb-3 text-4xl font-bold text-green-700'>
            {t('bookingSuccess.title', 'Réservation Confirmée !')}
          </h1>
          <p className='text-lg text-muted-foreground'>
            {t(
              'bookingSuccess.subtitle',
              'Votre réservation a été confirmée avec succès'
            )}
          </p>
        </div>

        {/* Confirmation Card */}
        <Card className='mb-6 border-2 border-green-200 bg-white shadow-xl'>
          <CardContent className='p-6'>
            <div className='space-y-6'>
              {/* Booking ID */}
              {bookingId && (
                <div className='rounded-lg bg-green-50 p-4'>
                  <p className='text-sm font-medium text-green-900'>
                    {t('bookingSuccess.bookingNumber', 'Numéro de réservation')}
                  </p>
                  <p className='text-2xl font-bold text-green-700'>#{bookingId}</p>
                </div>
              )}

              {/* Confirmation Message */}
              <div className='space-y-3 text-center'>
                <div className='flex items-center justify-center gap-2 text-green-700'>
                  <Mail className='h-5 w-5' />
                  <p className='font-medium'>
                    {t(
                      'bookingSuccess.emailSent',
                      'Un email de confirmation a été envoyé à'
                    )}{' '}
                    {customerEmail && <span className='font-bold'>{customerEmail}</span>}
                  </p>
                </div>
                <div className='flex items-center justify-center gap-2 text-green-700'>
                  <Phone className='h-5 w-5' />
                  <p className='font-medium'>
                    {t(
                      'bookingSuccess.smsSent',
                      'Un SMS de confirmation vous a été envoyé'
                    )}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className='rounded-lg border border-amber-200 bg-amber-50 p-4'>
                <div className='flex items-start gap-3'>
                  <Calendar className='mt-1 h-5 w-5 text-amber-600' />
                  <div>
                    <p className='font-medium text-amber-900'>
                      {t('bookingSuccess.reminder', 'Rappel important')}
                    </p>
                    <p className='text-sm text-amber-700'>
                      {t(
                        'bookingSuccess.reminderText',
                        'Vous recevrez un rappel 24h avant votre rendez-vous. Veuillez arriver 15 minutes avant l\'heure prévue.'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 text-center'>
                <p className='text-sm text-muted-foreground'>
                  {t(
                    'bookingSuccess.questions',
                    'Des questions ? Contactez-nous au'
                  )}{' '}
                  <a
                    href='tel:+15063120931'
                    className='font-semibold text-amber-600 hover:text-amber-700'
                  >
                    (506) 312-0931
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
          <Button
            size='lg'
            onClick={() => navigate(webRoutes.home)}
            className='bg-amber-600 hover:bg-amber-700'
          >
            {t('bookingSuccess.backHome', 'Retour à l\'accueil')}
            <ArrowRight className='ml-2 h-5 w-5' />
          </Button>
          <Button
            size='lg'
            variant='outline'
            onClick={() => navigate(webRoutes.booking)}
            className='border-amber-600 text-amber-600 hover:bg-amber-50'
          >
            {t('bookingSuccess.newBooking', 'Nouvelle réservation')}
          </Button>
        </div>

        {/* Thank You Message */}
        <div className='mt-8 text-center'>
          <p className='text-lg font-medium text-gray-700'>
            {t(
              'bookingSuccess.thankYou',
              'Merci de votre confiance ! Nous avons hâte de vous accueillir.'
            )}
          </p>
          <p className='mt-2 text-sm text-muted-foreground'>
            SAFIR Moroccan Hammam & Spa
          </p>
        </div>
      </div>
    </div>
  )
}
