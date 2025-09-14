import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IScenario } from '@/types/types';

interface ScenarioStore {
    scenarios: IScenario[];
    addScenario: (scenario: Omit<IScenario, 'id'>) => void;
    removeScenario: (id: number) => void;
    updateScenario: (id: number, updates: Partial<IScenario>) => void;
}

export const useScenario = create<ScenarioStore>()(
    persist(
        (set) => ({
            scenarios: [
                {
                    id: 1,
                    name: "Campagne Email Marketing",
                    steps: [
                        {
                            id: 1,
                            name: "sms",
                            successTransition: "end",
                            failureTransition: "email"
                        }
                    ],
                }
            ],

            addScenario: (scenarioData) =>
                set((state) => ({
                    scenarios: [
                        ...state.scenarios,
                        {
                            ...scenarioData,
                            id: Math.max(...state.scenarios.map(s => s.id), 0) + 1,
                        },
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
