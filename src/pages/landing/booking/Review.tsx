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
    const { i18n } = useTranslation()
    const currentLang = (i18n.language || 'fr') as 'fr' | 'en' | 'ar'
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
                    {/* Services */}
                    <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="h-5 w-5 text-amber-600" />
                            <h3 className="font-semibold">{t('bookingWizard.review.servicesTitle')}</h3>
                        </div>
                        <div className="space-y-2">
                            {selectedServices.map((service: any) => (
                                <div key={service.id} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{getLocalizedValue(service.name, currentLang)}</p>
                                        {selectedStaff[service.id] && (
                                            <p className="text-sm text-muted-foreground">
                                                {t('bookingWizard.review.with')} {selectedStaff[service.id].name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{service.price} $</p>
                                        <p className="text-sm text-muted-foreground">{service.duration_minutes} min</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {selectedGender && (
                            <div className="mt-3 pt-3 border-t">
                                <p className="text-sm text-muted-foreground">
                                    {t('bookingWizard.review.gender')} <span className="font-medium text-foreground">{selectedGender === 'femme' ? t('bookingWizard.selectOptions.genderFemale') : selectedGender === 'homme' ? t('bookingWizard.selectOptions.genderMale') : t('bookingWizard.selectOptions.genderMixed')}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Date & Time */}
                    {selectedDate && selectedScenario && (
                        <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar className="h-5 w-5 text-amber-600" />
                                <h3 className="font-semibold">{t('bookingWizard.review.dateTimeTitle')}</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <p>{format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <p>
                                        {format(new Date(selectedScenario.start_datetime), 'HH:mm')} - {' '}
                                        {format(new Date(selectedScenario.end_datetime), 'HH:mm')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <p>{personCount} {personCount > 1 ? t('bookingWizard.review.persons') : t('bookingWizard.review.person')}</p>
                                </div>
                            </div>
                        </div>
                    )}

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
                    <div className="rounded-lg border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-rose-50 p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">{t('bookingWizard.review.total')}</span>
                            <span className="text-2xl font-bold text-amber-600">{totalPrice} $</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {t('bookingWizard.review.guaranteePaid', { amount: 50 })}
                        </p>
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
