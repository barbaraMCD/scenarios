    import { Checkbox } from '@/components/ui/checkbox';
    import { useState } from 'react';

    interface CheckBoxStepProps {
        stepType: 'sms' | 'email' | 'custom';
        checked: boolean;
        onCheckedChange: (checked: boolean) => void;
        onNextChange?: (stepType: string, nextStep: string) => void;
        availableSteps: string[];
    }

    const CheckBoxStep = ({ stepType, checked, onCheckedChange, onNextChange, availableSteps }: CheckBoxStepProps) => {
        const [nextStep, setNextStep] = useState('');

        const getAvailableOptions = () => {
            const options = [...availableSteps, 'end'];
            return options.filter(option => option !== stepType);
        };

        const handleNextChange = (value: string) => {
            setNextStep(value);
            console.log("value", value);
            if (onNextChange) {
                onNextChange(stepType, value);
            }
        };

        return (
            <div className="space-y-2 border p-4 rounded">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id={stepType}
                        checked={checked}
                        onCheckedChange={(checked) => onCheckedChange(!!checked)}
                    />
                    <label htmlFor={stepType} className="font-medium">{stepType.toUpperCase()}</label>
                </div>

                {checked && (
                    <div className="ml-6 space-y-2">
                        <h5 className="font-medium mb-2">Prochaine étape :</h5>
                        {getAvailableOptions().map(option => (
                            <div key={`nextStep-${option}`} className="flex items-center space-x-2 mb-1">
                                <input
                                    type="radio"
                                    id={`${stepType}-nextStep-${option}`}
                                    name={`${stepType}-nextStep`}
                                    value={option}
                                    checked={nextStep === option}
                                    onChange={(e) => handleNextChange(e.target.value)}
                                />
                                <label htmlFor={`${stepType}-nextStep-${option}`}>{option}</label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    export default CheckBoxStep;
