import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { CheckCircle2, Clock, ChevronRight, Sparkles, Scissors, Droplets, Hand, Waves } from 'lucide-react'
import type { Service } from '@/interfaces/models/booking'

interface SelectServicesProps {
    services: Service[]
    selected: number[]
    onToggle: (id: number, service: Service) => void
    onNext: () => void | null
}

const SERVICE_ICONS: Record<string, any> = {
    'masso': Sparkles,
    'coiffure': Scissors,
    'hammam': Droplets,
    'massage': Hand,
    'gommage': Waves,
    'spa': Sparkles,
    'other': Sparkles
}

const SERVICE_TYPE_LABELS: Record<string, string> = {
    'hammam': 'Hammam',
    'massage': 'Massage',
    'gommage': 'Gommage',
    'masso': 'Massage',
    'coiffure': 'Coiffure',
    'spa': 'Spa',
    'other': 'Autres'
}

export function SelectServices({ services, selected, onToggle, onNext }: SelectServicesProps) {
    // Group services by type
    const groupedServices = services.reduce((acc, service: any) => {
        const type = service.type_service || 'other'
        if (!acc[type]) {
            acc[type] = []
        }
        acc[type].push(service)
        return acc
    }, {} as Record<string, Service[]>)

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
                <CardHeader>
                    <CardTitle className="text-2xl">Sélectionnez vos services</CardTitle>
                    <p className="text-sm text-muted-foreground">Vous pouvez sélectionner plusieurs services</p>
                </CardHeader>
                <CardContent className="space-y-8">
                    {Object.entries(groupedServices).map(([type, servicesList]) => (
                        <div key={type} className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                                <h3 className="text-lg font-semibold text-[#020F44]">
                                    {SERVICE_TYPE_LABELS[type] || type}
                                </h3>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                {servicesList.map((svc: any) => {
                                    const Icon = SERVICE_ICONS[svc.type_service] || Sparkles
                                    const isSelected = selected.includes(svc.id)

                                    return (
                                        <button
                                            key={svc.id}
                                            className={cn(
                                                'group relative rounded-xl border-2 p-6 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
                                                isSelected
                                                    ? 'border-[#E09900] bg-gradient-to-br from-orange-50 to-blue-50 shadow-lg'
                                                    : 'border-gray-200 bg-white hover:border-[#E09900]/30'
                                            )}
                                            onClick={() => onToggle(svc.id, svc)}
                                        >
                                            {isSelected && (
                                                <div className="absolute top-3 right-3">
                                                    <CheckCircle2 className="h-6 w-6 text-[#E09900]" />
                                                </div>
                                            )}
                                            <div className={cn(
                                                'mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300',
                                                isSelected ? 'bg-gradient-to-r from-[#020F44] to-[#E09900]' : 'bg-gray-100 group-hover:bg-orange-100'
                                            )}>
                                                <Icon className={cn('h-6 w-6', isSelected ? 'text-white' : 'text-gray-600 group-hover:text-[#E09900]')} />
                                            </div>
                                            <div className="font-semibold text-lg mb-1">{svc.name}</div>
                                            <div className="text-sm text-muted-foreground mb-3">{svc.description}</div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <Clock className="h-3 w-3 text-green-600" />
                                                <span className="text-green-600 font-medium">{svc.duration_minutes || svc.duration} min</span>
                                            </div>
                                            <div className="mt-2 text-sm font-semibold text-[#E09900]">{svc.price} MAD</div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                    <div className="mt-6 flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                            {selected.length} service{selected.length > 1 ? 's' : ''} sélectionné{selected.length > 1 ? 's' : ''}
                        </p>
                        <Button
                            disabled={!selected.length}
                            onClick={() => onNext() as any}
                            className="bg-gradient-to-r from-[#020F44] to-[#E09900] hover:from-[#020F44]/90 hover:to-[#E09900]/90"
                            size="lg"
                        >
                            Continuer <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
