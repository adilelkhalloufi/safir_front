import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  Sparkles,
  Loader2,
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import type { Service } from '@/interfaces/models/service'
import { getLocalizedValue } from '@/interfaces/models/booking'
import { CustomerInfo } from './types'
import { IconUserFilled } from '@tabler/icons-react'

interface ReviewProps {
  selectedServices: Service[]
  serviceQuantity: number
  selectedDate: Date | string | undefined
  customerInfo: CustomerInfo
  isSubmitting: boolean
  onConfirm: (bookingSummary: any) => void
  onPrev: () => void
}

export function Review({
  selectedServices,
  selectedDate,
  customerInfo,
  isSubmitting,
  onConfirm,
  onPrev,
}: ReviewProps) {
  const { i18n, t } = useTranslation()
  const currentLang = (i18n.language || 'fr') as 'fr' | 'en'

  // Helper function to get service details from slot
  const getServiceDetails = (service: any) => {
    if (!service.slot) return null

    const qty = service.quantity || 1
    const assigned_staff = (service.slot.available_staff || [])
      .slice(0, qty)
      .map((st: any) => ({
        staff_id: st.staff_id,
        staff_name: st.staff_name,
      }))

    return {
      slot_id: service.slot.slot_id,
      service_id: service.id,
      quantity: qty,
      start_datetime: service.slot.start_datetime,
      end_datetime: service.slot.end_datetime,
      assigned_staff,
      staff_count: assigned_staff.length,
      total_price: (typeof service.price === 'string' ? parseFloat(service.price) : service.price) * qty,
    }
  }

  // Get all service details
  const serviceDetails = selectedServices
    .map(getServiceDetails)
    .filter(Boolean) as any[]

  // Calculate total price
  const totalPrice = serviceDetails.reduce((sum, detail) => sum + detail.total_price, 0)

  // Get combined time range
  const timeRange = serviceDetails.length > 0 ? {
    start: serviceDetails
      .map(d => d.start_datetime)
      .reduce((a, b) => a < b ? a : b),
    end: serviceDetails
      .map(d => d.end_datetime)
      .reduce((a, b) => a > b ? a : b)
  } : null

  // Format date for backend
  const formattedDate = selectedDate
    ? format(
      typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate,
      'yyyy-MM-dd'
    )
    : ''

  // Prepare booking summary
  const bookingSummary = {
    services: serviceDetails.map(detail => ({
      id: detail.service_id,
      slot_id: detail.slot_id,
      quantity: detail.quantity,
      start_datetime: detail.start_datetime,
      end_datetime: detail.end_datetime,
      assigned_staff: detail.assigned_staff.map((staff: any) => ({
        staff_id: staff.staff_id,
        staff_name: staff.staff_name,
      })),
      ...(selectedServices.find(s => s.id === detail.service_id)?.has_sessions && {
        preferred_gender: selectedServices.find(s => s.id === detail.service_id)?.preferred_gender
      })
    })),
    date: formattedDate,
    customer: {
      name: customerInfo.name,
      email: customerInfo.email,
      phone: customerInfo.phone,
      notes: customerInfo.notes || '',
    },
    totalPrice,
    totalStaffAssigned: serviceDetails.reduce((total, detail) => total + detail.staff_count, 0),
    language: currentLang,
  }
  return (
    <Card className='border-none bg-white/80 shadow-xl backdrop-blur'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-2xl'>
          <CheckCircle2 className='h-6 w-6 text-green-600' />
          {t('bookingWizard.review.title')}
        </CardTitle>
        <p className='text-sm text-muted-foreground'>
          {t('bookingWizard.review.subtitle')}
        </p>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {/* Booking Summary Card */}
          <div className='rounded-lg border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4'>
            <div className='mb-3 flex items-center gap-2'>
              <Calendar className='h-5 w-5 text-amber-600' />
              <h3 className='font-semibold text-amber-900'>
                {t('bookingWizard.review.bookingSummary')}
              </h3>
            </div>
            <div className='space-y-2 text-sm'>
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4 text-amber-600' />
                <span className='font-medium'>
                  {t('bookingWizard.review.date')}:
                </span>
                <span className='text-muted-foreground'>
                  {selectedDate &&
                    format(
                      typeof selectedDate === 'string'
                        ? new Date(selectedDate)
                        : selectedDate,
                      'EEEE d MMMM yyyy',
                      { locale: fr }
                    )}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <Users className='h-4 w-4 text-amber-600' />
                <span className='font-medium'>
                  {t('bookingWizard.review.guests')}:
                </span>
                {/* <span className='text-muted-foreground'>
                    {service?.quantity}{' '}
                    {service?.quantity > 1
                        ? t('bookingWizard.review.persons')
                        : t('bookingWizard.review.person')}
                    </span> */}
              </div>
              {timeRange && (
                <div className='flex items-center gap-2'>
                  <Clock className='h-4 w-4 text-amber-600' />
                  <span className='font-medium'>
                    {t('bookingWizard.review.bookingTime')}:
                  </span>
                  <span className='text-muted-foreground'>
                    {format(new Date(timeRange.start.replace(' ', 'T')), 'HH:mm')}
                    {timeRange.end &&
                      ` - ${format(new Date(timeRange.end.replace(' ', 'T')), 'HH:mm')}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Services with Individual Date/Time */}
          <div className='rounded-lg border-2 border-gray-200 bg-white p-4'>
            <div className='mb-4 flex items-center gap-2'>
              <Sparkles className='h-5 w-5 text-amber-600' />
              <h3 className='font-semibold'>
                {t('bookingWizard.review.servicesTitle')}
              </h3>
            </div>
            <div className='space-y-4'>
              {selectedServices.map((service: Service) => {
                const detail = serviceDetails.find(d => d.service_id === service.id)

                if (!detail) return null

                // Parse datetime for display
                const startDate = new Date(detail.start_datetime.replace(' ', 'T'))
                const endDate = new Date(detail.end_datetime.replace(' ', 'T'))

                return (
                  <div
                    key={service.id}
                    className='border-b pb-4 last:border-b-0 last:pb-0'
                  >
                    <div className='mb-2 flex items-start justify-between'>
                      <div className='flex-1'>
                        <p className='text-lg font-medium'>
                          {getLocalizedValue(service.name, currentLang)}
                        </p>
                        {/* Display assigned staff */}
                        {detail.assigned_staff.length > 0 && (
                          <div className='mt-2 flex flex-wrap gap-2'>
                            {detail.assigned_staff.map((staff: any) => (
                              <div
                                key={staff.staff_id}
                                className='flex items-center gap-1.5 rounded-md bg-amber-100 px-2 py-1'
                              >

                                <IconUserFilled className='h-3.5 w-3.5 text-amber-700' />
                                <span className='text-sm font-medium text-amber-900'>
                                  {staff.staff_name}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className='ml-4 text-right'>
                        <p className='font-semibold'>{service.price} $</p>
                        <p className='text-sm text-muted-foreground'>
                          {service.duration_minutes} min
                        </p>
                        {service.preferred_gender && (
                          <p className='mt-1 text-xs text-amber-600'>
                            {service.preferred_gender === 'female'
                              ? t('bookingWizard.selectOptions.genderFemale')
                              : service.preferred_gender === 'male'
                                ? t('bookingWizard.selectOptions.genderMale')
                                : t('bookingWizard.selectOptions.genderMixed')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='mt-2 space-y-1 rounded bg-amber-50 p-2 text-sm'>
                      <div className='flex items-center gap-2'>
                        <Calendar className='h-3.5 w-3.5 text-amber-600' />
                        <p className='text-muted-foreground'>
                          {format(startDate, 'EEEE d MMMM yyyy', { locale: fr })}
                        </p>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Clock className='h-3.5 w-3.5 text-amber-600' />
                        <p className='font-medium text-foreground'>
                          {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
                        </p>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Users className='h-3.5 w-3.5 text-amber-600' />
                        <p className='text-sm text-muted-foreground'>
                          {detail.quantity} {detail.quantity > 1 ? t('bookingWizard.review.persons') : t('bookingWizard.review.person')}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Customer Info */}
          <div className='rounded-lg border-2 border-gray-200 bg-white p-4'>
            <h3 className='mb-3 font-semibold'>
              {t('bookingWizard.review.customerInfoTitle')}
            </h3>
            <div className='space-y-1 text-sm'>
              <p>
                <strong>{t('bookingWizard.review.name')}</strong>{' '}
                {customerInfo.name}
              </p>
              <p>
                <strong>{t('bookingWizard.review.email')}</strong>{' '}
                {customerInfo.email}
              </p>
              <p>
                <strong>{t('bookingWizard.review.phone')}</strong>{' '}
                {customerInfo.phone}
              </p>
              {customerInfo.notes && (
                <p className='mt-2'>
                  <strong>{t('bookingWizard.review.notes')}</strong>{' '}
                  {customerInfo.notes}
                </p>
              )}
            </div>
          </div>

          {/* Total Price Section */}
          <div className='rounded-lg border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-rose-50 p-4'>
            <div className='space-y-2'>
              {/* Service breakdown */}
              {serviceDetails.map((detail) => {
                const service = selectedServices.find(s => s.id === detail.service_id)
                return (
                  <div key={detail.service_id} className='flex justify-between text-sm'>
                    <span className='text-gray-700'>
                      {service ? getLocalizedValue(service.name, currentLang) : 'Unknown Service'} × {detail.quantity}
                    </span>
                    <span className='font-medium text-gray-900'>
                      {detail.total_price} $
                    </span>
                  </div>
                )
              })}

              {/* Total */}
              <div className='border-t border-amber-300 pt-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-lg font-semibold'>
                    {t('bookingWizard.review.total')}
                  </span>
                  <span className='text-2xl font-bold text-amber-600'>
                    {totalPrice} $
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Alert>
            <AlertDescription className='text-sm'>
              {t('bookingWizard.review.termsAccept')}
            </AlertDescription>
          </Alert>
        </div>

        <div className='mt-6 flex justify-between'>
          <Button
            variant='outline'
            onClick={onPrev}
            size='lg'
            disabled={isSubmitting}
          >
            {t('bookingWizard.review.back')}
          </Button>
          <Button
            onClick={() => onConfirm(bookingSummary)}
            disabled={isSubmitting}
            size='lg'
            className='bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
          >
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                {t('bookingWizard.review.confirming')}
              </>
            ) : (
              <>
                <CheckCircle2 className='mr-2 h-4 w-4' />
                {t('bookingWizard.review.confirm')}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
