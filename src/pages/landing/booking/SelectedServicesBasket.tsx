import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Clock, DollarSign, Minus, Plus} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getLocalizedValue } from '@/interfaces/models/booking'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/store'
import { setServicePersonCount, toggleService } from '@/store/slices/bookingSlice'
import { Service } from '@/interfaces/models/service'
import { IconTrash, IconUsersGroup } from '@tabler/icons-react'

interface SelectedServicesBasketProps {
    selectedServices: Service[]
    selected: number[]
    step: number
}

export function SelectedServicesBasket({ selectedServices, selected, step }: SelectedServicesBasketProps) {
    const { i18n, t } = useTranslation()
    const currentLang = (i18n.language || 'fr') as 'fr' | 'en' | 'ar'
    const dispatch = useDispatch<AppDispatch>()

    const totalPrice = selectedServices.reduce((sum, s: any) => {
        const count = s.quantity || 1
        return sum + (s.price || 0) * count
    }, 0)
    const totalDuration = selectedServices.reduce((sum, s: any) => {
        const count = s.quantity || 1
        return sum + (s.duration_minutes || s.duration || 0) * count
    }, 0)

    if (selected.length === 0) return null

    return (
        <div className="w-full md:w-80 block md:sticky top-4 h-fit">
            <Card className="border-2 border-[#E09900]/30 shadow-xl bg-white/95 backdrop-blur">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-[#E09900]" />
                        {t('bookingWizard.selectServices.selectedServices', 'Selected Services')} ({selected.length})
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                        {t('bookingWizard.selectServices.quantityNote', 'Note: The quantity indicates the number of persons for each service (max 4). Services will be scheduled sequentially in the order selected to avoid time conflicts.')}
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        {selectedServices.map((svc: any) => (
                            <div key={svc.id} className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg p-3 border">
                                <div className="flex-1">
                                    <span className="text-sm font-medium">{getLocalizedValue(svc.name, currentLang)}</span>
                                    <div className="flex flex-col gap-2 mt-1">
                                        <div className='flex flex-row items-center gap-4'>
                                            <Clock className="h-3 w-3 text-green-600" />
                                            <span className="text-xs text-green-600">{(svc.duration_minutes || svc.duration || 0) * (svc.quantity || 1)} min</span>
                                        </div>
                                        <div className='flex flex-row items-center gap-4'>
                                            <DollarSign className="h-3 w-3 text-[#E09900]" />
                                            <span className="text-xs font-semibold text-[#E09900]">{(svc.price || 0) * (svc.quantity || 1)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Person Count Controls */}
                                <div className="flex items-center gap-1">
                                    {step < 2 && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-6 w-6 p-0"
                                        disabled={(svc.quantity || 1) <= 1}
                                        onClick={() => {
                                            const currentCount = svc.quantity || 1
                                            if (currentCount > 1) {
                                                dispatch(setServicePersonCount({ serviceId: svc.id, count: currentCount - 1 }))
                                            }
                                        }}
                                    >
                                        <Minus className="h-3 w-3" />
                                    </Button>
                                    )}
                                    {step >= 2 && (
                                     <IconUsersGroup size={16} className="text-muted-foreground" />   
                                    )}
                                    <span className="text-sm font-medium min-w-[20px] text-center">
                                        {svc.quantity || 1}
                                    </span>
                                    {step < 2 && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-6 w-6 p-0"
                                        disabled={(svc.quantity || 1) >= 4}
                                        onClick={() => {
                                            const currentCount = svc.quantity || 1
                                            if (currentCount < 4) {
                                                dispatch(setServicePersonCount({ serviceId: svc.id, count: currentCount + 1 }))
                                            }
                                        }}
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                    )}
                                </div>


                                <button
                                    onClick={() => dispatch(toggleService({ serviceId: svc.id, service: svc }))}
                                    className="rounded-full hover:bg-red-100 p-1"
                                >
                                     <IconTrash size={16} className="text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Total Summary */}
                    <div className="border-t pt-3">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-green-600" />
                                <span className="font-medium">{totalDuration} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4 text-[#E09900]" />
                                <span className="font-semibold text-[#E09900]">{totalPrice}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}