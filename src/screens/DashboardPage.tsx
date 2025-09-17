import { Button } from '@/components/ui/button';
import {
    Plus,
    Settings
} from 'lucide-react';
import TemplatePage from "@/components/templates/TemplatePage.tsx";
import ScenarioCard from "@/components/organisms/ScenarioCard.tsx";
import {useScenario} from "@/hook/useScenario.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {useState} from "react";
import { useNavigate } from 'react-router';

const DashboardPage = () => {
    const { scenarios } = useScenario();
    const navigate = useNavigate();
    const [selectedScenario, setSelectedScenario] = useState<string | undefined>(undefined);

    return (
        <TemplatePage>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Mes Scénarios</h2>
                <p className="text-gray-600">Gérez vos campagnes marketing et leurs simulations</p>
            </div>
            <div className="flex justify-between p-4">
                {scenarios.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {scenarios.map((scenario) => (
                            <ScenarioCard key={scenario.id} scenario={scenario} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Settings className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun scénario</h3>
                        <p className="text-gray-600 mb-6">Commencez par créer votre premier scénario marketing</p>
                        <Button
                            onClick={() => navigate('/scenario/create')}>
                            <Plus className="w-4 h-4 mr-2" />
                            Créer un scénario
                        </Button>
                    </div>
                )}

                <div className="flex flex-col gap-2 flex-1 justify-center items-center p-2">
                    <Select
                        value={selectedScenario}
                        onValueChange={(value) => setSelectedScenario(value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choisir un scénario"/>
                        </SelectTrigger>
                        <SelectContent>
                            {scenarios.map((scenario) => (
                                <SelectItem key={scenario.id} value={scenario.id.toString()}>
                                    {scenario.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button>
                        <p> Start </p>
                    </Button>
                </div>
            </div>
        </TemplatePage>
    );
};

export default DashboardPage;
