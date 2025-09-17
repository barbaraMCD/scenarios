import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IScenario } from '@/types/types';

interface ScenarioStore {
    scenarios: IScenario[];
    addScenario: (scenario: IScenario) => void;
    removeScenario: (id: number) => void;
    updateScenario: (id: number, updates: Partial<IScenario>) => void;
}

export const useScenario = create<ScenarioStore>()(
    persist(
        (set) => ({
            scenarios: [],

            addScenario: (scenarioData) =>
                set((state) => ({
                    scenarios: [
                        ...state.scenarios, scenarioData
                    ],
                })),

            removeScenario: (id) =>
                set((state) => ({
                    scenarios: state.scenarios.filter((scenario) => scenario.id !== id),
                })),

            updateScenario: (id, updates) =>
                set((state) => ({
                    scenarios: state.scenarios.map((scenario) =>
                        scenario.id === id ? { ...scenario, ...updates } : scenario
                    ),
                })),
        }),
        {
            name: 'scenarios-storage',
        }
    )
);
