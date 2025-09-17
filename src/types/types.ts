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
