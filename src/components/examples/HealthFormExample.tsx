import React, { useState } from 'react';
import HealthQuestionsForm from '@/components/custom/HealthQuestionsForm';
import { HealthQuestion } from '@/interfaces/models/service';

// Example usage of HealthQuestionsForm component
const HealthFormExample: React.FC = () => {
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);

    // Example health questions - this would typically come from your service data
    const exampleQuestions: HealthQuestion[] = [
        {
            id: 'age',
            question: {
                en: 'What is your age?',
                fr: 'Quel âge avez-vous ?'
            },
            type: 'number',
            required: true,
            order: 1,
            validation: {
                min: 18,
                max: 100
            }
        },
        {
            id: 'allergies',
            question: {
                en: 'Do you have any allergies?',
                fr: 'Avez-vous des allergies ?'
            },
            type: 'textarea',
            required: false,
            order: 2,
            placeholder: {
                en: 'Please describe any allergies...',
                fr: 'Veuillez décrire vos allergies...'
            }
        },
        {
            id: 'pregnant',
            question: {
                en: 'Are you pregnant?',
                fr: 'Êtes-vous enceinte ?'
            },
            type: 'radio',
            required: true,
            order: 3,
            options: [
                {
                    value: 'yes',
                    label: {
                        en: 'Yes',
                        fr: 'Oui'
                    }
                },
                {
                    value: 'no',
                    label: {
                        en: 'No',
                        fr: 'Non'
                    }
                }
            ]
        },
        {
            id: 'medical_conditions',
            question: {
                en: 'Do you have any medical conditions we should be aware of?',
                fr: 'Avez-vous des conditions médicales dont nous devrions être informés ?'
            },
            type: 'select',
            required: false,
            order: 4,
            options: [
                {
                    value: 'diabetes',
                    label: {
                        en: 'Diabetes',
                        fr: 'Diabète'
                    }
                },
                {
                    value: 'hypertension',
                    label: {
                        en: 'Hypertension',
                        fr: 'Hypertension'
                    }
                },
                {
                    value: 'heart_condition',
                    label: {
                        en: 'Heart Condition',
                        fr: 'Problème cardiaque'
                    }
                },
                {
                    value: 'other',
                    label: {
                        en: 'Other',
                        fr: 'Autre'
                    }
                }
            ],
        }
    ];

    const handleSubmit = async (submittedAnswers: Record<string, any>) => {
        setLoading(true);
        try {
            // Here you would typically send the answers to your backend
            console.log('Health answers submitted:', submittedAnswers);
            setAnswers(submittedAnswers);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert('Health information submitted successfully!');
        } catch (error) {
            console.error('Error submitting health form:', error);
            alert('Failed to submit health information. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <HealthQuestionsForm
                healthQuestions={exampleQuestions}
                initialAnswers={answers}
                onSubmit={handleSubmit}
                loading={loading}
                title="Health Questionnaire"
                buttonText="Submit Health Info"
            />

            {/* Debug: Show submitted answers */}
            {Object.keys(answers).length > 0 && (
                <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                    <h3 className="font-bold mb-2">Submitted Answers:</h3>
                    <pre className="text-sm">{JSON.stringify(answers, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default HealthFormExample;