import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Edit,
    Trash2,
    Mail,
    MessageSquare,
    Settings
} from 'lucide-react';
import TemplatePage from "@/components/TemplatePage.tsx";

const DashboardPage = () => {
    const [scenarios] = useState([
        {
            id: 1,
            name: "Campagne Email Marketing",
            description: "Email + SMS de relance",
            steps: 4,
            lastModified: "Il y a 2 jours",
            status: "actif"
        },
        {
            id: 2,
            name: "Onboarding Client",
            description: "SMS bienvenue + email confirmation",
            steps: 6,
            lastModified: "Il y a 1 semaine",
            status: "draft"
        },
        {
            id: 3,
            name: "Relance Panier Abandonné",
            description: "Séquence email + SMS",
            steps: 5,
            lastModified: "Il y a 3 jours",
            status: "actif"
        }
    ]);

    const getScenarioIcon = (name: string) => {
        if (name.includes('Email')) return <Mail className="w-8 h-8 text-blue-500" />;
        if (name.includes('SMS') || name.includes('Onboarding')) return <MessageSquare className="w-8 h-8 text-green-500" />;
        return <Settings className="w-8 h-8 text-purple-500" />;
    };

    const getStatusBadge = (status: string) => {
        return status === 'actif'
            ? <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>
            : <Badge variant="secondary">Draft</Badge>;
    };

    return (
        <TemplatePage>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Mes Scénarios</h2>
                <p className="text-gray-600">Gérez vos campagnes marketing et leurs simulations</p>
            </div>

            {scenarios.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scenarios.map((scenario) => (
                        <Card key={scenario.id} className="hover:shadow-lg transition-shadow duration-200">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        {getScenarioIcon(scenario.name)}
                                        <div>
                                            <CardTitle className="text-lg">{scenario.name}</CardTitle>
                                            {getStatusBadge(scenario.status)}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-4">{scenario.description}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                    <span>{scenario.steps} étapes</span>
                                    <span>{scenario.lastModified}</span>
                                </div>

                                <div className="flex space-x-2">
                                    <Button size="sm" className="flex-1">
                                        <Edit className="w-4 h-4 mr-1" />
                                        Modifier
                                    </Button>
                                    <Button variant="destructive" size="sm">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Settings className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun scénario</h3>
                    <p className="text-gray-600 mb-6">Commencez par créer votre premier scénario marketing</p>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Créer un scénario
                    </Button>
                </div>
            )}
        </TemplatePage>
    );
};

export default DashboardPage;
