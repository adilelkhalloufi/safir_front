import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import { cn } from '@/lib/utils'
import { Clock, ChevronRight, Loader2 } from 'lucide-react'
import type { AvailabilityScenario } from '@/interfaces/models/booking'
import { format } from 'date-fns'

interface SelectDateTimeProps {
    selectedDate: Date | undefined
    onSelectDate: (date: Date | undefined) => void
    availability: AvailabilityScenario[]
    isLoading: boolean
    selectedScenario: AvailabilityScenario | null
    onSelectScenario: (scenario: AvailabilityScenario) => void
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
    onNext,
    onPrev
}: SelectDateTimeProps) {
    return (
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-2xl">Date et horaire</CardTitle>
                <p className="text-sm text-muted-foreground">Sélectionnez votre date et votre créneau horaire</p>
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
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="mb-3 text-sm font-medium">Créneaux disponibles</div>

                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                                </div>
                            ) : availability.length === 0 ? (
                                <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-6 text-center">
                                    <p className="text-muted-foreground">Aucun créneau disponible pour cette date.</p>
                                    <p className="text-sm text-muted-foreground mt-2">Veuillez sélectionner une autre date.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {availability.map((scenario) => {
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
                                                    {scenario.services.map((svc, idx) => (
                                                        <div key={idx}>
                                                            • {svc.service_name}
                                                            {svc.staff_name && ` avec ${svc.staff_name}`}
                                                            {svc.room_name && ` (${svc.room_name})`}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-2 text-xs text-muted-foreground">
                                                    Durée totale: {scenario.total_duration_minutes} min
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
                        disabled={!selectedDate || !selectedScenario}
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
