import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import http from '@/utils/http';
import { apiRoutes } from '@/routes/api';
import { webRoutes } from '@/routes/web';
import { toast } from '@/components/ui/use-toast';
import { setPageTitle, handleErrorResponse } from '@/utils';
import MagicForm, { MagicFormGroupProps } from '@/components/custom/MagicForm';

export default function TypeServicesAdd() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setPageTitle(t('typeServices.addTitle', 'Add New Service Type'));
    }, [t]);

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
            .post(apiRoutes.adminServiceTypes, transformedValues)
            .then(() => {
                toast({
                    title: t('common.success', 'Success'),
                    description: t('typeServices.createSuccess', 'Service type created successfully'),
                });
                navigate(webRoutes.typeServices.index);
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
                    placeholder: t('typeServices.iconPlaceholder', 'Select an icon'),
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
                    defaultValue: true,
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
        {
            group: t('typeServices.emailTemplates', 'Email Templates'),
            card: true,
            fields: [
                {
                    name: 'email_subject_en',
                    label: t('typeServices.emailSubjectEn', 'Email Subject (EN)'),
                    type: 'text',
                    placeholder: t('typeServices.emailSubjectPlaceholder', 'e.g., Booking Confirmation'),
                },
                {
                    name: 'email_subject_fr',
                    label: t('typeServices.emailSubjectFr', 'Email Subject (FR)'),
                    type: 'text',
                    placeholder: t('typeServices.emailSubjectPlaceholder', 'e.g., Confirmation de réservation'),
                },
                {
                    name: 'email_template_en',
                    label: t('typeServices.emailTemplateEn', 'Email Template (EN)'),
                    type: 'textarea',
                    placeholder: t('typeServices.emailTemplatePlaceholder', 'Enter email template in English...'),
                },
                {
                    name: 'email_template_fr',
                    label: t('typeServices.emailTemplateFr', 'Email Template (FR)'),
                    type: 'textarea',
                    placeholder: t('typeServices.emailTemplatePlaceholder', 'Entrez le modèle d\'email en français...'),
                },
            ],
        },
        {
            group: t('typeServices.smsTemplates', 'SMS Templates'),
            card: true,
            fields: [
                {
                    name: 'sms_confirmation_en',
                    label: t('typeServices.smsConfirmationEn', 'SMS Confirmation (EN)'),
                    type: 'textarea',
                    placeholder: t('typeServices.smsConfirmationPlaceholder', 'Enter SMS confirmation text...'),
                },
                {
                    name: 'sms_confirmation_fr',
                    label: t('typeServices.smsConfirmationFr', 'SMS Confirmation (FR)'),
                    type: 'textarea',
                    placeholder: t('typeServices.smsConfirmationPlaceholder', 'Entrez le texte de confirmation SMS...'),
                },
                {
                    name: 'sms_reminder_en',
                    label: t('typeServices.smsReminderEn', 'SMS Reminder (EN)'),
                    type: 'textarea',
                    placeholder: t('typeServices.smsReminderPlaceholder', 'Enter SMS reminder text...'),
                },
                {
                    name: 'sms_reminder_fr',
                    label: t('typeServices.smsReminderFr', 'SMS Reminder (FR)'),
                    type: 'textarea',
                    placeholder: t('typeServices.smsReminderPlaceholder', 'Entrez le texte de rappel SMS...'),
                },
                {
                    name: 'sms_4hour_reminder_en',
                    label: t('typeServices.sms4hourReminderEn', 'SMS 4-Hour Reminder (EN)'),
                    type: 'textarea',
                    placeholder: t('typeServices.sms4hourReminderPlaceholder', 'Enter SMS 4-hour reminder text...'),
                },
                {
                    name: 'sms_4hour_reminder_fr',
                    label: t('typeServices.sms4hourReminderFr', 'SMS 4-Hour Reminder (FR)'),
                    type: 'textarea',
                    placeholder: t('typeServices.sms4hourReminderPlaceholder', 'Entrez le texte de rappel SMS 4 heures...'),
                },
            ],
        },
    ];

    return (
      
        <MagicForm
            title={t('typeServices.addTitle', 'Add New Service Type')}
            onSubmit={handleSubmit}
            fields={serviceTypeFields}
            button={t('typeServices.create', 'Create Service Type')}
            initialValues={{
                name_fr: '',
                name_en: '',
                code: '',
                description: '',
                icon: '',
                color: '#3b82f6',
                is_active: true,
                display_order: 0,
                requires_health_form: false,
                health_questions: [],
                email_subject_en: '',
                email_subject_fr: '',
                email_template_en: '',
                email_template_fr: '',
                sms_confirmation_en: '',
                sms_confirmation_fr: '',
                sms_reminder_en: '',
                sms_reminder_fr: '',
                sms_4hour_reminder_en: '',
                sms_4hour_reminder_fr: '',
            }}
            loading={loading}
        />
    );
}
