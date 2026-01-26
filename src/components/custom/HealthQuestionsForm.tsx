import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import MagicForm, { MagicFormGroupProps } from '@/components/custom/MagicForm';
import { HealthQuestion } from '@/interfaces/models/service';
import { convertFormDataToHealthAnswers } from '@/utils/healthQuestions';

interface HealthQuestionsFormProps {
    healthQuestions: HealthQuestion[];
    initialAnswers?: Record<string, any>;
    onSubmit: (answers: Record<string, { question: string; value: any }>) => void;
    onChange?: (answers: Record<string, { question: string; value: any }>) => void;
    loading?: boolean;
    title?: string;
    buttonText?: string;
    showSubmitButton?: boolean;
}

/**
 * Component that renders health questions using MagicForm
 * Handles bilingual questions (French/English) and validation
 */
const HealthQuestionsForm: React.FC<HealthQuestionsFormProps> = ({
    healthQuestions,
    initialAnswers = {},
    onSubmit,
    onChange,
    loading = false,
    title,
    buttonText,
    showSubmitButton = true,
}) => {
    const { t, i18n } = useTranslation();

    // Deep copy initialAnswers to prevent any shared references
    const copiedInitialAnswers = useMemo(() => JSON.parse(JSON.stringify(initialAnswers)), [initialAnswers]);

    // Convert health questions to MagicForm format with current language
    const formGroups: MagicFormGroupProps[] = useMemo(() => {
        const currentLang = i18n.language as 'en' | 'fr';
        const groups: MagicFormGroupProps[] = [];

        // Deep copy health questions to prevent any shared references
        const copiedHealthQuestions = JSON.parse(JSON.stringify(healthQuestions));

        // Add health questions as separate groups
        copiedHealthQuestions.forEach((question: any) => {
            groups.push({
                group: question.id,
                hideGroupTitle: false,
                fields: [{
                    name: question.id,
                    label: question.question[currentLang] || question.question.en,
                    type: question.type as any,
                    required: question.required,
                    placeholder: question.placeholder?.[currentLang] || question.placeholder?.en,
                    value: copiedInitialAnswers[question.id],
                    options: question.options?.map((option: any) => ({
                        value: option.value,
                        name: option.label[currentLang] || option.label.en,
                    })),
                }],
                layout: {
                    type: 'vertical',
                },
                card: false,
            });
        });

        return groups;
    }, [healthQuestions, copiedInitialAnswers, i18n.language]);

    const handleChange = (formData: any) => {
        // Convert form data to health answers format and call onChange
        const answers = convertFormDataToHealthAnswers(formData, healthQuestions);
        if (onChange) {
            onChange(answers);
        }
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
            onSubmit={(formData) => {
                // Convert form data to health answers format
                const answers = convertFormDataToHealthAnswers(formData, healthQuestions);
                onSubmit(answers);
            }}
            title={title || t('health.formTitle', 'Health Information')}
            button={buttonText || t('health.submit', 'Submit Health Information')}
            showButton={showSubmitButton}
            initialValues={copiedInitialAnswers}
            loading={loading}
            returnType="object"
        />
    );
};

export default HealthQuestionsForm;