export interface IStep {
    id: number;
    name: 'sms' | 'email' | 'custom' | 'start' | 'end';
    nextStep?: string | null;
    dependsOn?: string | null | undefined;
}


export interface IScenario {
    id: number;
    name: string;
    steps: IStep[];
}

export interface IExecutionLog {
    id: number;
    step: string,
    result: string,
    timestamp: number,
    dependsOn: string | null | undefined
}

export interface ISimulationRun {
    id: number;
    scenarioId: number;
    logs: IExecutionLog[];
}
