import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {IExecutionLog, ISimulationRun} from '@/types/types';

interface SimulationStore {
    simulationRuns: ISimulationRun[];
    saveSimulationRun: (scenarioId: number, logs: IExecutionLog[]) => void;
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
            getAllSimulationRuns: () => get().simulationRuns,
        }),
        {
            name: 'simulation-storage',
        }
    )
);
