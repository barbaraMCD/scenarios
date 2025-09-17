import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

interface CheckBoxStepProps {
    stepType: 'sms' | 'email' | 'custom';
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    onTransitionsChange?: (stepType: string, transitions: { success: string, failure: string }) => void;
}

const CheckBoxStep = ({ stepType, checked, onCheckedChange, onTransitionsChange }: CheckBoxStepProps) => {
    const [transitions, setTransitions] = useState({
        success: '',
        failure: ''
    });

    const getAvailableOptions = () => {
        const allOptions = ['email', 'sms', 'custom', 'end'];
        return allOptions.filter(option => option !== stepType);
    };

    const handleTransitionChange = (type: 'success' | 'failure', value: string) => {
        const newTransitions = {
            ...transitions,
            [type]: value
        };
        setTransitions(newTransitions);

        if (onTransitionsChange) {
            onTransitionsChange(stepType, newTransitions);
        }
    };

    const availableOptions = getAvailableOptions();

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
                <div className="ml-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h5 className="font-medium mb-2">Success Transition:</h5>
                            {availableOptions.map(option => (
                                <div key={`success-${option}`} className="flex items-center space-x-2 mb-1">
                                    <input
                                        type="radio"
                                        id={`${stepType}-success-${option}`}
                                        name={`${stepType}-success`}
                                        value={option}
                                        checked={transitions.success === option}
                                        onChange={(e) => handleTransitionChange('success', e.target.value)}
                                    />
                                    <label htmlFor={`${stepType}-success-${option}`}>{option}</label>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h5 className="font-medium mb-2">Failure Transition:</h5>
                            {availableOptions.map(option => (
                                <div key={`failure-${option}`} className="flex items-center space-x-2 mb-1">
                                    <input
                                        type="radio"
                                        id={`${stepType}-failure-${option}`}
                                        name={`${stepType}-failure`}
                                        value={option}
                                        checked={transitions.failure === option}
                                        onChange={(e) => handleTransitionChange('failure', e.target.value)}
                                    />
                                    <label htmlFor={`${stepType}-failure-${option}`}>{option}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckBoxStep;
