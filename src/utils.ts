import type {IExecutionLog, IScenario, IStep} from "@/types/types.ts";

export const getCoreRules = (stepType: string) => {
    switch (stepType) {
        case 'sms':
            return Math.random() < 0.4 ? 'success' : 'failure';
        case 'email':
            return Math.random() < 0.5 ? 'success' : 'failure';
        case 'custom':
            return Math.random() < 0.6 ? 'success' : 'failure';
    }
};

export const simulateScenario = async (scenario:IScenario, onLogUpdate?: (log: IExecutionLog[]) => void) => {
    const executionLog: IExecutionLog[] = [];
    let executionCount = 0;
    const MAX_EXECUTIONS = 10;
    const successfulStepTypes = new Set<string>();


    const findStepById = (id: number) => {
        return scenario.steps.find(step => step.id === id);
    };

    const findNextStep = (currentStep: IStep) => {
        if (currentStep.nextStep === 'end') return scenario.steps.find(step => step.name === 'end');

        return scenario.steps.find(step =>
            step.name === currentStep.nextStep &&
            step.dependsOn === currentStep.name
        );
    };

    const addToLog = (entry: IExecutionLog) => {
        executionLog.push(entry);
        if (onLogUpdate) {
            onLogUpdate([...executionLog]);
        }
    };

    const executeStep = async (stepId: number, delay = 0): Promise<void> => {
        if (++executionCount > MAX_EXECUTIONS) {
            executionLog.push({
                id: Date.now(),
                step: 'error',
                result: 'Max executions reached',
                timestamp: Date.now(),
                dependsOn: null
            });
            return;
        }

        await new Promise(resolve => setTimeout(resolve, delay));

        const step = findStepById(stepId);
        if (!step) return;

        if (step.name === 'start') {
            addToLog({id: stepId, step: 'start', result: 'initiated', timestamp: Date.now(), dependsOn: null });
            const independentSteps = scenario.steps.filter(
                s => !s.dependsOn && s.name !== 'start' && s.name !== 'end'
            );
            await Promise.all(independentSteps.map(s =>
                executeStep(s.id, 100)
            ));
            return;
        }

        if (step.name === 'end') {
            addToLog({id: stepId, step: 'end', result: 'completed', timestamp: Date.now(), dependsOn: null });
            return;
        }

        if (['sms', 'email', 'custom'].includes(step.name) && successfulStepTypes.has(step.name)) {
            addToLog({
                id: step.id,
                step: step.name,
                result: `skipped - ${step.name} already sent successfully`,
                timestamp: Date.now(),
                dependsOn: step.dependsOn
            });
            return;
        }


        const result = getCoreRules(step?.name);
        if (!result) return;

        if (result === 'success' && ['sms', 'email', 'custom'].includes(step.name)) {
            successfulStepTypes.add(step.name);
        }

        addToLog({
            id: step?.id,
            step: step?.name,
            result,
            timestamp: Date.now(),
            dependsOn: step.dependsOn
        });

        if (result === 'success' && step.nextStep) {
                const nextStep = findNextStep(step);
                if (nextStep) await executeStep(nextStep.id, Math.random() * 1000);
        }
    };

    const startStep = scenario.steps.find(s => s.name === 'start');
    if (!startStep) return Promise.resolve([]);
    return executeStep(startStep.id).then(() => executionLog);
};

export const exportScenario = (scenarios: IScenario[]) => {
    const dataToExport = {
        scenario: scenarios,
        exportDate: new Date().toISOString(),
        version: "1.0"
    };

    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `scenarios-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};
