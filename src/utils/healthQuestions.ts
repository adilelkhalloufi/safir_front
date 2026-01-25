import { HealthQuestion } from '@/interfaces/models/service';
import { MagicFormFieldProps, MagicFormGroupProps } from '@/components/custom/MagicForm';

/**
 * Converts health questions to MagicForm compatible format
 * @param healthQuestions Array of health questions from service
 * @param answers Optional existing answers to populate the form
 * @returns MagicFormGroupProps array ready to be used with MagicForm
 */
export function convertHealthQuestionsToMagicForm(
  healthQuestions: HealthQuestion[],
  answers?: Record<string, any>
): MagicFormGroupProps[] {
  if (!healthQuestions || healthQuestions.length === 0) {
    return [];
  }

  // Sort questions by order
  const sortedQuestions = [...healthQuestions].sort((a, b) => a.order - b.order);

  const fields: MagicFormFieldProps[] = sortedQuestions.map((question) => {
    const baseField: MagicFormFieldProps = {
      name: question.id,
      label: question.question.en, // Default to English, can be overridden by i18n
      type: question.type as any,
      required: question.required,
      order: question.order,
      placeholder: question.placeholder?.en,
      value: answers?.[question.id] || undefined,
      group: 'health_questions',
    };

    // Add options for select/radio types
    if ((question.type === 'select' || question.type === 'radio') && question.options) {
      baseField.options = question.options.map(option => ({
        value: option.value,
        name: option.label.en, // Default to English
      }));
    }

    // Add validation for number type
    if (question.type === 'number' && question.validation) {
      if (question.validation.min !== undefined) {
        baseField.defaultValue = question.validation.min;
      }
    }

    return baseField;
  });

  return [{
    group: 'Health Information',
    fields: fields,
    layout: {
      type: 'vertical',
    },
    card: true,
  }];
}

/**
 * Converts form data back to health question answers format
 * @param formData Form data from MagicForm submission
 * @param healthQuestions Original health questions array
 * @returns Formatted answers object with question text and value
 */
export function convertFormDataToHealthAnswers(
  formData: Record<string, any>,
  healthQuestions: HealthQuestion[]
): Record<string, { question: string; value: any }> {
  const answers: Record<string, { question: string; value: any }> = {};

  healthQuestions.forEach(question => {
    if (formData.hasOwnProperty(question.id)) {
      answers[question.id] = {
        question: question.question.en || question.question.fr || 'Unknown question',
        value: formData[question.id]
      };
    }
  });

  return answers;
}

/**
 * Validates health question answers
 * @param answers Answers object
 * @param healthQuestions Health questions array
 * @returns Validation errors object
 */
export function validateHealthAnswers(
  answers: Record<string, any>,
  healthQuestions: HealthQuestion[]
): Record<string, string> {
  const errors: Record<string, string> = {};

  healthQuestions.forEach(question => {
    const answer = answers[question.id];

    // Check required fields
    if (question.required) {
      if (answer === undefined || answer === null || answer === '') {
        errors[question.id] = 'This field is required';
        return;
      }
    }

    // Type-specific validation
    if (question.validation) {
      if (question.type === 'number') {
        const numValue = Number(answer);
        if (isNaN(numValue)) {
          errors[question.id] = 'Please enter a valid number';
        } else {
          if (question.validation.min !== undefined && numValue < question.validation.min) {
            errors[question.id] = `Minimum value is ${question.validation.min}`;
          }
          if (question.validation.max !== undefined && numValue > question.validation.max) {
            errors[question.id] = `Maximum value is ${question.validation.max}`;
          }
        }
      }

      if (question.validation.pattern && typeof answer === 'string') {
        const regex = new RegExp(question.validation.pattern);
        if (!regex.test(answer)) {
          errors[question.id] = 'Invalid format';
        }
      }
    }
  });

  return errors;
}