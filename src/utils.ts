import type {IScenario, IStep} from "@/types/types.ts";

export const getCoreRules = (stepType: string) => {
    switch (stepType) {
        case 'sms':
            return 'success';
        case 'email':
            return Math.random() < 0.5 ? 'success' : 'failure';
        case 'custom':
            return 'failure';
    }
};

export const addStep = (scenario: IScenario) => {
    if (!scenario || scenario?.steps.length >= 3) return

    const newStep: IStep = {
        id: Math.max(...scenario.steps.map(s => s.id), 0) + 1,
        name: "",
        successTransition: ""
    }

    return {
        ...scenario,
        steps: [...scenario.steps, newStep]
    }
}
