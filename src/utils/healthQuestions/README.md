# Health Questions System

This system allows admins to create dynamic health questionnaires for services that require health information from clients. The questions are stored as JSON in the database and can be easily modified without code changes.

## Features

- **Dynamic Forms**: Create custom health questions with different field types
- **Bilingual Support**: All questions support both French and English
- **Multiple Field Types**: Text, textarea, select, radio, checkbox, number, date
- **Validation**: Built-in validation for required fields and data types
- **MagicForm Integration**: Seamlessly integrates with the existing MagicForm component
- **Admin Friendly**: Easy to add, edit, and reorder questions

## Database Structure

The `health_questions` field in the `services` table should contain a JSON array of questions with this structure:

```json
[
  {
    "id": "age",
    "question": {
      "en": "What is your age?",
      "fr": "Quel âge avez-vous ?"
    },
    "type": "number",
    "required": true,
    "order": 1,
    "validation": {
      "min": 18,
      "max": 100
    }
  },
  {
    "id": "allergies",
    "question": {
      "en": "Do you have any allergies?",
      "fr": "Avez-vous des allergies ?"
    },
    "type": "textarea",
    "required": false,
    "order": 2,
    "placeholder": {
      "en": "Please describe any allergies...",
      "fr": "Veuillez décrire vos allergies..."
    }
  }
]
```

## TypeScript Interfaces

### HealthQuestion

```typescript
interface HealthQuestion {
  id: string // Unique identifier
  question: {
    en: string
    fr: string
  }
  type: HealthQuestionType // 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'number' | 'date'
  required: boolean
  order: number
  placeholder?: {
    en: string
    fr: string
  }
  options?: HealthQuestionOption[] // For select/radio types
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
  helpText?: {
    en: string
    fr: string
  }
}
```

## Usage

### Basic Usage with HealthQuestionsForm Component

```tsx
import HealthQuestionsForm from '@/components/custom/HealthQuestionsForm'

const MyComponent = () => {
  const handleSubmit = (answers: Record<string, any>) => {
    // Process the health answers
    console.log('Health answers:', answers)
  }

  return (
    <HealthQuestionsForm
      healthQuestions={service.health_questions}
      onSubmit={handleSubmit}
      loading={false}
    />
  )
}
```

### Using Utility Functions

```tsx
import {
  convertHealthQuestionsToMagicForm,
  convertFormDataToHealthAnswers,
  validateHealthAnswers,
} from '@/utils/healthQuestions'

// Convert to MagicForm format
const formGroups = convertHealthQuestionsToMagicForm(
  healthQuestions,
  existingAnswers
)

// Validate answers
const errors = validateHealthAnswers(answers, healthQuestions)

// Convert form data back to answers format
const formattedAnswers = convertFormDataToHealthAnswers(
  formData,
  healthQuestions
)
```

## Field Types Supported

- **text**: Single line text input
- **textarea**: Multi-line text input
- **select**: Dropdown selection (supports multi-select)
- **radio**: Radio button selection
- **checkbox**: Single checkbox (true/false)
- **number**: Numeric input with min/max validation
- **date**: Date picker input

## Admin Interface

To create an admin interface for managing health questions, you can use MagicForm with a table field type:

```tsx
const adminFields: MagicFormGroupProps[] = [
  {
    group: 'Health Questions',
    fields: [
      {
        name: 'health_questions',
        label: 'Health Questions',
        type: 'table',
        columns: [
          {
            name: 'question_en',
            label: 'Question (EN)',
            type: 'text',
            required: true,
          },
          {
            name: 'question_fr',
            label: 'Question (FR)',
            type: 'text',
            required: true,
          },
          {
            name: 'type',
            label: 'Field Type',
            type: 'select',
            required: true,
            options: [
              { value: 'text', name: 'Text' },
              { value: 'textarea', name: 'Textarea' },
              { value: 'select', name: 'Select' },
              { value: 'radio', name: 'Radio' },
              { value: 'checkbox', name: 'Checkbox' },
              { value: 'number', name: 'Number' },
              { value: 'date', name: 'Date' },
            ],
          },
          {
            name: 'required',
            label: 'Required',
            type: 'checkbox',
          },
          {
            name: 'order',
            label: 'Order',
            type: 'number',
            required: true,
          },
        ],
      },
    ],
  },
]
```

## Validation

The system includes built-in validation for:

- Required fields
- Number ranges (min/max)
- Pattern matching
- Field type validation

## Internationalization

All text in health questions supports both English and French. The component automatically uses the current language from i18next.

## Example

See `src/components/examples/HealthFormExample.tsx` for a complete working example.
