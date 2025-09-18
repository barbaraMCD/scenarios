import React, { useMemo } from 'react';
import {
    ReactFlow,
    type Node,
    type Edge,
    Controls,
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
            const logEntry = logs.find(log => log.id === step.id);

            let nodeColor = '#f3f4f6';
            let borderColor = '#9ca3af';
            let textColor = '#374151';

            if (logEntry) {
                switch (logEntry.result) {
                    case 'success':
                    case 'initiated':
                    case 'completed':
                        nodeColor = '#dcfce7';
                        borderColor = '#16a34a';
                        textColor = '#15803d';
                        break;
                    case 'failure':
                        nodeColor = '#fecaca';
                        borderColor = '#dc2626';
                        textColor = '#dc2626';
                        break;
                    default:
                        if (logEntry.result.includes('skipped')) {
                            nodeColor = '#fef3c7';
                            borderColor = '#d97706';
                            textColor = '#d97706';
                        }
                }
            }

            return {
                id: step.id.toString(),
                type: 'default',
                position: {
                    x: (index % 4) * 180,
                    y: Math.floor(index / 4) * 120
                },
                data: {
                    label: (
                        <div className="text-center p-2">
                            <div className="font-semibold text-sm" style={{ color: textColor }}>
                                {step.name}
                            </div>
                            {logEntry && (
                                <div className="text-xs mt-1" style={{ color: textColor }}>
                                    {logEntry.result}
                                </div>
                            )}
                            {step.dependsOn && (
                                <div className="text-xs text-gray-500 mt-1">
                                    ← {step.dependsOn}
                                </div>
                            )}
                        </div>
                    )
                },
                style: {
                    background: nodeColor,
                    border: `2px solid ${borderColor}`,
                    borderRadius: 8,
                    width: 140,
                    height: 80,
                    fontSize: '12px'
                },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
            } satisfies Node;
        });
    }, [scenario.steps, logs]);

    const edges = useMemo(() => {
        const edgesList: Edge[] = [];

        scenario.steps.forEach((step) => {
            if (step.nextStep) {
                let nextStep;
                if (step.nextStep === 'end') {
                    nextStep = scenario.steps.find(s => s.name === 'end');
                } else {
                    nextStep = scenario.steps.find(s =>
                        s.name === step.nextStep &&
                        s.dependsOn === step.name
                    );
                }

                if (nextStep) {
                    const logEntry = logs.find(log => log.id === step.id);
                    let edgeColor = '#9ca3af';
                    let animated = false;

                    if (logEntry) {
                        if (logEntry.result === 'success' || logEntry.result === 'initiated') {
                            edgeColor = '#16a34a';
                            animated = true;
                        } else if (logEntry.result === 'failure') {
                            edgeColor = '#dc2626';
                        }
                    }

                    edgesList.push({
                        id: `${step.id}-${nextStep.id}`,
                        source: step.id.toString(),
                        target: nextStep.id.toString(),
                        style: {
                            stroke: edgeColor,
                            strokeWidth: 2
                        },
                        animated: animated,
                        type: 'smoothstep'
                    } satisfies Edge);
                }
            }
        });

        return edgesList;
    }, [scenario.steps, logs]);

    return (
        <div className="w-full h-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                fitViewOptions={{ padding: 0.2 }}
            >
                <Controls />
                <Background variant={BackgroundVariant.Dots} />
            </ReactFlow>
        </div>
    );
};

export default FlowChart;
