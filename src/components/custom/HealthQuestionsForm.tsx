import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import MagicForm, { MagicFormGroupProps } from '@/components/custom/MagicForm';
import { HealthQuestion } from '@/interfaces/models/service';
import { convertFormDataToHealthAnswers, validateHealthAnswers } from '@/utils/healthQuestions';

interface HealthQuestionsFormProps {
    healthQuestions: HealthQuestion[];
    initialAnswers?: Record<string, any>;
    onSubmit: (answers: Record<string, any>) => void;
    loading?: boolean;
    title?: string;
    buttonText?: string;
}

/**
 * Component that renders health questions using MagicForm
 * Handles bilingual questions (French/English) and validation
 */
const HealthQuestionsForm: React.FC<HealthQuestionsFormProps> = ({
    healthQuestions,
    initialAnswers = {},
    onSubmit,
    loading = false,
    title,
    buttonText,
}) => {
    const { t, i18n } = useTranslation();

    // Convert health questions to MagicForm format with current language
    const formGroups: MagicFormGroupProps[] = useMemo(() => {
        const currentLang = i18n.language as 'en' | 'fr';

        return healthQuestions.map(question => ({
            group: question.id,
            hideGroupTitle: false,
            fields: [{
                name: question.id,
                label: question.question[currentLang] || question.question.en,
                type: question.type as any,
                required: question.required,
                placeholder: question.placeholder?.[currentLang] || question.placeholder?.en,
                value: initialAnswers[question.id],
                options: question.options?.map(option => ({
                    value: option.value,
                    name: option.label[currentLang] || option.label.en,
                })),
                helpText: question.helpText?.[currentLang] || question.helpText?.en,
            }],
            layout: {
                type: 'vertical',
            },
            card: false,
        }));
    }, [healthQuestions, initialAnswers, i18n.language]);

    const handleSubmit = (formData: any) => {
        // Validate answers
        const errors = validateHealthAnswers(formData, healthQuestions);

        if (Object.keys(errors).length > 0) {
            console.error('Validation errors:', errors);
            // You might want to show these errors to the user
            return;
        }

        // Convert form data to health answers format
        const answers = convertFormDataToHealthAnswers(formData, healthQuestions);
        onSubmit(answers);
    };

    if (!healthQuestions || healthQuestions.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">
                    {t('health.noQuestions', 'No health questions required for this service.')}
                </p>
            </div>
        );
    }

    return (
        <MagicForm
            fields={formGroups}
            onSubmit={handleSubmit}
            title={title || t('health.formTitle', 'Health Information')}
            button={buttonText || t('health.submit', 'Submit Health Information')}
            initialValues={initialAnswers}
            loading={loading}
            returnType="object"
        />
    );
};

export default HealthQuestionsForm;