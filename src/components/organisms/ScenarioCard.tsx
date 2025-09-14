import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Edit, MessageSquare, Trash2} from "lucide-react";
import type {IScenario} from "@/types/types.ts";
import {useScenario} from "@/hook/useScenario.tsx";
import {Link} from "react-router";

interface ScenarioCardProps {
    scenario: IScenario;
}

const ScenarioCard = ({scenario}: ScenarioCardProps) => {

    const { removeScenario } = useScenario();

    return (
        <Card key={scenario.id} className="hover:shadow-lg transition-shadow duration-200">
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
                    <Link to={`/scenario/${scenario.id}`}>
                        <Button size="sm" className="flex-1">
                            <Edit className="w-4 h-4 mr-1" />
                            Modifier
                        </Button>
                    </Link>
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
