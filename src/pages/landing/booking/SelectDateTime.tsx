import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { ChevronRight, Loader2, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { AvailabilityScenario, Service } from '@/interfaces/models/booking'

import { showNotification } from '@/utils'

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
    selectedScenario: AvailabilityScenario | null
    onSelectScenario: (slot: any) => void
    selectedServices?: Service[]
    personCount: number
    onNext: () => void | null
    onPrev: () => void
}



export function SelectDateTime({
    selectedDate,
    onSelectDate,
    availability,
    isLoading,
    selectedScenario,
    onSelectScenario,
    personCount,
    onNext,
    onPrev
}: SelectDateTimeProps) {
    const { t } = useTranslation()

    // Handler for slot selection - automatically assigns staff based on personCount
    const handleSlotClick = (slot: any, serviceId: number) => {
        // Check if there's enough capacity using the slot's available_capacity
        const availableCapacity = slot.available_capacity || slot.available_staff_count || 0
        if (availableCapacity < personCount) {
            showNotification(
                t('bookingWizard.selectDateTime.insufficientCapacity', {
                    needed: personCount,
                    available: availableCapacity
                })
            )
            return
        }

        // Automatically proceed with staff assignment
        onSelectScenario({ slot, serviceId })
    }



    // Get individual service availability for tabs
    const individualServices = availability?.individual_service_availability || []
    const hasSlots = individualServices.length > 0

    // Check if all services have selections
    const hasAllSelections = individualServices.length > 0 && individualServices.every((service: any) =>
        selectedScenario?.services?.some((s: any) => s.service_id === service.service_id)
    )

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
                                <Tabs defaultValue={individualServices[0]?.service_id?.toString()} className="w-full">
                                    <TabsList className="grid w-full mb-4" style={{ gridTemplateColumns: `repeat(${individualServices.length}, minmax(0, 1fr))` }}>
                                        {individualServices.map((service: any) => (
                                            <TabsTrigger
                                                key={service.service_id}
                                                value={service.service_id.toString()}
                                                className="text-xs sm:text-sm px-2"
                                            >
                                                {service.service_name}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>

                                    {individualServices.map((service: any) => (
                                        <TabsContent key={service.service_id} value={service.service_id.toString()}>
                                            <div className="space-y-3">
                                                {/* Compact Service Info */}
                                                <div className="bg-gradient-to-r from-amber-50 to-rose-50 p-3 rounded-lg border border-amber-200">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="font-medium text-amber-900">{service.duration} min</span>
                                                        <span className="text-amber-700">{service.slots_count} slots</span>
                                                    </div>
                                                </div>

                                                {/* Compact Time Slots Grid */}
                                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                                                    {service.available_slots?.map((slot: any, index: number) => {
                                                        const isSelected = selectedScenario?.services?.some((s: any) =>
                                                            s.service_id === service.service_id && s.start_datetime === slot.start_datetime
                                                        )
                                                        // Get available capacity directly from slot
                                                        const availableCapacity = slot.available_capacity || slot.available_staff_count || 0
                                                        const hasInsufficientCapacity = availableCapacity > 0 && availableCapacity < personCount

                                                        return (
                                                            <button
                                                                key={`${slot.start_datetime}-${index}`}
                                                                onClick={() => handleSlotClick(slot, service.service_id)}
                                                                className={cn(
                                                                    'relative rounded-lg border-2 p-2 text-center transition-all duration-200',
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
                                                                    'font-bold text-sm',
                                                                    isSelected ? 'text-amber-600' : 'text-gray-700'
                                                                )}>
                                                                    {slot.start_time}
                                                                </div>

                                                                {/* Display all staff names */}
                                                                {slot.available_staff && slot.available_staff.length > 0 && (
                                                                    <div className={cn(
                                                                        'text-[9px] mt-0.5 max-h-12 overflow-y-auto',
                                                                        isSelected ? 'text-amber-600' : 'text-gray-500'
                                                                    )}>
                                                                        {slot.available_staff.map((staff: any) => (
                                                                            <div key={staff.staff_id} className="truncate">
                                                                                {staff.staff_name}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                {/* Fallback to single staff name if available_staff is not present */}
                                                                {(!slot.available_staff || slot.available_staff.length === 0) && slot.staff_name && (
                                                                    <div className={cn(
                                                                        'text-[10px] mt-0.5',
                                                                        isSelected ? 'text-amber-600' : 'text-gray-400'
                                                                    )}>
                                                                        {slot.staff_name}
                                                                    </div>
                                                                )}

                                                                {/* Capacity indicator */}
                                                                {availableCapacity > 0 && (
                                                                    <div className={cn(
                                                                        'text-[9px] mt-0.5 font-medium',
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
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            )}
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={onPrev} size="lg">{t('bookingWizard.selectDateTime.back')}</Button>
                    <Button
                        disabled={!selectedDate || !hasAllSelections}
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
