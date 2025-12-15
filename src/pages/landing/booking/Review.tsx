import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, Calendar, Clock, Users, Sparkles, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Service, Staff, AvailabilityScenario } from '@/interfaces/models/booking'
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

const GENDER_LABELS = {
    femme: 'Femmes',
    homme: 'Hommes',
    mixte: 'Mixte'
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
    const totalPrice = selectedScenario?.total_price || 0

    return (
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    Récapitulatif de votre réservation
                </CardTitle>
                <p className="text-sm text-muted-foreground">Vérifiez les détails avant de confirmer</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Services */}
                    <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="h-5 w-5 text-amber-600" />
                            <h3 className="font-semibold">Services sélectionnés</h3>
                        </div>
                        <div className="space-y-2">
                            {selectedServices.map((service: any) => (
                                <div key={service.id} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{service.name}</p>
                                        {selectedStaff[service.id] && (
                                            <p className="text-sm text-muted-foreground">
                                                Avec {selectedStaff[service.id].name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{service.price} MAD</p>
                                        <p className="text-sm text-muted-foreground">{service.duration_minutes} min</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {selectedGender && (
                            <div className="mt-3 pt-3 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Genre: <span className="font-medium text-foreground">{GENDER_LABELS[selectedGender]}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Date & Time */}
                    {selectedDate && selectedScenario && (
                        <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar className="h-5 w-5 text-amber-600" />
                                <h3 className="font-semibold">Date et horaire</h3>
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
                                    <p>{personCount} {personCount > 1 ? 'personnes' : 'personne'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Customer Info */}
                    <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
                        <h3 className="font-semibold mb-3">Vos informations</h3>
                        <div className="space-y-1 text-sm">
                            <p><strong>Nom:</strong> {customerInfo.name}</p>
                            <p><strong>Email:</strong> {customerInfo.email}</p>
                            <p><strong>Téléphone:</strong> {customerInfo.phone}</p>
                            {customerInfo.notes && (
                                <p className="mt-2"><strong>Notes:</strong> {customerInfo.notes}</p>
                            )}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="rounded-lg border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-rose-50 p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Total</span>
                            <span className="text-2xl font-bold text-amber-600">{totalPrice} MAD</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            50 MAD de garantie payés • Solde à régler sur place
                        </p>
                    </div>

                    <Alert>
                        <AlertDescription className="text-sm">
                            En confirmant cette réservation, vous acceptez nos conditions générales et notre politique d'annulation.
                        </AlertDescription>
                    </Alert>
                </div>

                <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={onPrev} size="lg" disabled={isSubmitting}>
                        Retour
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
                                Confirmation...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Confirmer la réservation
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
