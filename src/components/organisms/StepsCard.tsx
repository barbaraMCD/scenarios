import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";
import type {IScenario, IStep} from "@/types/types.ts";
import StepCard from "@/components/organisms/StepCard.tsx";

interface StepsCardProps {
    scenario: IScenario,
    addStep: () => void,
    updateField: (stepId: number, field: keyof IStep, value: string | number) => void;
    removeStep: (stepId: number) => void;
}

const StepsCard = ({scenario, addStep, updateField, removeStep}: StepsCardProps) => {

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    Étapes du scénario
                    <Badge variant="secondary">{scenario.steps.length}/3</Badge>
                </CardTitle>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addStep}
                    disabled={scenario.steps.length >= 3}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Ajouter une étape
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {scenario.steps.map((step) => (
                    <StepCard step={step} scenario={scenario} updateField={updateField} removeStep={removeStep} />
                ))}
            </CardContent>
        </Card>
    )
}

export default StepsCard;
