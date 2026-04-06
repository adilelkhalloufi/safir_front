import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CalendarDays, Clock, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { apiRoutes } from '@/routes/api'
import http from '@/utils/http'
import SlotTimeButton from '@/pages/landing/booking/components/SlotTimeButton'

interface SubscriptionBookingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    serviceId: number
    serviceName: string
    subscriptionId: number
}

export default function SubscriptionBookingDialog({
    open,
    onOpenChange,
    serviceId,
    serviceName,
    subscriptionId,
}: SubscriptionBookingDialogProps) {
    const { t, i18n } = useTranslation()
    const queryClient = useQueryClient()
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [selectedSlot, setSelectedSlot] = useState<any>(null)

    // Fetch availability when a date is selected
    const { data: availabilityData, isLoading: availabilityLoading } = useQuery({
        queryKey: ['subscription-availability', serviceId, selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null],
        queryFn: async () => {
            const res = await http.post(apiRoutes.availability, {
                services: [{ service_id: serviceId, group_size: 1 }],
                date: format(selectedDate!, 'yyyy-MM-dd'),
            })
            return res.data.data
        },
        enabled: !!selectedDate,
        retry: false,
    })

    // Extract slots from availability response
    const slots = (() => {
        if (!availabilityData) return []
        // combined_available_slots is an array of service objects, each with available_slots
        if (availabilityData.combined_available_slots?.length > 0) {
            return availabilityData.combined_available_slots[0]?.available_slots ?? []
        }
        // Fallback to individual_service_availability
        if (availabilityData.individual_service_availability?.length > 0) {
            return availabilityData.individual_service_availability[0]?.available_slots ?? []
        }
        return []
    })()

    // Create booking mutation (authenticated user)
    const bookingMutation = useMutation({
        mutationFn: async () => {
            const assignedStaff = (selectedSlot.available_staff || [])
                .slice(0, 1)
                .map((s: any) => ({ staff_id: s.staff_id, staff_name: s.staff_name }))

            const payload = {
                service_ids: [serviceId],
                start_datetime: selectedSlot.start_datetime,
                end_datetime: selectedSlot.end_datetime,
                subscription_id: subscriptionId,
                services: [
                    {
                        id: serviceId,
                        slot_id: selectedSlot.slot_id,
                        quantity: 1,
                        start_datetime: selectedSlot.start_datetime,
                        end_datetime: selectedSlot.end_datetime,
                        assigned_staff: assignedStaff,
                    },
                ],
                date: format(selectedDate!, 'yyyy-MM-dd'),
                language: i18n.language || 'fr',
            }

            const res = await http.post(apiRoutes.bookings, payload)
            return res.data
        },
        onSuccess: () => {
            toast.success(t('subscriptionBooking.success', 'Reservation confirmed!'))
            queryClient.invalidateQueries({ queryKey: ['client-subscriptions'] })
            resetAndClose()
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || t('subscriptionBooking.error', 'Booking failed. Please try again.')
            toast.error(message)
        },
    })

    const resetAndClose = () => {
        setSelectedDate(undefined)
        setSelectedSlot(null)
        onOpenChange(false)
    }

    const handleSlotClick = (slot: any) => {
        if (selectedSlot?.slot_id === slot.slot_id) {
            setSelectedSlot(null)
        } else {
            setSelectedSlot(slot)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(val) => { if (!val) resetAndClose(); else onOpenChange(val) }}>
            <DialogContent className='max-h-[85vh] overflow-y-auto sm:max-w-lg'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <CalendarDays className='h-5 w-5' />
                        {t('subscriptionBooking.title', 'Book a session')}
                    </DialogTitle>
                    <p className='text-sm text-muted-foreground'>
                        {serviceName}
                    </p>
                </DialogHeader>

                <div className='space-y-6 pt-2'>
                    {/* Date Picker */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium'>
                            {t('subscriptionBooking.selectDate', 'Select a date')}
                        </label>
                        <DatePicker
                            defaultValue={selectedDate}
                            onChange={(date) => {
                                setSelectedDate(date)
                                setSelectedSlot(null)
                            }}
                            label={t('subscriptionBooking.pickDate', 'Pick a date')}
                            minDate={new Date()}
                        />
                    </div>

                    {/* Slots */}
                    {selectedDate && (
                        <div className='space-y-2'>
                            <label className='flex items-center gap-1.5 text-sm font-medium'>
                                <Clock className='h-4 w-4' />
                                {t('subscriptionBooking.availableSlots', 'Available time slots')}
                            </label>

                            {availabilityLoading ? (
                                <div className='flex items-center justify-center py-8'>
                                    <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
                                </div>
                            ) : slots.length === 0 ? (
                                <p className='py-4 text-center text-sm text-muted-foreground'>
                                    {t('subscriptionBooking.noSlots', 'No available slots for this date. Please try another date.')}
                                </p>
                            ) : (
                                <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
                                    {slots.map((slot: any) => (
                                        <SlotTimeButton
                                            key={slot.slot_id || `${slot.start_time}-${slot.end_time}`}
                                            slot={slot}
                                            isSelected={selectedSlot?.slot_id === slot.slot_id}
                                            onClick={() => handleSlotClick(slot)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Selected summary */}
                    {selectedSlot && selectedDate && (
                        <div className='rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm'>
                            <p className='font-medium text-amber-900'>
                                {format(selectedDate, 'EEEE d MMMM yyyy', { locale: i18n.language === 'fr' ? fr : undefined })}
                            </p>
                            <p className='text-amber-700'>
                                {selectedSlot.start_time} - {selectedSlot.end_time}
                            </p>
                        </div>
                    )}

                    {/* Confirm button */}
                    <Button
                        className='w-full'
                        disabled={!selectedSlot || bookingMutation.isPending}
                        onClick={() => bookingMutation.mutate()}
                    >
                        {bookingMutation.isPending ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                {t('subscriptionBooking.booking', 'Booking...')}
                            </>
                        ) : (
                            t('subscriptionBooking.confirm', 'Confirm reservation')
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
