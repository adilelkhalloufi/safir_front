import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ChevronRight, Sparkles, Scissors, Droplets } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Service, Staff } from '@/interfaces/models/booking'
import { getLocalizedValue } from '@/interfaces/models/booking'

interface SelectOptionsProps {
    selectedServices: Service[]
    staff: Staff[]
    staffSelections: any
    // Record<number, number>
    onSelectStaff: (selections: Record<number, number>) => void
    gender: string
    onSelectGender: (gender: string) => void
    onNext: () => void
    onPrev: () => void
}

const SERVICE_ICONS: Record<string, any> = {
    'masso': Sparkles,
    'coiffure': Scissors,
    'hammam': Droplets
}

export function SelectOptions({
    selectedServices,
    staff,
    staffSelections,
    onSelectStaff,
    gender,
    onSelectGender,
    onNext,
    onPrev
}: SelectOptionsProps) {
    const { i18n } = useTranslation()
    const currentLang = (i18n.language || 'fr') as 'fr' | 'en' | 'ar'

    const hasHammam = selectedServices.some(s => s.type_service === 'hammam')

    const handleStaffSelect = (serviceId: number, staffId: number) => {
        onSelectStaff({ ...staffSelections, [serviceId]: staffId })
    }

    return (
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-2xl">Détails de vos services</CardTitle>
                <p className="text-sm text-muted-foreground">Personnalisez chaque service selon vos préférences</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {hasHammam && (
                        <div className="rounded-xl border-2 border-[#E09900]/30 bg-orange-50/50 p-4">
                            <div className="mb-3 font-semibold text-[#020F44]">Genre pour le Hammam</div>
                            <div className="flex gap-2">
                                {[
                                    { id: 'female', label: 'Femmes' },
                                    { id: 'male', label: 'Hommes' },
                                    { id: 'mixed', label: 'Mixte' }
                                ].map((g) => (
                                    <button
                                        key={g.id}
                                        onClick={() => onSelectGender(g.id)}
                                        className={cn(
                                            'flex-1 rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all',
                                            gender === g.id
                                                ? 'border-[#E09900] bg-[#E09900] text-white'
                                                : 'border-[#E09900]/30 bg-white text-[#020F44] hover:border-[#E09900]'
                                        )}
                                    >
                                        {g.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedServices.map((service: any) => {
                        const Icon = SERVICE_ICONS[service.type_service] || Sparkles
                        const serviceStaff = staff.filter(s => s.type_staff === service.type_service)

                        return (
                            <div key={service.id} className="rounded-xl border-2 border-gray-200 bg-white p-5">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#020F44] to-[#E09900]">
                                        <Icon className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg">{getLocalizedValue(service.name, currentLang)}</div>
                                        <div className="text-sm text-muted-foreground">{service.duration_minutes} min • {service.price} MAD</div>
                                    </div>
                                </div>

                                {serviceStaff.length > 0 && (
                                    <div>
                                        <div className="mb-2 text-sm font-medium text-gray-700">Praticien(ne)</div>
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            <button
                                                onClick={() => handleStaffSelect(service.id, 0)}
                                                className={cn(
                                                    'rounded-lg border-2 px-3 py-2 text-left text-sm transition-all hover:shadow-md',
                                                    staffSelections[service.id] === 0 || !staffSelections[service.id]
                                                        ? 'border-[#E09900] bg-orange-50 font-semibold'
                                                        : 'border-gray-200 hover:border-[#E09900]/30'
                                                )}
                                            >
                                                Pas de préférence
                                            </button>
                                            {serviceStaff.map((st: any) => (
                                                <button
                                                    key={st.id}
                                                    onClick={() => handleStaffSelect(service.id, st.id)}
                                                    className={cn(
                                                        'rounded-lg border-2 px-3 py-2 text-left text-sm transition-all hover:shadow-md',
                                                        staffSelections[service.id] === st.id
                                                            ? 'border-[#E09900] bg-orange-50 font-semibold'
                                                            : 'border-gray-200 hover:border-[#E09900]/30'
                                                    )}
                                                >
                                                    <div>{st.name}</div>
                                                    {st.services.length > 0 && (
                                                        <div className="text-xs text-muted-foreground">
                                                            {st.services.map((s: any) => s.name).join(', ')}
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
                <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={onPrev} size="lg">Retour</Button>
                    <Button onClick={onNext} size="lg" className="bg-gradient-to-r from-[#020F44] to-[#E09900] hover:from-[#020F44]/90 hover:to-[#E09900]/90">
                        Continuer <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
