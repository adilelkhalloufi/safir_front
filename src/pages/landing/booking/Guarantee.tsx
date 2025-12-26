import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CreditCard, Shield, AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface GuaranteeProps {
    totalPrice: any
    onNext: () => void
    onPrev: () => void
}

export function Guarantee({ totalPrice, onNext, onPrev }: GuaranteeProps) {
    const [isPaymentReady, setIsPaymentReady] = useState(false)
    const guaranteeAmount = 50 // 50 MAD guarantee

    // Square Payment SDK placeholder
    const handlePayment = () => {
        // TODO: Integrate Square Web Payments SDK
        // For now, simulate payment ready state
        setIsPaymentReady(true)
        setTimeout(() => {
            onNext()
        }, 1000)
    }

    return (
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-amber-600" />
                    Garantie de réservation
                </CardTitle>
                <p className="text-sm text-muted-foreground">Paiement sécurisé pour confirmer votre réservation</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-4">
                        <div className="flex items-start gap-3">
                            <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-amber-900">Garantie requise</h3>
                                <p className="text-sm text-amber-700 mt-1">
                                    Une garantie de <strong>{guaranteeAmount} $</strong> est requise pour confirmer votre réservation.
                                    Le montant total de <strong>{totalPrice} $</strong> sera à régler sur place.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Politique d'annulation :</strong>
                            <ul className="mt-2 space-y-1 text-sm">
                                <li>• Annulation gratuite jusqu'à 24h avant le rendez-vous</li>
                                <li>• La garantie sera remboursée en cas d'annulation dans les délais</li>
                                <li>• Annulation tardive : la garantie sera retenue</li>
                            </ul>
                        </AlertDescription>
                    </Alert>

                    <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-6">
                        <h4 className="font-semibold mb-4">Paiement sécurisé</h4>
                        {/* Square Payment SDK will be mounted here */}
                        <div id="card-container" className="mb-4">
                            {/* Placeholder for Square payment form */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-muted-foreground">
                                    Square Web Payments SDK
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Intégration en cours
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={handlePayment}
                            disabled={isPaymentReady}
                            className="w-full bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700"
                            size="lg"
                        >
                            {isPaymentReady ? 'Traitement...' : `Payer ${guaranteeAmount} $`}
                        </Button>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        <span>Paiement sécurisé par Square</span>
                    </div>
                </div>

                <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={onPrev} size="lg">Retour</Button>
                </div>
            </CardContent>
        </Card>
    )
}
