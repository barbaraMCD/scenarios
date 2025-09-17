import type {IScenario} from "@/types/types.ts";

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

export interface IExecutionLog {
    step: string,
    result: string,
    timestamp: number,
    dependsOn: string | null | undefined
}

export const simulateScenario = (scenario:IScenario) => {
    const executionLog: IExecutionLog[] = [];
    let executionCount = 0;
    const MAX_EXECUTIONS = 10;

    const findStepByName = (name: string) => {
        return scenario.steps.find(step => step.name === name);
    };

    const executeStep = async (stepName: string, delay = 0): Promise<void> => {
        if (++executionCount > MAX_EXECUTIONS) {
            executionLog.push({
                step: 'error',
                result: 'Max executions reached',
                timestamp: Date.now(),
                dependsOn: null
            });
            return;
        }

        await new Promise(resolve => setTimeout(resolve, delay));

        if (stepName === 'start') {
            executionLog.push({ step: 'start', result: 'initiated', timestamp: Date.now(), dependsOn: null });
            const independentSteps = scenario.steps.filter(
                s => !s.dependsOn && s.name !== 'start' && s.name !== 'end'
            );
            await Promise.all(independentSteps.map(s =>
                executeStep(s.name, Math.random() * 1000)
            ));
            return;
        }

        if (stepName === 'end') {
            executionLog.push({ step: 'end', result: 'completed', timestamp: Date.now(), dependsOn: null });
            return;
        }

        const result = getCoreRules(stepName);
        if (!result) return;

        const step = findStepByName(stepName);
        if (!step) return;

        executionLog.push({
            step: stepName,
            result,
            timestamp: Date.now(),
            dependsOn: step.dependsOn
        });

        if (result === 'success' && step.nextStep) {
            await executeStep(step.nextStep, Math.random() * 1000);
        }
    };

    return executeStep('start').then(() => executionLog);
};


