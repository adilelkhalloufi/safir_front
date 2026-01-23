import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import { format } from 'date-fns'
import { ChevronRight, Loader2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getLocalizedValue } from '@/interfaces/models/booking'
import { showNotification, NotificationType } from '@/utils'
import { Service } from '@/interfaces/models/service'
import SlotTimeButton from './components/SlotTimeButton'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'
import { setServiceSlot } from '@/store/slices/bookingSlice'  

// Interface matching actual API response
interface CombinedSlot {
  start_time: string
  end_time: string
  start_datetime: string
  end_datetime: string
  services_breakdown: {
    service_id: number
    service_name: string
    duration: number
    start_time: string
    end_time: string
    staff_id: number
    staff_name: string
  }[]
  available_staff: any[]
}

interface AvailabilityResponse {
  date: string
  services: any[]
  total_duration: number
  individual_service_availability: any[]
  combined_available_slots: CombinedSlot[]
  combined_slots_count: number
}

interface SelectDateTimeProps {
  selectedDate: Date | undefined
  onSelectDate: (date: Date | undefined) => void
  availability: AvailabilityResponse | null
  isLoading: boolean
  selectedServices?: Service[]
  onNext: () => void | null
  onPrev: () => void
} 

export function SelectDateTime({
  selectedDate,
  onSelectDate,
  availability,
  isLoading,
  selectedServices,
  onNext,
  onPrev,
}: SelectDateTimeProps) {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()

  const handleServiceSlotClick = (service: Service, slot: any) => {
    const personCount = service.quantity || 1
    const availableCapacity = slot.available_capacity || 0

    // Check capacity
    if (availableCapacity < personCount) {
      showNotification(
        t('bookingWizard.selectDateTime.insufficientCapacity', {
          needed: personCount,
          available: availableCapacity,
        }),
        NotificationType.ERROR
      )
      return
    }

    // Check overlap with already selected service slots
    const parseRange = (s: any) => {
      try {
        if (s.start_datetime && s.end_datetime) {
          const start = new Date(s.start_datetime.replace(' ', 'T'))
          const end = new Date(s.end_datetime.replace(' ', 'T'))
          if (!isNaN(start.getTime()) && !isNaN(end.getTime())) return { start, end }
        }

        if (selectedDate && s.start_time && s.end_time) {
          // build from selected date
          const dateStr = format(selectedDate, 'yyyy-MM-dd')
          const startStr = `${dateStr}T${s.start_time}${s.start_time.includes(':') && s.start_time.split(':').length === 2 ? ':00' : ''}`
          const endStr = `${dateStr}T${s.end_time}${s.end_time.includes(':') && s.end_time.split(':').length === 2 ? ':00' : ''}`
          const start = new Date(startStr)
          const end = new Date(endStr)
          if (!isNaN(start.getTime()) && !isNaN(end.getTime())) return { start, end }
        }
      } catch (err) {
        // ignore
      }
      return { start: null, end: null }
    }

    const candidate = parseRange(slot)
    if (!candidate.start || !candidate.end) {
      // Can't validate overlap, allow selection (but could warn)
      dispatch(setServiceSlot({ serviceId: service.id, slot }))
      return
    }

    // iterate other services with chosen slots
    const hasOverlap = (selectedServices || []).some((s: any) => {
      if (s.id === service.id) return false
      const otherSlot = s.slot
      if (!otherSlot) return false
      const other = parseRange(otherSlot)
      if (!other.start || !other.end) return false
      // overlap if startA < endB && startB < endA
      return candidate.start < other.end && other.start < candidate.end
    })

    if (hasOverlap) {
      showNotification(t('bookingWizard.selectDateTime.slotOverlap', 'Selected time overlaps with another chosen service.'), NotificationType.ERROR)
      return
    }

    // No overlap — update slot in booking slice
    dispatch(setServiceSlot({ serviceId: service.id, slot }))

   
   }

  // Per-service availability
  const serviceAvailabilities = (availability?.combined_available_slots || []) as any[]

  const hasSlots = serviceAvailabilities.some(
    (svc) => (svc.available_slots || []).length > 0
  )

  // Check if every selected service has a chosen slot
  const hasSelection =
    (selectedServices || []).length > 0 &&
    (selectedServices || []).every((s) => !!(s as any).slot)

  return (
    <Card className='border-none bg-white/80 shadow-xl backdrop-blur'>
      <CardHeader>
        <CardTitle className='text-2xl'>
          {t('bookingWizard.selectDateTime.title')}
        </CardTitle>
        <p className='text-sm text-muted-foreground'>
          {t('bookingWizard.selectDateTime.subtitle')}
        </p>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          <div>
            <div className='mb-3 text-sm font-medium'>
              {t('bookingWizard.selectDateTime.chooseDate')}
            </div>
            <DatePicker
              label={t('bookingWizard.selectDateTime.selectDate')}
              defaultValue={selectedDate}
              onChange={(date) => onSelectDate(date as any)}
            />
          </div>

          {selectedDate && (
            <div className='space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-4'>
              <div className='mb-3 text-sm font-medium'>
                {t('bookingWizard.selectDateTime.availableSlots')}
              </div>

              {isLoading ? (
                <div className='flex items-center justify-center py-12'>
                  <Loader2 className='h-8 w-8 animate-spin text-amber-600' />
                </div>
              ) : !hasSlots ? (
                <div className='rounded-lg border-2 border-gray-200 bg-gray-50 p-6 text-center'>
                  <p className='text-muted-foreground'>
                    {t('bookingWizard.selectDateTime.noSlots')}
                  </p>
                  <p className='mt-2 text-sm text-muted-foreground'>
                    {t('bookingWizard.selectDateTime.selectAnother')}
                  </p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {/* Per-service availability */}
                  <div className='space-y-4'>
                    {selectedServices && selectedServices.length > 0 ? (
                      selectedServices.map((service) => {
                        const svc = serviceAvailabilities.find(
                          (s) => s.service_id === service.id
                        )
                        const slots = svc?.available_slots || []

                        return (
                          <div
                            key={service.id}
                            className='rounded-lg border bg-white p-4'
                          >
                            <div className='mb-2 flex items-center justify-between'>
                              <div>
                                <p className='font-medium'>
                                  {getLocalizedValue(
                                    service.name,
                                    (i18n.language || 'fr') as any
                                  )}
                                </p>
                                <p className='text-xs text-muted-foreground'>
                                  {svc?.duration} min
                                </p>
                              </div>
                              <div className='flex items-center gap-3'>
                                <div className='text-sm text-amber-700'>
                                  {slots.length}{' '}
                                  {t(
                                    'bookingWizard.selectDateTime.availableSlots',
                                    'available slots'
                                  )}
                                </div>

                                {/* Clear selected slot for this service */}
                                {service.slot && (
                                  <button
                                    onClick={() => {
                                      dispatch(setServiceSlot({ serviceId: service.id, slot: null }))
                                      showNotification(t('bookingWizard.selectDateTime.slotCleared', 'Selection cleared'), NotificationType.SUCCESS)
                                    }}
                                    className='p-1 rounded-md text-red-600 hover:bg-red-50'
                                    aria-label={t('bookingWizard.selectDateTime.clearSelection', 'Clear selection')}
                                  >
                                    <X className='h-4 w-4' />
                                  </button>
                                )}
                              </div>
                            </div>

                            {slots.length === 0 ? (
                              <div className='rounded-lg border-2 border-gray-200 bg-gray-50 p-4 text-center'>
                                <p className='text-muted-foreground'>
                                  {svc?.message || t('bookingWizard.selectDateTime.noSlotsForService')}
                                </p>
                              </div>
                            ) : (
                              <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4'>
                                {slots.map((slot: any) => {
                                  const isSlotEqual = (a: any, b: any) => {
                                    if (!a || !b) return false
                                    // Prefer explicit slot_id when available
                                    if (a.slot_id && b.slot_id) return a.slot_id === b.slot_id
                                    // Fall back to full datetime comparison when slot_id is absent
                                    if (a.start_datetime && b.start_datetime)
                                      return a.start_datetime === b.start_datetime && a.end_datetime === b.end_datetime
                                    // Final fallback: compare start/end times
                                    return a.start_time === b.start_time && a.end_time === b.end_time
                                  }

                                  const isSelected = isSlotEqual(service.slot, slot)
                                  const personCount = service.quantity || 1
                                  const insufficient =
                                    (slot.available_capacity || 0) < personCount

                                  const disabled = insufficient 

                                  return (
                                    <SlotTimeButton
                                      key={slot.slot_id}
                                      slot={slot}
                                      isSelected={isSelected}
                                      disabled={disabled}
                                      insufficient={insufficient}
                                      onClick={() => handleServiceSlotClick(service, slot)}
                                    />
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      })
                    ) : (
                      <div className='rounded-lg border-2 border-gray-200 bg-gray-50 p-6 text-center'>
                        <p className='text-muted-foreground'>
                          {t('bookingWizard.selectDateTime.noServicesSelected')}
                        </p>
                        <p className='mt-2 text-sm text-muted-foreground'>
                          {t('bookingWizard.selectDateTime.selectAnother')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className='mt-6 flex justify-between'>
          <Button variant='outline' onClick={onPrev} size='lg'>
            {t('bookingWizard.selectDateTime.back')}
          </Button>
          <Button
            disabled={!selectedDate || !hasSelection}
            onClick={() => onNext() as any}
            size='lg'
            className='bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700'
          >
            {t('bookingWizard.selectDateTime.continue')}{' '}
            <ChevronRight className='ml-2 h-4 w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
