import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {MessageSquare, Trash2} from "lucide-react";
import type {IScenario} from "@/types/types.ts";
import {useScenario} from "@/hook/useScenario.tsx";

interface ScenarioCardProps {
    scenario: IScenario;
}

const ScenarioCard = ({scenario}: ScenarioCardProps) => {

    const { removeScenario } = useScenario();

    return (
        <Card key={scenario.id} className="hover:shadow-lg transition-shadow duration-200 w-full">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                        <MessageSquare className="w-8 h-8 text-green-500"/>
                        <p className="text-gray-900">{scenario.name}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{scenario.steps.length} étapes</span>
                </div>

                <div className="flex space-x-2">
                    <Button size="sm" onClick={() => {}}>
                        <p> Modifier </p>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => {
                        if (window.confirm(`Êtes-vous sûr de vouloir supprimer le scénario "${scenario.name}" ?`)) {
                            removeScenario(scenario.id);
                        }
                    }}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default ScenarioCard;
