import TemplatePage from "@/components/templates/TemplatePage.tsx";
import { useScenario } from '@/hook/useScenario';
import { useSimulation } from '@/hook/useSimulation';
import FlowChart from '@/components/organisms/FlowChart';

const GraphPage = () => {
    const { scenarios } = useScenario();
    const { getAllSimulationRuns } = useSimulation();

    const allRuns = getAllSimulationRuns();

    if (allRuns.length === 0) {
        return (
            <TemplatePage>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-2">Aucune simulation</h2>
                    <p className="text-gray-600">Lancez des simulations pour voir les graphiques.</p>
                </div>
            </TemplatePage>
        );
    }

    return (
        <TemplatePage>
            <h2 className="text-3xl font-bold mb-6">Historique des Simulations</h2>

            <div className="space-y-6">
                {allRuns.map((run) => {
                    const scenario = scenarios.find(s => s.id === run.scenarioId);

                    return (
                        <div key={run.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">{scenario?.name}</h3>
                                <span className="text-sm text-gray-500">
                                    {new Date(run.id).toLocaleString()}
                                </span>
                            </div>

                            <div className="h-64 border rounded">
                                <FlowChart logs={run.logs} scenario={scenario!} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </TemplatePage>
    );
};

export default GraphPage;
