export interface IStep {
    id: number;
    name: string;
    successTransition: string;
    failureTransition: string;
}

export interface IScenario {
    id: number;
    name: string;
    steps: IStep[];
}
