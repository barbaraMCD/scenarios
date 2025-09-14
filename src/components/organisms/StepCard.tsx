import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Trash2} from "lucide-react";
import {Label} from "@/components/ui/label.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import type {IScenario, IStep} from "@/types/types.ts";

interface StepCardProps {
    step: IStep,
    scenario: IScenario,
    updateField: (stepId: number, field: keyof IStep, value: string | number) => void;
    removeStep: (stepId: number) => void;
}
const StepCard = ({step, scenario, updateField, removeStep}: StepCardProps) => {

    const getAvailableStepTypes = (currentStepId: number) => {
        const allTypes = ["sms", "email", "custom"];
        const usedTypes = scenario?.steps
            .filter(s => s.id !== currentStepId)
            .map(s => s.name) || [];

        return allTypes.filter(type => !usedTypes.includes(type));
    };

    console.log("transition", step)

    return (
        <Card key={step.id} className="relative">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-lg">Étape {step.name}</CardTitle>
                {scenario.steps.length > 1 && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStep(step.id)}
                        className="text-destructive hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`step-name-${step.id}`}>Type d'étape *</Label>
                        <Select
                            value={step.name}
                            onValueChange={(value) => updateField(step.id, "name", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choisir un type d'étape"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    value="sms"
                                    disabled={!getAvailableStepTypes(step.id).includes("sms")}
                                >
                                    SMS
                                </SelectItem>
                                <SelectItem
                                    value="email"
                                    disabled={!getAvailableStepTypes(step.id).includes("email")}
                                >
                                    Email
                                </SelectItem>
                                <SelectItem
                                    value="custom"
                                    disabled={!getAvailableStepTypes(step.id).includes("custom")}
                                >
                                    Action personnalisée
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Transitions</Label>
                        <div className="text-sm text-muted-foreground">
                            Succès : {step.successTransition}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Failure : {step.failureTransition}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default StepCard;
