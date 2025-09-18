import { useState } from 'react';
import { useParams } from 'react-router';
import { useScenario } from '@/hook/useScenario';
import { useSimulation } from '@/hook/useSimulation';
import { simulateScenario } from '@/utils';
import { Button } from '@/components/ui/button';
import type {IExecutionLog} from "@/types/types.ts";

const SimulationPage = () => {
    const { id } = useParams();
    const { getScenarioById } = useScenario();
    const { saveSimulationRun } = useSimulation();
    const [logs, setLogs] = useState<IExecutionLog[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const scenario = id ? getScenarioById(parseInt(id)) : null;

    const startSimulation = async () => {
        if (!scenario) return;

        setLogs([]);
        setIsRunning(true);

        try {
            const finalLogs = await simulateScenario(scenario, (updatedLogs) => {
                setLogs([...updatedLogs]);
            });
            saveSimulationRun(scenario.id, finalLogs);
        } catch (error) {
            console.error('Simulation error:', error);
        } finally {
            setIsRunning(false);
        }
    };

    if (!scenario) {
        return (
            <div className="p-4">
                <div className="text-center text-red-500">
                    Scénario introuvable
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Simulation: {scenario.name}</h1>
                <Button
                    onClick={startSimulation}
                    disabled={isRunning}
                    className={isRunning ? 'opacity-50' : ''}
                >
                    {isRunning ? 'Simulation en cours...' : 'Démarrer la simulation'}
                </Button>
            </div>

            <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-3">Journal d'exécution</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {logs.length === 0 ? (
                        <div className="text-gray-500 text-center py-8">
                            Aucune simulation en cours. Cliquez sur "Démarrer la simulation" pour commencer.
                        </div>
                    ) : (
                        logs.map((log, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 border-l-4 border-gray-300 bg-gray-50 rounded-r">
                                <div className="flex-shrink-0">
                                    <span className="font-mono text-xs text-gray-500">
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold text-gray-900">
                                            {log.step}
                                        </span>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            log.result === 'success' || log.result === 'initiated' || log.result === 'completed'
                                                ? 'bg-green-100 text-green-800' :
                                                log.result === 'failure'
                                                    ? 'bg-red-100 text-red-800' :
                                                    log.result.includes('skipped')
                                                        ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                        }`}>
                                            {log.result}
                                        </span>
                                    </div>
                                    {log.dependsOn && (
                                        <div className="text-xs text-gray-600 mt-1">
                                            Dépend de: {log.dependsOn}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {isRunning && (
                    <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-blue-500">Simulation en cours...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SimulationPage;
