import { useState } from 'react';
import { useScenario } from '@/hook/useScenario';
import {useNavigate, useParams} from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type {IScenario, IStep} from '@/types/types';
import CheckBoxStep from "@/components/organisms/CheckBoxStep.tsx";

const CreateEditScenarioPage = () => {
    const { getScenarioById, addScenario, updateScenario } = useScenario();
    const { id } = useParams();
    const isEditing = !!id;
    const navigate = useNavigate();
    const [scenario, setScenario] = useState<IScenario>(() => {
        if (isEditing && id) {
            return getScenarioById(parseInt(id))!
        }
        return {
            id: Date.now(),
            name: '',
            steps: []
        };
    });

    const handleCheckboxChange = (stepType: 'sms' | 'email' | 'custom', checked: boolean) => {
        if (checked) {
            const newStep: IStep = {
                id: Date.now(),
                name: stepType,
                successTransition: '',
                failureTransition: ''
            };
            setScenario(prev => ({
                ...prev,
                steps: [...prev.steps, newStep]
            }));
        } else {
            setScenario(prev => ({
                ...prev,
                steps: prev.steps.filter(step => step.name !== stepType)
            }));
        }
    };

    const handleTransitionsChange = (stepType: string, transitions: { success: string, failure: string }) => {
        setScenario(prev => ({
            ...prev,
            steps: prev.steps.map(step =>
                step.name === stepType
                    ? {
                        ...step,
                        successTransition: transitions.success,
                        failureTransition: transitions.failure
                    }
                    : step
            )
        }));
    };

    const handleSave = () => {
        if (!scenario.name || scenario.steps.length === 0) return;

        if (isEditing) {
            updateScenario(parseInt(id), scenario);
        } else {
            addScenario(scenario);
        }
        navigate('/');
    };

    const isStepSelected = (stepType: 'sms' | 'email' | 'custom') => {
        return scenario.steps.some(step => step.name === stepType);
    };

    return (
        <div className="p-4 space-y-4">
            <Input
                id="scenario-name"
                value={scenario.name}
                onChange={(e) => setScenario(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nom du scénario"
            />

            <div className="space-y-4">
                <h3>Choisir les étapes :</h3>
                <CheckBoxStep
                    stepType="sms"
                    checked={isStepSelected('sms')}
                    onCheckedChange={(checked) => handleCheckboxChange('sms', checked)}
                    onTransitionsChange={handleTransitionsChange}
                />
                <CheckBoxStep
                    stepType="email"
                    checked={isStepSelected('email')}
                    onCheckedChange={(checked) => handleCheckboxChange('email', checked)}
                    onTransitionsChange={handleTransitionsChange}
                />
                <CheckBoxStep
                    stepType="custom"
                    checked={isStepSelected('custom')}
                    onCheckedChange={(checked) => handleCheckboxChange('custom', checked)}
                    onTransitionsChange={handleTransitionsChange}
                />
            </div>

            <Button onClick={handleSave} disabled={!scenario.name || scenario.steps.length === 0}>
                {isEditing ? 'Modifier' : 'Créer'}
            </Button>
        </div>
    );
};

export default CreateEditScenarioPage;
