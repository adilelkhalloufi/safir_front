import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ChevronRight, Loader2, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { getLocalizedValue } from '@/interfaces/models/booking'

import { showNotification } from '@/utils'
import { Service } from '@/interfaces/models/service'

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
  selectedTimeSlot: any | null
  onSelectTimeSlot: (timeSlot: any | null) => void
  selectedServices?: Service[]
  onNext: () => void | null
  onPrev: () => void
}

export function SelectDateTime({
  selectedDate,
  onSelectDate,
  availability,
  isLoading,
  selectedTimeSlot,
  onSelectTimeSlot,
  selectedServices,
  onNext,
  onPrev,
}: SelectDateTimeProps) {
  const { t, i18n } = useTranslation()

  const handleServiceSlotClick = (service: Service, slot: any) => {
        const personCount = service.quntity || 1
        const availableCapacity = slot.available_capacity || 0

        // Check capacity
        if (availableCapacity < personCount) {
        showNotification(
            t('bookingWizard.selectDateTime.insufficientCapacity', {
            needed: personCount,
            available: availableCapacity,
            })
        )
        return
        }

        // Check gender restriction
        const genderRestriction = slot.gender_restriction
        const servicePref = service.preferred_gender
        const genderConflict =
        servicePref &&
        genderRestriction &&
        servicePref !== 'mixed' &&
        genderRestriction !== 'mixed' &&
        servicePref !== genderRestriction
        if (genderConflict) {
        showNotification(t('bookingWizard.selectDateTime.genderConflict'))
        return
        }

        const newSelections = {
        ...selectedTimeSlot,
        [service.id]: slot,
        }
        onSelectTimeSlot(newSelections)

        // Build scenario from current selections
        const selectedServicesList = selectedServices || []
        const services = selectedServicesList.map((s) => {
        const chosen = s.id === service.id ? slot : newSelections[s.id]
        const assigned_staff = (chosen?.available_staff || [])
            .slice(0, s.quntity || 1)
            .map((st: any) => ({
            staff_id: st.staff_id,
            staff_name: st.staff_name,
            }))

        return {
            service_id: s.id,
            service_name: getLocalizedValue(s.name, (i18n.language || 'fr') as any),
            start_datetime: chosen?.start_datetime || '',
            end_datetime: chosen?.end_datetime || '',
            duration: s.duration_minutes || 0,
            assigned_staff: assigned_staff,
            staff_count: assigned_staff.length,
            available_staff: chosen?.available_staff || [],
        }
    })

    const pickedSlots = Object.values(newSelections).filter(Boolean)
    const allStart = pickedSlots.map((p: any) => p.start_datetime)
    const allEnd = pickedSlots.map((p: any) => p.end_datetime)

    const scenario = {
      scenario_id: `persvc-${selectedDate ? format(typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate, 'yyyyMMdd') : 'nodate'}-${Date.now()}`,
      start_datetime: allStart.length
        ? allStart.reduce((a: string, b: string) => (a < b ? a : b))
        : '',
      end_datetime: allEnd.length
        ? allEnd.reduce((a: string, b: string) => (a > b ? a : b))
        : '',
      total_duration: services.reduce((sum, s) => sum + (s.duration || 0), 0),
      total_price:
        selectedServicesList.reduce(
          (sum, s) => sum + (s.price || 0) * (s.quntity || 1),
          0
        ) || 0,
      services,
    }

    // Note: scenario is built but not stored in state, used in Review
  }

  // Per-service availability
  const serviceAvailabilities = (availability?.combined_available_slots || []) as any[]

  const hasSlots = serviceAvailabilities.some(
    (svc) => (svc.available_slots || []).length > 0
  )

  // Check if every selected service has a chosen slot
  const hasSelection =
    (selectedServices || []).length > 0 &&
    (selectedServices || []).every((s) => !!selectedTimeSlot?.[s.id])

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
                              <div className='text-sm text-amber-700'>
                                {slots.length}{' '}
                                {t(
                                  'bookingWizard.selectDateTime.availableSlots',
                                  'available slots'
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
                                  const isSelected =
                                    selectedTimeSlot?.[service.id]?.slot_id ===
                                    slot.slot_id
                                  const personCount = service.quntity || 1
                                  const insufficient =
                                    (slot.available_capacity || 0) < personCount
                                  const genderConflict =
                                    service.preferred_gender &&
                                    slot.gender_restriction &&
                                    service.preferred_gender !== 'mixed' &&
                                    slot.gender_restriction !== 'mixed' &&
                                    service.preferred_gender !==
                                      slot.gender_restriction
                                  const disabled =
                                    insufficient || genderConflict

                                  return (
                                    <button
                                      key={slot.slot_id}
                                      onClick={() =>
                                        handleServiceSlotClick(service, slot)
                                      }
                                      disabled={disabled}
                                      className={cn(
                                        'relative rounded-lg border p-3 text-center transition-all duration-200',
                                        isSelected
                                          ? 'border-amber-500 bg-amber-50 shadow-sm'
                                          : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50',
                                        disabled &&
                                          'cursor-not-allowed opacity-60'
                                      )}
                                    >
                                      {isSelected && (
                                        <CheckCircle2 className='absolute -right-1 -top-1 h-4 w-4 rounded-full bg-white text-amber-600 shadow-sm' />
                                      )}

                                      <div
                                        className={cn(
                                          'mb-1 text-sm font-bold',
                                          isSelected
                                            ? 'text-amber-600'
                                            : 'text-gray-700'
                                        )}
                                      >
                                        {slot.start_time} - {slot.end_time}
                                      </div>

                                      <div
                                        className={cn(
                                          'mb-2 text-[10px]',
                                          isSelected
                                            ? 'text-amber-600'
                                            : 'text-gray-500'
                                        )}
                                      >
                                        {slot.available_staff
                                          ?.slice(0, 2)
                                          .map((s: any) => s.staff_name)
                                          .join(', ')}
                                        {slot.available_staff &&
                                        slot.available_staff.length > 2
                                          ? ` +${slot.available_staff.length - 2}`
                                          : ''}
                                      </div>

                                      {(slot.available_capacity || 0) > 0 && (
                                        <div
                                          className={cn(
                                            'text-[9px] font-medium',
                                            insufficient
                                              ? 'text-red-600'
                                              : 'text-gray-500'
                                          )}
                                        >
                                          {slot.available_capacity}{' '}
                                          {t(
                                            'bookingWizard.selectDateTime.places'
                                          )}
                                        </div>
                                      )}

                                      {insufficient && (
                                        <div className='mt-1 text-xs text-red-600'>
                                          {t(
                                            'bookingWizard.selectDateTime.insufficientCapacityShort'
                                          )}
                                        </div>
                                      )}

                                      {genderConflict && (
                                        <div className='mt-1 text-xs text-red-600'>
                                          {t(
                                            'bookingWizard.selectDateTime.genderConflictShort'
                                          )}
                                        </div>
                                      )}
                                    </button>
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
