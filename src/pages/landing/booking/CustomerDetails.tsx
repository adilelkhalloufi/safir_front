import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronRight } from 'lucide-react'
import type { CustomerInfo } from './types'

interface CustomerDetailsProps {
    customerInfo: CustomerInfo
    onUpdateCustomer: (field: keyof CustomerInfo, value: string) => void
    onNext: () => void
    onPrev: () => void
}

export function CustomerDetails({
    customerInfo,
    onUpdateCustomer,
    onNext,
    onPrev
}: CustomerDetailsProps) {
    const isValid = customerInfo.name && customerInfo.email && customerInfo.phone

    return (
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-2xl">Vos coordonnées</CardTitle>
                <p className="text-sm text-muted-foreground">Renseignez vos informations pour confirmer la réservation</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                            id="name"
                            placeholder="Votre nom et prénom"
                            value={customerInfo.name}
                            onChange={(e) => onUpdateCustomer('name', e.target.value)}
                            className="border-2 focus:border-amber-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="votre.email@exemple.com"
                            value={customerInfo.email}
                            onChange={(e) => onUpdateCustomer('email', e.target.value)}
                            className="border-2 focus:border-amber-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone *</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+212 6XX XXX XXX"
                            value={customerInfo.phone}
                            onChange={(e) => onUpdateCustomer('phone', e.target.value)}
                            className="border-2 focus:border-amber-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (optionnel)</Label>
                        <Input
                            id="notes"
                            placeholder="Informations supplémentaires..."
                            value={customerInfo.notes}
                            onChange={(e) => onUpdateCustomer('notes', e.target.value)}
                            className="border-2 focus:border-amber-500"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={onPrev} size="lg">Retour</Button>
                    <Button
                        disabled={!isValid}
                        onClick={onNext}
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
