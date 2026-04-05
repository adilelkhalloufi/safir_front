import { Check } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Step {
    label: string;
    icon: LucideIcon;
}

interface CheckoutStepperProps {
    steps: Step[];
    currentStep: number;
}

export function CheckoutStepper({ steps, currentStep }: CheckoutStepperProps) {
    return (
        <div className='flex items-center justify-center gap-0'>
            {steps.map((s, i) => {
                const StepIcon = s.icon;
                const isActive = currentStep === i;
                const isDone = currentStep > i;
                return (
                    <div key={i} className='flex items-center'>
                        <div className='flex flex-col items-center gap-1.5'>
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${isDone
                                    ? 'border-primary bg-primary text-white'
                                    : isActive
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-muted-foreground/30 bg-muted/50 text-muted-foreground'
                                }`}>
                                {isDone ? <Check className='h-5 w-5' /> : <StepIcon className='h-4 w-4' />}
                            </div>
                            <span className={`text-xs font-medium whitespace-nowrap ${isActive || isDone ? 'text-primary' : 'text-muted-foreground'}`}>
                                {s.label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className={`mx-3 mt-[-18px] h-0.5 w-12 md:w-20 transition-colors duration-300 ${currentStep > i ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
