"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import TemplatePage from "@/components/templates/TemplatePage.tsx"
import type { IScenario, IStep } from "@/types/types.ts"
import { useScenario } from "@/hook/useScenario.tsx"
import { useParams, useNavigate } from "react-router"
import StepsCard from "@/components/organisms/StepsCard.tsx";

const ScenarioPage = () => {
    const [scenario, setScenario] = useState<IScenario | null>(null)

    const { scenarios, updateScenario } = useScenario()
    const { scenarioId } = useParams()
    const navigate = useNavigate()
    const scenarioNumericId = parseInt(scenarioId as string)

    useEffect(() => {
        const foundScenario = scenarios.find(s => s.id === scenarioNumericId)
        if (foundScenario) {
            setScenario(foundScenario)
        } else {
            navigate('/')
        }
    }, [scenarioId, scenarios, scenarioNumericId, navigate])

    const addStep = () => {
        if (!scenario || scenario?.steps.length >= 3) return

        const newStep: IStep = {
            id: Math.max(...scenario.steps.map(s => s.id), 0) + 1,
            name: "",
            successTransition: ""
        }

        const updatedScenario = {
            ...scenario,
            steps: [...scenario.steps, newStep]
        }

        setScenario(updatedScenario)
    }

    const removeStep = (stepId: number) => {
        if (!scenario || scenario.steps.length <= 1) return

        setScenario({
            ...scenario,
            steps: scenario.steps.filter(step => step.id !== stepId)
        })
    }

    const updateField = (stepId: number, field: keyof IStep, value: string | number) => {
        if (!scenario) return

        setScenario({
            ...scenario,
            steps: scenario.steps.map(step =>
                step.id === stepId
                    ? { ...step, [field]: value }
                    : step
            )
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!scenario) return

        const hasEmptySteps = scenario.steps.some(step => !step.name.trim())
        if (hasEmptySteps) {
            alert("Veuillez remplir tous les noms d'étapes")
            return
        }

        updateScenario(scenario.id, scenario)

        navigate('/')
    }

    const handleCancel = () => {
        navigate('/')
    }

    if (!scenario) {
        return (
            <TemplatePage>
                <div className="text-center py-12">
                    <p>Chargement du scénario...</p>
                </div>
            </TemplatePage>
        )
    }

    return (
        <TemplatePage>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Retour
                    </Button>
                    <div className="space-y-2">
                        <h2 className="text-2xl text-primary font-bold">Modifier le scénario "{scenario.name}"</h2>
                        <p className="text-muted-foreground">Configurez les étapes et transitions de votre scénario</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <StepsCard scenario={scenario} addStep={addStep} removeStep={removeStep} updateField={updateField} />
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Annuler
                        </Button>
                        <Button type="submit">Sauvegarder le scénario</Button>
                    </div>
                </form>
            </div>
        </TemplatePage>
    )
}

export default ScenarioPage
