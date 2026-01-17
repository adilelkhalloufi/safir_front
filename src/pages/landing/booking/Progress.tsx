import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Step } from './types'

interface ProgressProps {
    step: Step
}

export function Progress({ step }: ProgressProps) {
    const { t } = useTranslation()
    const labels = [
        t('bookingWizard.progress.services'),
        t('bookingWizard.progress.options'),
        t('bookingWizard.progress.dateTime'),
        t('bookingWizard.progress.contact'),
        // t('bookingWizard.progress.payment'),
        t('bookingWizard.progress.summary')
    ]

    return (
        <div className="mb-8 overflow-x-auto">
            <div className="flex items-center justify-between min-w-max px-4">
                {labels.map((l, i) => (
                    <div key={l} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div
                                className={cn(
                                    'h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300',
                                    i < step && 'bg-green-500 text-white',
                                    i === step && ' bg-secondary text-white shadow-lg scale-110',
                                    i > step && 'bg-gray-200 text-gray-400'
                                )}
                            >
                                {i < step ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                            </div>
                            <span className={cn('text-xs mt-2 text-center whitespace-nowrap', i === step && 'font-semibold text-primary')}>
                                {l}
                            </span>
                        </div>
                        {i < labels.length - 1 && (
                            <div className={cn('h-0.5 w-12 mx-2', i < step ? 'bg-green-500' : 'bg-gray-200')} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
