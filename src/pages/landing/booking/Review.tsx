import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, Calendar, Clock, Users, Sparkles, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import type { Service, Staff, AvailabilityScenario } from '@/interfaces/models/booking'
import { getLocalizedValue } from '@/interfaces/models/booking'
import type { CustomerInfo } from './types'

interface ReviewProps {
    selectedServices: Service[]
    selectedStaff: { [key: number]: Staff }
    personCount: number
    selectedScenario: AvailabilityScenario | any
    selectedDate: Date | undefined
    customerInfo: CustomerInfo
    selectedGender?: 'femme' | 'homme' | 'mixte'
    isSubmitting: boolean
    onConfirm: () => void
    onPrev: () => void
}

export function Review({
    selectedServices,
    selectedStaff,
    personCount,
    selectedScenario,
    selectedDate,
    customerInfo,
    selectedGender,
    isSubmitting,
    onConfirm,
    onPrev
}: ReviewProps) {
    const { i18n, t } = useTranslation()
    const currentLang = (i18n.language || 'fr') as 'fr' | 'en' 
    const totalPrice = selectedScenario?.total_price || 0
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
                    {/* Services with Individual Date/Time */}
                    <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-5 w-5 text-amber-600" />
                            <h3 className="font-semibold">{t('bookingWizard.review.servicesTitle')}</h3>
                        </div>
                        <div className="space-y-4">
                            {selectedServices.map((service: any) => {
                                const selectedServiceDetails = selectedScenario?.services?.find((s: any) => s.service_id === service.id)
                                
                                // Debug logs
                                console.log('Service:', service.id, getLocalizedValue(service.name, currentLang))
                                console.log('selectedServiceDetails:', selectedServiceDetails)
                                console.log('selectedScenario:', selectedScenario)
                                
                                // Display the date and time from the selected slot
                                let displayDate = null
                                let displayStartTime = null
                                let displayEndTime = null
                                
                                if (selectedServiceDetails?.start_datetime && selectedServiceDetails?.end_datetime) {
                                    console.log('Has datetime:', selectedServiceDetails.start_datetime, selectedServiceDetails.end_datetime)
                                    const startDate = new Date(selectedServiceDetails.start_datetime)
                                    const endDate = new Date(selectedServiceDetails.end_datetime)
                                    
                                    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                                        displayDate = startDate
                                        displayStartTime = format(startDate, 'HH:mm')
                                        displayEndTime = format(endDate, 'HH:mm')
                                        console.log('Formatted time:', displayStartTime, displayEndTime)
                                    }
                                } else {
                                    console.log('No datetime found, using selectedDate:', selectedDate)
                                    if (selectedDate) {
                                        displayDate = new Date(selectedDate)
                                    }
                                }
                                
                                return (
                                    <div key={service.id} className="pb-4 border-b last:border-b-0 last:pb-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-medium text-lg">{getLocalizedValue(service.name, currentLang)}</p>
                                                {selectedServiceDetails?.staff_name && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {t('bookingWizard.review.with')} {selectedServiceDetails.staff_name}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">{service.price} $</p>
                                                <p className="text-sm text-muted-foreground">{service.duration_minutes} min</p>
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
                            {selectedGender && (
                                <>
                                    <span className="text-muted-foreground">•</span>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedGender === 'femme' ? t('bookingWizard.selectOptions.genderFemale') : selectedGender === 'homme' ? t('bookingWizard.selectOptions.genderMale') : t('bookingWizard.selectOptions.genderMixed')}
                                    </p>
                                </>
                            )}
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

                    {/* Total */}
                    {/* <div className="rounded-lg border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-rose-50 p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">{t('bookingWizard.review.total')}</span>
                            <span className="text-2xl font-bold text-amber-600">{totalPrice} $</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {t('bookingWizard.review.guaranteePaid', { amount: 50 })}
                        </p>
                    </div> */}

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
                        onClick={onConfirm}
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
