import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import { cn } from '@/lib/utils'
import { ChevronRight, Loader2, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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
    selectedTimeSlot: AvailabilityScenario | null
    onSelectTimeSlot: (timeSlot: AvailabilityScenario | null) => void
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
    onPrev
}: SelectDateTimeProps) {
    const { t } = useTranslation()

    // Handler for combined slot selection
    const handleSlotClick = (slot: CombinedSlot) => {
        // Check if there's enough capacity for all services
        const maxPersonCount = Math.max(...(selectedServices?.map(s => s.quntity || 1) || [1]))
        const availableCapacity = slot.available_staff?.length || 0
        if (availableCapacity < maxPersonCount) {
            showNotification(
                t('bookingWizard.selectDateTime.insufficientCapacity', {
                    needed: maxPersonCount,
                    available: availableCapacity
                })
            )
            return
        }

        // Create the scenario with sequential service scheduling
        const scenarioId = `combined-${slot.start_datetime.replace(/[^0-9]/g, '')}`
        const datePart = slot.start_datetime.split(' ')[0]
        const scenario = {
            scenario_id: scenarioId,
            start_datetime: slot.start_datetime,
            end_datetime: slot.end_datetime,
            total_duration: slot.services_breakdown.reduce((sum, s) => sum + s.duration, 0),
            total_price: selectedServices?.reduce((sum, s) => sum + (s.price || 0) * (s.quntity || 1), 0) || 0,
            services: slot.services_breakdown.map((breakdown, index) => {
                const service = selectedServices?.find(s => s.id === breakdown.service_id)
                const personCount = service?.quntity || 1
                // Assign staff based on person count
                const assignedStaff = slot.available_staff?.slice(0, personCount) || []

                return {
                    service_id: breakdown.service_id,
                    service_name: breakdown.service_name,
                    start_datetime: `${datePart} ${breakdown.start_time}:00`,
                    end_datetime: `${datePart} ${breakdown.end_time}:00`,
                    duration: breakdown.duration,
                    assigned_staff: assignedStaff,
                    staff_count: assignedStaff.length,
                    available_staff: slot.available_staff || []
                }
            })
        }

        onSelectTimeSlot(scenario)
    }



    // Get combined slots
    const combinedSlots = availability?.combined_available_slots || []
    const hasSlots = combinedSlots.length > 0

    // Check if a combined scenario is selected
    const hasSelection = !!selectedTimeSlot

    return (
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-2xl">{t('bookingWizard.selectDateTime.title')}</CardTitle>
                <p className="text-sm text-muted-foreground">
                    {t('bookingWizard.selectDateTime.subtitle')}
                </p>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div>
                        <div className="mb-3 text-sm font-medium">{t('bookingWizard.selectDateTime.chooseDate')}</div>
                        <DatePicker
                            label={t('bookingWizard.selectDateTime.selectDate')}
                            defaultValue={selectedDate}
                            onChange={(date) => onSelectDate(date as any)}
                        />
                    </div>

                    {selectedDate && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                            <div className="mb-3 text-sm font-medium">{t('bookingWizard.selectDateTime.availableSlots')}</div>

                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                                </div>
                            ) : !hasSlots ? (
                                <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-6 text-center">
                                    <p className="text-muted-foreground">{t('bookingWizard.selectDateTime.noSlots')}</p>
                                    <p className="text-sm text-muted-foreground mt-2">{t('bookingWizard.selectDateTime.selectAnother')}</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Combined Services Info */}
                                    <div className="bg-gradient-to-r from-amber-50 to-rose-50 p-4 rounded-lg border border-amber-200">
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="font-medium text-amber-900">
                                                {t('bookingWizard.selectDateTime.sequentialBooking', 'Sequential Booking')}
                                            </span>
                                            <span className="text-amber-700">
                                                {combinedSlots.length} {t('bookingWizard.selectDateTime.availableSlots', 'available slots')}
                                            </span>
                                        </div>
                                        <p className="text-xs text-amber-700">
                                            {t('bookingWizard.selectDateTime.sequentialNote', 'Services will be scheduled sequentially in the order selected to avoid time conflicts.')}
                                        </p>
                                    </div>

                                    {/* Combined Time Slots Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                        {combinedSlots.map((slot: CombinedSlot, index: number) => {
                                            const isSelected = selectedTimeSlot?.scenario_id === `combined-${slot.start_datetime.replace(/[^0-9]/g, '')}`
                                            const maxPersonCount = Math.max(...(selectedServices?.map(s => s.quntity || 1) || [1]))
                                            const availableCapacity = slot.available_staff?.length || 0
                                            const hasInsufficientCapacity = availableCapacity > 0 && availableCapacity < maxPersonCount

                                            return (
                                                <button
                                                    key={`${slot.start_datetime}-${index}`}
                                                    onClick={() => handleSlotClick(slot)}
                                                    className={cn(
                                                        'relative rounded-lg border-2 p-3 text-center transition-all duration-200',
                                                        hasInsufficientCapacity && 'opacity-60 border-red-200',
                                                        isSelected
                                                            ? 'border-amber-500 bg-gradient-to-br from-amber-100 to-rose-100 shadow-md'
                                                            : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50'
                                                    )}
                                                >
                                                    {isSelected && (
                                                        <CheckCircle2 className="absolute -top-1 -right-1 h-4 w-4 text-amber-600 bg-white rounded-full shadow-sm" />
                                                    )}

                                                    <div className={cn(
                                                        'font-bold text-sm mb-1',
                                                        isSelected ? 'text-amber-600' : 'text-gray-700'
                                                    )}>
                                                        {slot.start_time} - {slot.end_time}
                                                    </div>

                                                    {/* Services breakdown */}
                                                    <div className={cn(
                                                        'text-[10px] space-y-0.5 mb-2',
                                                        isSelected ? 'text-amber-600' : 'text-gray-500'
                                                    )}>
                                                        {slot.services_breakdown.map((service, idx) => (
                                                            <div key={idx} className="truncate">
                                                                {service.service_name} ({service.start_time})
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Staff info */}
                                                    {slot.available_staff && slot.available_staff.length > 0 && (
                                                        <div className={cn(
                                                            'text-[9px] mb-1',
                                                            isSelected ? 'text-amber-600' : 'text-gray-500'
                                                        )}>
                                                            {slot.available_staff.length} {t('bookingWizard.selectDateTime.staffAvailable', 'staff available')}
                                                        </div>
                                                    )}

                                                    {/* Capacity indicator */}
                                                    {availableCapacity > 0 && (
                                                        <div className={cn(
                                                            'text-[9px] font-medium',
                                                            hasInsufficientCapacity ? 'text-red-600' : 'text-gray-500'
                                                        )}>
                                                            {availableCapacity} {t('bookingWizard.selectDateTime.places')}
                                                        </div>
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={onPrev} size="lg">{t('bookingWizard.selectDateTime.back')}</Button>
                    <Button
                        disabled={!selectedDate || !hasSelection}
                        onClick={() => onNext() as any}
                        size="lg"
                        className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700"
                    >
                        {t('bookingWizard.selectDateTime.continue')} <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
