import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Service {
    id: number;
    name: string;
}

interface ServiceSelectionStepProps {
    services: Service[];
    selectedServiceId: number | null;
    onSelectService: (serviceId: number) => void;
    onContinue: () => void;
}

export function ServiceSelectionStep({
    services,
    selectedServiceId,
    onSelectService,
    onContinue,
}: ServiceSelectionStepProps) {
    const { t } = useTranslation();

    return (
        <Card className='border-0 shadow-xl'>
            <CardHeader>
                <CardTitle>{t('subscriptionCheckout.chooseService', 'Choose a service')}</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-wrap gap-3'>
                {services.map((service) => (
                    <Button
                        key={service.id}
                        variant={selectedServiceId === service.id ? 'default' : 'outline'}
                        onClick={() => onSelectService(service.id)}
                    >
                        {service.name}
                    </Button>
                ))}
            </CardContent>
            <CardContent className='flex justify-end'>
                <Button disabled={!selectedServiceId} onClick={onContinue}>
                    {t('subscriptionCheckout.continue', 'Continue')}<ArrowRight className='ml-2 h-4 w-4' />
                </Button>
            </CardContent>
        </Card>
    );
}
