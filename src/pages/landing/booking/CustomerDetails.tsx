import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'
import type { CustomerInfo } from './types'
import MagicForm, {  MagicFormGroupProps } from '@/components/custom/MagicForm'

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

    const fields : MagicFormGroupProps[] = [
        {
            group: '',
            
            fields: [
                {
                    name: 'name',
                    label: t('bookingWizard.customerDetails.fullName'),
                    placeholder: t('bookingWizard.customerDetails.namePlaceholder'),
                    type: 'text',
                    required: true,
                },
                {
                    name: 'email',
                    label: t('bookingWizard.customerDetails.email'),
                    placeholder: t('bookingWizard.customerDetails.emailPlaceholder'),
                    type: 'text',
                    required: true,
                },
                {
                    name: 'phone',
                    label: t('bookingWizard.customerDetails.phone'),
                    placeholder: t('bookingWizard.customerDetails.phonePlaceholder'),
                    type: 'text',
                    required: true,
                },
                {
                    name: 'notes',
                    label: t('bookingWizard.customerDetails.notes'),
                    placeholder: t('bookingWizard.customerDetails.notesPlaceholder'),
                    type: 'textarea',
                    required: false,
                }
            ]
        }
    ]

    const handleSubmit = (data: any) => {
        // MagicForm returns an object matching field names
        if (data.name !== undefined) onUpdateCustomer('name', data.name)
        if (data.email !== undefined) onUpdateCustomer('email', data.email)
        if (data.phone !== undefined) onUpdateCustomer('phone', data.phone)
        if (data.notes !== undefined) onUpdateCustomer('notes', data.notes || '')

        // proceed to next step
        onNext()
    }

    return (
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-2xl">{t('bookingWizard.customerDetails.title')}</CardTitle>
                <p className="text-sm text-muted-foreground">{t('bookingWizard.customerDetails.subtitle')}</p>
            </CardHeader>
            <CardContent>
                <MagicForm
                    fields={fields}
                    title=''
                    onSubmit={handleSubmit}
                    initialValues={customerInfo}
                    button={t('bookingWizard.customerDetails.continue')}
                />

                <div className="mt-3 flex justify-start">
                    <Button variant="outline" onClick={onPrev} size="lg">{t('bookingWizard.customerDetails.back')}</Button>
                </div>
            </CardContent>
        </Card>
    )
}
