import React, { useMemo } from 'react';
import {
    ReactFlow,
    type Node,
    type Edge,
    Background,
    Position,
    BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { IExecutionLog, IScenario } from '@/types/types';

interface FlowChartProps {
    logs: IExecutionLog[];
    scenario: IScenario;
}

const FlowChart: React.FC<FlowChartProps> = ({ logs, scenario }) => {
    const nodes = useMemo(() => {
        return scenario.steps.map((step, index) => {
            const log = logs.find(l => l.id === step.id);

            const bgColor = log
                ? log.result === 'failure'
                    ? '#fca5a5'
                    : log.result.includes('skipped')
                        ? '#fde68a'
                        : '#bbf7d0'
                : '#e5e7eb';


            let x = (index % 3) * 180;
            let y = Math.floor(index / 3) * 120;

            if (step.name === 'start') {
                y = 0;
                x = 180;
            } else if (step.name === 'end') {
                y = 350;
                x = 180;
            } else {
                y += 120;
            }

            return {
                id: step.id.toString(),
                type: 'default',
                position: { x, y },
                data: { label: `${step.name}${log ? ` (${log.result})` : ''}` },
                style: {
                    background: bgColor,
                    border: '1px solid #9ca3af',
                    borderRadius: 8,
                    width: 120,
                    height: 60,
                    fontSize: '12px'
                },
                sourcePosition: Position.Bottom,
                targetPosition: Position.Top,
            } satisfies Node;
        });
    }, [scenario.steps, logs]);

    const edges = useMemo(() => {
        const edgesList: Edge[] = [];

        scenario.steps.forEach(step => {
            let nextSteps: typeof scenario.steps = [];

            if (step.name === 'start') {
                nextSteps = scenario.steps.filter(s => !s.dependsOn && s.name !== 'start' && s.name !== 'end');
            } else if (step.nextStep) {
                const nextStep = scenario.steps.find(s => s.name === step.nextStep && s.dependsOn === step.name
                    || s.name === 'end');
                if (nextStep) nextSteps = [nextStep];
            }

            nextSteps.forEach(ns => {
                const log = logs.find(l => l.id === step.id);
                let stroke = '#6b7280';
                let animated = false;

                if (log) {
                    if (log.result === 'success' || log.result === 'initiated') {
                        stroke = '#16a34a';
                        animated = true;
                    } else if (log.result === 'failure') {
                        stroke = '#dc2626';
                    }
                }

                edgesList.push({
                    id: `${step.id}-${ns.id}`,
                    source: step.id.toString(),
                    target: ns.id.toString(),
                    type: 'smoothstep',
                    animated,
                    style: { stroke, strokeWidth: 2 }
                } satisfies Edge);
            });
        });
        return edgesList;
    }, [scenario, logs]);
    return (
        <div className="w-full h-full">
            <ReactFlow nodes={nodes} edges={edges} fitView>
                <Background variant={BackgroundVariant.Dots} />
            </ReactFlow>
        </div>
    );
};

export default FlowChart;
