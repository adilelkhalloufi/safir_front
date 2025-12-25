import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import { cn } from '@/lib/utils'
import { Clock, ChevronRight, Loader2, CheckCircle2, Droplets, Hand, Waves, Sparkles } from 'lucide-react'
import type { AvailabilityScenario, AvailabilitySlot, Service } from '@/interfaces/models/booking'
import { format } from 'date-fns'

interface SelectDateTimeProps {
    selectedDate: Date | undefined
    onSelectDate: (date: Date | undefined) => void
    availability: AvailabilitySlot[] | null
    isLoading: boolean
    selectedScenario: AvailabilityScenario | null
    onSelectScenario: (slot: AvailabilitySlot | null) => void
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
    // Check if date is valid
    const isValidDate = selectedDate instanceof Date && !isNaN(selectedDate.getTime())
    const formattedSelectedDate = isValidDate ? format(selectedDate, 'yyyy-MM-dd') : ''

    // Filter slots for the selected date
    const slotsForDate = availability?.filter(slot => 
        slot.date === formattedSelectedDate
    ) || []

    // Group slots by date for display
    const slotsByDate = availability?.reduce((acc, slot) => {
        if (!acc[slot.date]) acc[slot.date] = []
        acc[slot.date].push(slot)
        return acc
    }, {} as Record<string, AvailabilitySlot[]>) || {}

    const hasSelection = !!selectedScenario

    return (
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-2xl">Date et horaire</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Sélectionnez votre date et votre créneau horaire
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
                            ) : !slotsForDate || slotsForDate.length === 0 ? (
                                <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-6 text-center">
                                    <p className="text-muted-foreground">Aucun créneau disponible pour cette date.</p>
                                    <p className="text-sm text-muted-foreground mt-2">Veuillez sélectionner une autre date.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {slotsForDate.map((slot, index) => {
                                        const isSelected = selectedScenario?.start_datetime === slot.datetime
                                        
                                        return (
                                            <button
                                                key={`${slot.datetime}-${index}`}
                                                onClick={() => onSelectScenario(slot)}
                                                disabled={!slot.available}
                                                className={cn(
                                                    'relative rounded-lg border-2 p-4 text-center transition-all duration-300',
                                                    !slot.available && 'opacity-50 cursor-not-allowed',
                                                    isSelected
                                                        ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-rose-50 shadow-md'
                                                        : 'border-gray-200 bg-white hover:border-amber-300 hover:shadow-sm'
                                                )}
                                            >
                                                {isSelected && (
                                                    <CheckCircle2 className="absolute top-1 right-1 h-5 w-5 text-amber-600" />
                                                )}
                                                <Clock className={cn('h-5 w-5 mx-auto mb-2', isSelected ? 'text-amber-600' : 'text-gray-600')} />
                                                <div className={cn('font-semibold text-lg', isSelected && 'text-amber-600')}>
                                                    {slot.time}
                                                </div>
                                                {slot.staff_name && (
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {slot.staff_name}
                                                    </div>
                                                )}
                                                {slot.available_capacity && (
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {slot.available_capacity} places
                                                    </div>
                                                )}
                                                {slot.session_type && (
                                                    <div className="text-xs text-amber-600 mt-1 font-medium">
                                                        {slot.session_type === 'female' ? 'Femmes' : slot.session_type === 'male' ? 'Hommes' : 'Mixte'}
                                                    </div>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}

                            {/* Show available dates */}
                            {Object.keys(slotsByDate).length > 1 && (
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-900 font-medium mb-2">Autres dates disponibles:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.keys(slotsByDate).slice(0, 5).map(date => (
                                            <button
                                                key={date}
                                                onClick={() => onSelectDate(new Date(date))}
                                                className="text-xs px-3 py-1 rounded-full bg-white border border-blue-200 hover:border-blue-400 transition-colors"
                                            >
                                                {format(new Date(date), 'dd/MM/yyyy')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={onPrev} size="lg">Retour</Button>
                    <Button
                        disabled={!selectedDate || !hasSelection}
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
