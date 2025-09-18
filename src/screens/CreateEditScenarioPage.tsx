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
            const name = getScenarioById(parseInt(id))!.name;
            return {
                id: parseInt(id),
                name: name,
                steps: []
            };
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
                nextStep: null,
                dependsOn: null
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


    const handleNextChange = (stepType: string, nextStep: string) => {
        setScenario(prev => ({
            ...prev,
            steps: prev.steps.map(step =>
                step.name === stepType
                    ? { ...step, nextStep }
                    : step
            )
        }));
    };

    const handleSave = () => {
        if (!scenario.name || scenario.steps.length === 0) return;

        const completeSteps = [...scenario.steps];

        scenario.steps.forEach(step => {
            if (step.nextStep && step.nextStep !== 'end') {
                const existing = completeSteps.find(
                    s => s.dependsOn === step.name && s.name === step.nextStep
                );
                if (!existing) {
                    const base = scenario.steps.find(s => s.name === step.nextStep && !s.dependsOn);
                    completeSteps.push({
                        id: Date.now() + Math.random(),
                        name: step.nextStep as 'sms' | 'email' | 'custom',
                        nextStep: base?.nextStep || null,
                        dependsOn: step.name
                    });
                }
            }
        });

        const startStep: IStep = {
            id: Date.now(),
            name: 'start',
            nextStep: null,
            dependsOn: null
        };

        const endStep: IStep = {
            id: Date.now() + 1,
            name: 'end',
            nextStep: null,
            dependsOn: null
        };

        const completeScenario = {
            ...scenario,
            steps: [startStep, ...completeSteps, endStep]
        };

        if (isEditing) {
            updateScenario(parseInt(id), completeScenario);
        } else {
            addScenario(completeScenario);
        }
        navigate('/');
    };
    const isStepSelected = (stepType: 'sms' | 'email' | 'custom') => {
        return scenario.steps.some(step => step.name === stepType);
    };

    const availableSteps = scenario.steps.map(step => step.name);

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
                    onNextChange={handleNextChange}
                    availableSteps={availableSteps}
                />
                <CheckBoxStep
                    stepType="email"
                    checked={isStepSelected('email')}
                    onCheckedChange={(checked) => handleCheckboxChange('email', checked)}
                    onNextChange={handleNextChange}
                    availableSteps={availableSteps}
                />
                <CheckBoxStep
                    stepType="custom"
                    checked={isStepSelected('custom')}
                    onCheckedChange={(checked) => handleCheckboxChange('custom', checked)}
                    onNextChange={handleNextChange}
                    availableSteps={availableSteps}
                />
            </div>

            <Button onClick={handleSave} disabled={!scenario.name || scenario.steps.length === 0}>
                {isEditing ? 'Modifier' : 'Créer'}
            </Button>
        </div>
    );
};

export default CreateEditScenarioPage;
