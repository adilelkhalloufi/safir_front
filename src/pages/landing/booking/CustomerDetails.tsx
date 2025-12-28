import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
    const { t } = useTranslation()
    const isValid = customerInfo.name && customerInfo.email && customerInfo.phone

    return (
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-2xl">{t('bookingWizard.customerDetails.title')}</CardTitle>
                <p className="text-sm text-muted-foreground">{t('bookingWizard.customerDetails.subtitle')}</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t('bookingWizard.customerDetails.fullName')}</Label>
                        <Input
                            id="name"
                            placeholder={t('bookingWizard.customerDetails.namePlaceholder')}
                            value={customerInfo.name}
                            onChange={(e) => onUpdateCustomer('name', e.target.value)}
                            className="border-2 focus:border-amber-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">{t('bookingWizard.customerDetails.email')}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder={t('bookingWizard.customerDetails.emailPlaceholder')}
                            value={customerInfo.email}
                            onChange={(e) => onUpdateCustomer('email', e.target.value)}
                            className="border-2 focus:border-amber-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">{t('bookingWizard.customerDetails.phone')}</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder={t('bookingWizard.customerDetails.phonePlaceholder')}
                            value={customerInfo.phone}
                            onChange={(e) => onUpdateCustomer('phone', e.target.value)}
                            className="border-2 focus:border-amber-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">{t('bookingWizard.customerDetails.notes')}</Label>
                        <Input
                            id="notes"
                            placeholder={t('bookingWizard.customerDetails.notesPlaceholder')}
                            value={customerInfo.notes}
                            onChange={(e) => onUpdateCustomer('notes', e.target.value)}
                            className="border-2 focus:border-amber-500"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={onPrev} size="lg">{t('bookingWizard.customerDetails.back')}</Button>
                    <Button
                        disabled={!isValid}
                        onClick={onNext}
                        size="lg"
                        className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700"
                    >
                        {t('bookingWizard.customerDetails.continue')} <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
