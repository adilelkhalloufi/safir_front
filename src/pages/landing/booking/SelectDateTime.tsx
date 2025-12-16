import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import { cn } from '@/lib/utils'
import { Clock, ChevronRight, Loader2, CheckCircle2, Droplets, Hand, Waves, Sparkles } from 'lucide-react'
import type { AvailabilityScenario, Service } from '@/interfaces/models/booking'
import { format } from 'date-fns'

interface SelectDateTimeProps {
    selectedDate: Date | undefined
    onSelectDate: (date: Date | undefined) => void
    availability: Record<number, AvailabilityScenario[]> | AvailabilityScenario[] | null
    isLoading: boolean
    selectedScenario: AvailabilityScenario | null
    onSelectScenario: (scenario: AvailabilityScenario) => void
    selectedTimeSlots?: Record<number, AvailabilityScenario>
    onSelectTimeSlot?: (serviceId: number, scenario: AvailabilityScenario) => void
    selectedServices?: Service[]
    onNext: () => void | null
    onPrev: () => void
}

const SERVICE_ICONS: Record<string, any> = {
    'hammam': Droplets,
    'massage': Hand,
    'gommage': Waves,
    'masso': Sparkles,
    'spa': Sparkles,
    'other': Clock
}

export function SelectDateTime({
    selectedDate,
    onSelectDate,
    availability,
    isLoading,
    selectedScenario,
    onSelectScenario,
    selectedTimeSlots = {},
    onSelectTimeSlot,
    selectedServices = [],
    onNext,
    onPrev
}: SelectDateTimeProps) {
    // Check if availability is service-specific (Record) or combined (Array)
    const isServiceSpecific = availability && !Array.isArray(availability)
    const hasAllTimeSlots = isServiceSpecific
        ? Object.keys(availability || {}).every(serviceId => selectedTimeSlots[Number(serviceId)])
        : !!selectedScenario

    return (
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-2xl">Date et horaire</CardTitle>
                <p className="text-sm text-muted-foreground">
                    {isServiceSpecific
                        ? 'Sélectionnez un créneau pour chaque service'
                        : 'Sélectionnez votre date et votre créneau horaire'}
                </p>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div>
                        <div className="mb-3 text-sm font-medium">Choisissez une date</div>
                        <DatePicker
                            label="Sélectionner une date"
                            defaultValue={selectedDate}
                            onChange={(date) => onSelectDate(date as any)}
                        />
                    </div>

                    {selectedDate && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                            <div className="mb-3 text-sm font-medium">Créneaux disponibles</div>

                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                                </div>
                            ) : !availability || (isServiceSpecific && Object.keys(availability).length === 0) || (!isServiceSpecific && (availability as any).length === 0) ? (
                                <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-6 text-center">
                                    <p className="text-muted-foreground">Aucun créneau disponible pour cette date.</p>
                                    <p className="text-sm text-muted-foreground mt-2">Veuillez sélectionner une autre date.</p>
                                </div>
                            ) : isServiceSpecific ? (
                                // Service-specific time slots
                                <div className="space-y-6">
                                    {Object.entries(availability as Record<number, AvailabilityScenario[]>).map(([serviceIdStr, scenarios]) => {
                                        const serviceId = Number(serviceIdStr)
                                        const service = selectedServices.find(s => s.id === serviceId)
                                        const Icon = SERVICE_ICONS[service?.type_service || 'other'] || Clock
                                        const selectedSlot = selectedTimeSlots[serviceId]

                                        return (
                                            <div key={serviceId} className="space-y-3">
                                                <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                                                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#020F44] to-[#E09900]">
                                                        <Icon className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{service?.name}</h3>
                                                        <p className="text-xs text-muted-foreground">{service?.duration || service?.duration_minutes} min • {service?.price} MAD</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                    {scenarios.map((scenario: any) => {
                                                        const isSelected = selectedSlot?.scenario_id === scenario.scenario_id
                                                        const startTime = format(new Date(scenario.start_datetime), 'HH:mm')

                                                        return (
                                                            <button
                                                                key={scenario.scenario_id}
                                                                onClick={() => onSelectTimeSlot?.(serviceId, scenario)}
                                                                className={cn(
                                                                    'relative rounded-lg border-2 p-3 text-center transition-all duration-300',
                                                                    isSelected
                                                                        ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-rose-50 shadow-md'
                                                                        : 'border-gray-200 bg-white hover:border-amber-300 hover:shadow-sm'
                                                                )}
                                                            >
                                                                {isSelected && (
                                                                    <CheckCircle2 className="absolute top-1 right-1 h-5 w-5 text-amber-600" />
                                                                )}
                                                                <Clock className={cn('h-4 w-4 mx-auto mb-1', isSelected ? 'text-amber-600' : 'text-gray-600')} />
                                                                <div className={cn('font-semibold text-sm', isSelected && 'text-amber-600')}>
                                                                    {startTime}
                                                                </div>
                                                                {scenario.available_capacity && (
                                                                    <div className="text-xs text-muted-foreground mt-1">
                                                                        {scenario.available_capacity} places
                                                                    </div>
                                                                )}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                // Combined time slots (original functionality)
                                <div className="space-y-3">
                                    {(availability as AvailabilityScenario[]).map((scenario: any) => {
                                        const isSelected = selectedScenario?.scenario_id === scenario.scenario_id
                                        const startTime = format(new Date(scenario.start_datetime), 'HH:mm')
                                        const endTime = format(new Date(scenario.end_datetime), 'HH:mm')

                                        return (
                                            <button
                                                key={scenario.scenario_id}
                                                onClick={() => onSelectScenario(scenario)}
                                                className={cn(
                                                    'w-full rounded-xl border-2 p-4 text-left transition-all duration-300',
                                                    isSelected
                                                        ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-rose-50 shadow-lg'
                                                        : 'border-gray-200 bg-white hover:border-amber-300 hover:shadow-md'
                                                )}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className={cn('h-5 w-5', isSelected ? 'text-amber-600' : 'text-gray-600')} />
                                                        <span className={cn('font-semibold text-lg', isSelected && 'text-amber-600')}>
                                                            {startTime} - {endTime}
                                                        </span>
                                                    </div>
                                                    <span className="font-semibold text-amber-600">{scenario.total_price} MAD</span>
                                                </div>
                                                <div className="space-y-1 text-sm text-muted-foreground">
                                                    {scenario.services.map((svc: any, idx: any) => (
                                                        <div key={idx}>
                                                            • {svc.service_name}
                                                            {svc.staff_name && ` avec ${svc.staff_name}`}
                                                            {svc.room_name && ` (${svc.room_name})`}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-2 text-xs text-muted-foreground">
                                                    Durée totale: {scenario.total_duration_minutes || scenario.total_duration} min
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={onPrev} size="lg">Retour</Button>
                    <Button
                        disabled={!selectedDate || !hasAllTimeSlots}
                        onClick={() => onNext() as any}
                        size="lg"
                        className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700"
                    >
                        Continuer <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
