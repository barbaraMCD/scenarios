import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {IExecutionLog, ISimulationRun} from '@/types/types';

interface SimulationStore {
    simulationRuns: ISimulationRun[];
    saveSimulationRun: (scenarioId: number, logs: IExecutionLog[]) => void;
    getSimulationRuns: (scenarioId: number) => ISimulationRun[];
    getAllSimulationRuns: () => ISimulationRun[];
}

export const useSimulation = create<SimulationStore>()(
    persist(
        (set, get) => ({
            simulationRuns: [],
            saveSimulationRun: (scenarioId: number, logs: IExecutionLog[]) =>
                set((state) => ({
                    simulationRuns: [
                        ...state.simulationRuns,
                        {
                            id: Date.now(),
                            scenarioId,
                            logs
                        }
                    ]
                })),

            getSimulationRuns: (scenarioId: number) =>
                get().simulationRuns.filter(run => run.scenarioId === scenarioId),

            getAllSimulationRuns: () => get().simulationRuns,
        }),
        {
            name: 'simulation-storage',
        }
    )
);
