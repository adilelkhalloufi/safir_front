import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ChevronRight, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setServiceSlot } from '@/store/slices/bookingSlice'
import type { AppDispatch } from '@/store'
import type { Service } from '@/interfaces/models/service'
import type { Staff } from '@/interfaces/models/booking'
import { getLocalizedValue } from '@/interfaces/models/booking'

interface Slot {
    id: number;
    slot_time: string;
    is_active: boolean;
    default_capacity: number;
    gender: 'mixed' | 'female' | 'male';
    capacity_total: number;
    capacity_staff: number;
    capacity_self: number;
    max_scrubbers: number;
    days_of_week: number[];
    created_at: string;
    updated_at: string;
}

interface SelectOptionsProps {
    selectedServices: Service[]
    staff: Staff[]
    staffSelections: any
    onSelectStaff: (selections: Record<number, number>) => void
    anyPreferences: Record<number, 'female' | 'male' | 'mixed'> // serviceId -> preference
    onSelectGender: (serviceId: number, preference: 'female' | 'male' | 'mixed') => void
    onNext: () => void
    onPrev: () => void
}

 

export function SelectOptions({
    selectedServices,
    staff,
    staffSelections,
    onSelectStaff,
    anyPreferences,
    onSelectGender,
    onNext,
    onPrev
}: SelectOptionsProps) {
    const { i18n, t } = useTranslation()
    const currentLang = (i18n.language || 'fr') as 'fr' | 'en' | 'ar'
    const dispatch = useDispatch<AppDispatch>()

    // Clear all selected slots when returning to this step
    useEffect(() => {
        selectedServices.forEach((service) => {
            dispatch(setServiceSlot({ serviceId: service.id, slot: null }))
        })
    }, []) // Empty dependency array = run only on mount

    const dayNames = [
        t('bookingWizard.days.sunday'),
        t('bookingWizard.days.monday'),
        t('bookingWizard.days.tuesday'),
        t('bookingWizard.days.wednesday'),
        t('bookingWizard.days.thursday'),
        t('bookingWizard.days.friday'),
        t('bookingWizard.days.saturday')
    ]

    // Group available days by gender from slots
    const getAvailableDaysByGender = (slots: Slot[]) => {
        const daysByGender: Record<string, Set<number>> = {
            mixed: new Set(),
            female: new Set(),
            male: new Set()
        }

        slots?.forEach(slot => {
            if (slot.is_active) {
                slot.days_of_week.forEach(day => {
                    daysByGender[slot.gender].add(day)
                })
            }
        })

        return daysByGender
    }

    const handleStaffSelect = (serviceId: number, staffId: number) => {
        onSelectStaff({ ...staffSelections, [serviceId]: staffId })
    }

    return (
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-2xl">{t('bookingWizard.selectOptions.title')}</CardTitle>
                <p className="text-sm text-muted-foreground">{t('bookingWizard.selectOptions.subtitle')}</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">

                    {selectedServices.map((service: any) => {
                        const Icon = Sparkles
                        const serviceStaff = staff.filter(s => s.type_staff === service.type_service)
                        const serviceSlots = service.slots || []
                        const availableDaysByGender = getAvailableDaysByGender(serviceSlots)

                        return (
                            <div key={service.id} className="rounded-xl border-2 border-gray-200 bg-white p-5">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#020F44] to-[#E09900]">
                                        <Icon className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg">{getLocalizedValue(service.name, currentLang)}</div>
                                        <div className="text-sm text-muted-foreground">{service.duration_minutes} min • {service.price} $</div>
                                    </div>
                                </div>

                                {/* Gender Selection for services with sessions */}
                                {service.has_sessions && (
                                    <div className="mb-4 rounded-lg border-2 border-[#E09900]/30 bg-orange-50/50 p-3">
                                        <div className="mb-2 text-sm font-medium text-[#020F44]">{t('bookingWizard.selectOptions.genderTitle')}</div>
                                        <div className="flex gap-2">
                                            {[
                                                { id: 'female', label: t('bookingWizard.selectOptions.genderFemale') },
                                                { id: 'male', label: t('bookingWizard.selectOptions.genderMale') },
                                                { id: 'mixed', label: t('bookingWizard.selectOptions.genderMixed') }
                                            ].map((g : any) => (
                                                <button
                                                    key={g.id}
                                                    onClick={() => onSelectGender(service.id, g.id)}
                                                    className={cn(
                                                        'flex-1 rounded-lg border-2 px-3 py-2 text-xs font-medium transition-all',
                                                        (anyPreferences[service.id] || 'mixed') === g.id
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

                                {/* Available Days Schedule for services with sessions */}
                                {service.has_sessions && serviceSlots.length > 0 && (
                                    <div className="mb-4 rounded-lg border-2 border-blue-200/50 bg-blue-50/30 p-4">
                                        <div className="mb-3 text-sm font-semibold text-[#020F44]">{t('bookingWizard.selectOptions.scheduleInfo')}</div>
                                        <div className="space-y-2">
                                            {[
                                                { id: 'mixed', label: t('bookingWizard.selectOptions.genderMixed'), color: 'text-purple-700' },
                                                { id: 'female', label: t('bookingWizard.selectOptions.genderFemale'), color: 'text-pink-700' },
                                                { id: 'male', label: t('bookingWizard.selectOptions.genderMale'), color: 'text-blue-700' }
                                            ].map((g: any) => {
                                                const days = Array.from(availableDaysByGender[g.id]).sort((a, b) => a - b)
                                                if (days.length === 0) return null
                                                return (
                                                    <div key={g.id} className="flex items-start gap-2 text-xs">
                                                        <span className={cn('font-semibold min-w-[60px]', g.color)}>{g.label}:</span>
                                                        <span className="text-gray-700">
                                                            {days.map(d => dayNames[d]).join(', ')}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {serviceStaff.length > 0 && (
                                    <div>
                                        <div className="mb-2 text-sm font-medium text-gray-700">{t('bookingWizard.selectOptions.practitioner')}</div>
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
                                                {t('bookingWizard.selectOptions.noPreference')}
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
                    <Button variant="outline" onClick={onPrev} size="lg">{t('bookingWizard.selectOptions.back')}</Button>
                    <Button onClick={onNext} size="lg" className="bg-gradient-to-r from-[#020F44] to-[#E09900] hover:from-[#020F44]/90 hover:to-[#E09900]/90">
                        {t('bookingWizard.selectOptions.continue')} <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
