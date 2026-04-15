import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { toast } from '@/components/ui/use-toast';
import { setPageTitle, handleErrorResponse } from '@/utils';
import MagicForm, { MagicFormGroupProps } from '@/components/custom/MagicForm';
import { Skeleton } from '@/components/ui/skeleton';

export default function TypeServicesEdit() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setPageTitle(t('typeServices.editTitle', 'Edit Service Type'));
    }, [t]);
    const { data: serviceType, isLoading } = useQuery<any>({
        queryKey: ['serviceType', id],

        queryFn: async () => {
            const response = await http.get(apiRoutes.adminServiceTypeById(parseInt(id!)));
            return response.data.data;
        },
        enabled: !!id,
    });

    const handleSubmit = (values: any) => {
        setLoading(true);
        
        // Transform health_questions from table format to HealthQuestion format
        const transformedValues = { ...values };

        if (values.health_questions && Array.isArray(values.health_questions)) {
            transformedValues.health_questions = values.health_questions.map((question: any, index: number) => ({
                id: `question_${index + 1}`,
                question: {
                    en: question.question_en,
                    fr: question.question_fr,
                },
                type: question.type,
                required: question.required || false,
                order: question.order || index + 1,
                placeholder: question.placeholder_en || question.placeholder_fr ? {
                    en: question.placeholder_en || '',
                    fr: question.placeholder_fr || '',
                } : undefined,
                options: question.options_text ? question.options_text.split('\n').filter((line: string) => line.trim()).map((line: string) => {
                    const parts = line.split('|').map(part => part.trim());
                    return {
                        label: {
                            en: parts[0] || '',
                            fr: parts[1] || parts[0] || '',
                        },
                        value: parts[2] || parts[0]?.toLowerCase().replace(/\s+/g, '_') || '',
                    };
                }) : undefined,
            }));
        }
        
        http
            .put(apiRoutes.adminServiceTypeById(parseInt(id!)), transformedValues)
            .then(() => {
                toast({
                    title: t('common.success', 'Success'),
                    description: t('typeServices.updateSuccess', 'Service type updated successfully'),
                });
                navigate(webRoutes.typeServices.view.replace(':id', id!));
            })
            .catch((e) => {
                handleErrorResponse(e);
                setLoading(false);
            });
    };

    const serviceTypeFields: MagicFormGroupProps[] = [
        {
            group: t('typeServices.typeDetails', 'Service Type Details'),
            card: true,
            fields: [
                {
                    name: 'name_fr',
                    label: t('typeServices.nameFr', 'Name (French)'),
                    type: 'text',
                    required: true,
                    error: t('typeServices.nameRequired', 'Name is required'),
                    placeholder: t('typeServices.namePlaceholderFr', 'e.g., Services de massage'),
                },
                {
                    name: 'name_en',
                    label: t('typeServices.nameEn', 'Name (English)'),
                    type: 'text',
                    required: true,
                    error: t('typeServices.nameRequired', 'Name is required'),
                    placeholder: t('typeServices.namePlaceholder', 'e.g., Massage Services'),
                },



                {
                    name: 'icon',
                    label: t('typeServices.icon', 'Icon'),
                    type: 'iconpicker',
                    placeholder: t('typeServices.iconPlaceholder', 'Icon class or emoji'),
                },
                {
                    name: 'color',
                    label: t('typeServices.color', 'Color'),
                    type: 'color',
                },
                {
                    name: 'display_order',
                    label: t('typeServices.displayOrder', 'Display Order'),
                    type: 'number',
                },
                {
                    name: 'is_active',
                    label: t('typeServices.isActive', 'Active'),
                    type: 'checkbox',
                },
                   {
                    name: 'allows_multiple_services',
                    label: t('typeServices.allowsMultipleServices', 'Allows Multiple Services selection'),
                    type: 'checkbox',
                },
                {
                    name: 'requires_health_form',
                    label: t('typeServices.requiresHealthForm', 'Requires Health Form'),
                    type: 'checkbox',
                },
            ],
        },
        {
            group: t('typeServices.healthQuestions', 'Health Questions'),
            fields: [
                {
                    name: 'health_questions',
                    label: t('typeServices.healthQuestionsList', 'Health Questions'),
                    type: 'table',
                    required: false,
                    showIf: (data) => data.requires_health_form === 1,
                    columns: [
                        {
                            name: 'question_en',
                            label: t('typeServices.questionEn', 'Question (EN)'),
                            type: 'text',
                            required: true,
                            placeholder: t('typeServices.questionEnPlaceholder', 'Enter question in English'),
                        },
                        {
                            name: 'question_fr',
                            label: t('typeServices.questionFr', 'Question (FR)'),
                            type: 'text',
                            required: true,
                            placeholder: t('typeServices.questionFrPlaceholder', 'Entrez la question en français'),
                        },
                        {
                            name: 'type',
                            label: t('typeServices.fieldType', 'Field Type'),
                            type: 'select',
                            required: true,
                            options: [
                                { value: 'text', name: t('typeServices.fieldTypeText', 'Text') },
                                { value: 'textarea', name: t('typeServices.fieldTypeTextarea', 'Textarea') },
                                { value: 'select', name: t('typeServices.fieldTypeSelect', 'Select') },
                                { value: 'radio', name: t('typeServices.fieldTypeRadio', 'Radio') },
                                { value: 'checkbox', name: t('typeServices.fieldTypeCheckbox', 'Checkbox') },
                                { value: 'number', name: t('typeServices.fieldTypeNumber', 'Number') },
                                { value: 'date', name: t('typeServices.fieldTypeDate', 'Date') },
                                { value: 'label', name: t('typeServices.fieldTypeLabel', 'Label') },
                            ],
                        },
                        {
                            name: 'required',
                            label: t('typeServices.isRequired', 'Required'),
                            type: 'checkbox',
                        },
                        {
                            name: 'order',
                            label: t('typeServices.questionOrder', 'Order'),
                            type: 'number',
                            required: true,
                            placeholder: '1',
                        },
                        {
                            name: 'placeholder_en',
                            label: t('typeServices.placeholderEn', 'Placeholder (EN)'),
                            type: 'text',
                            required: false,
                            placeholder: t('typeServices.placeholderEnPlaceholder', 'Optional placeholder text'),
                        },
                        {
                            name: 'placeholder_fr',
                            label: t('typeServices.placeholderFr', 'Placeholder (FR)'),
                            type: 'text',
                            required: false,
                            placeholder: t('typeServices.placeholderFrPlaceholder', 'Texte d\'espace réservé optionnel'),
                        },
                        {
                            name: 'options_text',
                            label: t('typeServices.options', 'Options'),
                            type: 'textarea',
                            required: false,
                            showIf: (rowData) => rowData.type === 'select' || rowData.type === 'radio',
                            placeholder: t('typeServices.optionsPlaceholder', 'Enter options one per line:\nLabel EN|Label FR|value\n\nExample:\nYes|Oui|yes\nNo|Non|no'),
                        },
                    ],
                },
            ],
        },
    ];

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (!serviceType) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <h2 className="text-2xl font-bold mb-4">{t('typeServices.notFound', 'Service type not found')}</h2>
            </div>
        );
    }
    console.log("   serviceType:", serviceType);
    return (
        <MagicForm
            title={t('typeServices.editTitle', 'Edit Service Type')}
            onSubmit={handleSubmit}
            fields={serviceTypeFields}
            button={t('common.update', 'Update')}
            initialValues={{
                name_fr: serviceType?.name.fr,
                name_en: serviceType?.name.en,
                icon: serviceType?.icon,
                color: serviceType?.color,
                is_active: serviceType?.is_active,
                display_order: serviceType?.display_order,
                allows_multiple_services: serviceType?.allows_multiple_services,
                requires_health_form: serviceType?.requires_health_form ? 1 : 0,
                health_questions: serviceType?.health_questions?.map((question: any, index: number) => ({
                    question_en: question.question?.en || '',
                    question_fr: question.question?.fr || '',
                    type: question.type || 'text',
                    required: question.required ? 1 : 0,
                    order: question.order || index + 1,
                    placeholder_en: question.placeholder?.en || '',
                    placeholder_fr: question.placeholder?.fr || '',
                    options_text: question.options?.map((option: any) =>
                        `${option.label?.en || ''}|${option.label?.fr || ''}|${option.value || ''}`
                    ).join('\n') || '',
                })) || [],
            }}
            loading={loading}
        />
    );
}
