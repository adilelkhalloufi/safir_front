import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, Calendar, Clock, Users, Sparkles, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import type { Service } from '@/interfaces/models/service'
import type { AvailabilityScenario } from '@/interfaces/models/booking'
import { getLocalizedValue } from '@/interfaces/models/booking'
import type { CustomerInfo } from './types'

interface ReviewProps {
    selectedServices: Service[]
    personCount: number
    selectedDate: Date | string | undefined
    customerInfo: CustomerInfo
    anyPreferences: Record<number, 'female' | 'male' | 'mixed'>
    selectedTimeSlots: Record<number, AvailabilityScenario>
    isSubmitting: boolean
    onConfirm: (bookingSummary: any) => void
    onPrev: () => void
}

export function Review({
    selectedServices,
    personCount,
    selectedDate,
    customerInfo,
    anyPreferences,
    selectedTimeSlots,
    isSubmitting,
    onConfirm,
    onPrev
}: ReviewProps) {
    const { i18n, t } = useTranslation()
    const currentLang = (i18n.language || 'fr') as 'fr' | 'en'
    const totalPrice = Object.values(selectedTimeSlots).reduce((sum, scenario) => {
        const price = typeof scenario.total_price === 'string' ? parseFloat(scenario.total_price) : scenario.total_price || 0;
        return sum + price;
    }, 0);

    // Format date to YYYY-MM-DD for backend
    const formattedDate = selectedDate
        ? format(typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate, 'yyyy-MM-dd')
        : ''

    // Prepare booking summary object matching backend validation structure
    const bookingSummary = {
        services: selectedServices.map(service => {
            const scenario = selectedTimeSlots[service.id];
            const serviceDetails = scenario?.services?.find((s: any) => s.service_id === service.id)
            return {
                id: service.id,
                name: getLocalizedValue(service.name, currentLang),
                price: typeof service.price === 'string' ? parseFloat(service.price) : service.price,
                duration: service.duration_minutes || service.duration || 60,
                start_datetime: serviceDetails?.start_datetime || '',
                end_datetime: serviceDetails?.end_datetime || '',
                assigned_staff: (serviceDetails?.assigned_staff || []).map((staff: any) => ({
                    staff_id: staff.staff_id,
                    staff_name: staff.staff_name
                })),
                staff_count: serviceDetails?.staff_count || 0
            }
        }),
        date: formattedDate,
        personCount: personCount,
        customer: {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
            notes: customerInfo.notes || ''
        },
        totalPrice: totalPrice,
        totalStaffAssigned: selectedServices.reduce((total, service) => {
            const scenario = selectedTimeSlots[service.id];
            const serviceDetails = scenario?.services?.find((s: any) => s.service_id === service.id)
            return total + (serviceDetails?.staff_count || 0)
        }, 0),
        anyPreferences: anyPreferences,
        language: currentLang
    }


    return (
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    {t('bookingWizard.review.title')}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{t('bookingWizard.review.subtitle')}</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Booking Summary Card */}
                    <div className="rounded-lg border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="h-5 w-5 text-amber-600" />
                            <h3 className="font-semibold text-amber-900">{t('bookingWizard.review.bookingSummary')}</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-amber-600" />
                                <span className="font-medium">{t('bookingWizard.review.date')}:</span>
                                <span className="text-muted-foreground">
                                    {selectedDate && format(
                                        typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate,
                                        'EEEE d MMMM yyyy',
                                        { locale: fr }
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-amber-600" />
                                <span className="font-medium">{t('bookingWizard.review.guests')}:</span>
                                <span className="text-muted-foreground">
                                    {personCount} {personCount > 1 ? t('bookingWizard.review.persons') : t('bookingWizard.review.person')}
                                </span>
                            </div>
                            {selectedScenario?.start_datetime && (
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-amber-600" />
                                    <span className="font-medium">{t('bookingWizard.review.bookingTime')}:</span>
                                    <span className="text-muted-foreground">
                                        {format(new Date(selectedScenario.start_datetime.replace(' ', 'T')), 'HH:mm')}
                                        {selectedScenario.end_datetime && ` - ${format(new Date(selectedScenario.end_datetime.replace(' ', 'T')), 'HH:mm')}`}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Services with Individual Date/Time */}
                    <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-5 w-5 text-amber-600" />
                            <h3 className="font-semibold">{t('bookingWizard.review.servicesTitle')}</h3>
                        </div>
                        <div className="space-y-4">
                            {selectedServices.map((service: any) => {
                                const selectedServiceDetails = selectedScenario?.services?.find((s: any) => s.service_id === service.id)

                                // Display the date and time from the selected slot
                                let displayDate = null
                                let displayStartTime = null
                                let displayEndTime = null

                                if (selectedServiceDetails?.start_datetime) {
                                    // Parse datetime string (format: "2026-01-09 19:00:00" or ISO string)
                                    const startDateStr = selectedServiceDetails.start_datetime.replace(' ', 'T')
                                    const startDate = new Date(startDateStr)

                                    if (!isNaN(startDate.getTime())) {
                                        displayDate = startDate
                                        displayStartTime = format(startDate, 'HH:mm')

                                        // Parse end datetime if available
                                        if (selectedServiceDetails.end_datetime) {
                                            const endDateStr = selectedServiceDetails.end_datetime.replace(' ', 'T')
                                            const endDate = new Date(endDateStr)
                                            if (!isNaN(endDate.getTime())) {
                                                displayEndTime = format(endDate, 'HH:mm')
                                            }
                                        }
                                    }
                                } else if (selectedDate) {
                                    // Fallback to selectedDate
                                    displayDate = typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate
                                }

                                // Get assigned staff members
                                const assignedStaff = selectedServiceDetails?.assigned_staff || []

                                return (
                                    <div key={service.id} className="pb-4 border-b last:border-b-0 last:pb-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <p className="font-medium text-lg">{getLocalizedValue(service.name, currentLang)}</p>
                                                {/* Display all assigned staff */}
                                                {assignedStaff.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {assignedStaff.map((staff: any) => (
                                                            <div key={staff.staff_id} className="flex items-center gap-1.5 px-2 py-1 bg-amber-100 rounded-md">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-amber-700" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                                </svg>
                                                                <span className="text-sm font-medium text-amber-900">
                                                                    {staff.staff_name}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className="font-semibold">{service.price} $</p>
                                                <p className="text-sm text-muted-foreground">{service.duration_minutes} min</p>
                                                {genderSelections[service.id] && (
                                                    <p className="text-xs text-amber-600 mt-1">
                                                        {genderSelections[service.id] === 'female' ? t('bookingWizard.selectOptions.genderFemale') :
                                                            genderSelections[service.id] === 'male' ? t('bookingWizard.selectOptions.genderMale') :
                                                                t('bookingWizard.selectOptions.genderMixed')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {displayDate && (
                                            <div className="mt-2 space-y-1 text-sm bg-amber-50 p-2 rounded">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3.5 w-3.5 text-amber-600" />
                                                    <p className="text-muted-foreground">
                                                        {format(displayDate, 'EEEE d MMMM yyyy', { locale: fr })}
                                                    </p>
                                                </div>
                                                {displayStartTime && displayEndTime && (
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-3.5 w-3.5 text-amber-600" />
                                                        <p className="font-medium text-foreground">
                                                            {displayStartTime} - {displayEndTime}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        <div className="mt-4 pt-4 border-t flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                {personCount} {personCount > 1 ? t('bookingWizard.review.persons') : t('bookingWizard.review.person')}
                            </p>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
                        <h3 className="font-semibold mb-3">{t('bookingWizard.review.customerInfoTitle')}</h3>
                        <div className="space-y-1 text-sm">
                            <p><strong>{t('bookingWizard.review.name')}</strong> {customerInfo.name}</p>
                            <p><strong>{t('bookingWizard.review.email')}</strong> {customerInfo.email}</p>
                            <p><strong>{t('bookingWizard.review.phone')}</strong> {customerInfo.phone}</p>
                            {customerInfo.notes && (
                                <p className="mt-2"><strong>{t('bookingWizard.review.notes')}</strong> {customerInfo.notes}</p>
                            )}
                        </div>
                    </div>

                    {/* Total Price Section */}
                    <div className="rounded-lg border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-rose-50 p-4">
                        <div className="space-y-2">
                            {/* Service breakdown */}
                            {selectedServices.map((service: any) => (
                                <div key={service.id} className="flex justify-between text-sm">
                                    <span className="text-gray-700">
                                        {getLocalizedValue(service.name, currentLang)} × {personCount}
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {(typeof service.price === 'string' ? parseFloat(service.price) : service.price) * personCount} $
                                    </span>
                                </div>
                            ))}

                            {/* Total */}
                            <div className="pt-2 border-t border-amber-300">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">{t('bookingWizard.review.total')}</span>
                                    <span className="text-2xl font-bold text-amber-600">{totalPrice} $</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Alert>
                        <AlertDescription className="text-sm">
                            {t('bookingWizard.review.termsAccept')}
                        </AlertDescription>
                    </Alert>
                </div>

                <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={onPrev} size="lg" disabled={isSubmitting}>
                        {t('bookingWizard.review.back')}
                    </Button>
                    <Button
                        onClick={() => onConfirm(bookingSummary)}
                        disabled={isSubmitting}
                        size="lg"
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('bookingWizard.review.confirming')}
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                {t('bookingWizard.review.confirm')}
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
