import { describe, it, expect, vi } from 'vitest';
import { simulateScenario } from '../utils';
import type {IScenario, IStep} from '@/types/types';

const simpleScenario: IScenario = {
    id: Date.now(),
    name: 'Scenario',
    steps: [
        { id: 1, name: 'start', nextStep: null },
        { id: 2, name: 'sms', nextStep: "end"},
        { id: 3, name: 'end', nextStep: null}
    ]
};

describe('simulateScenario', () => {
    it('check callback on simulation', async () => {
        const onLog = vi.fn();
        await simulateScenario(simpleScenario, onLog);
        expect(onLog).toHaveBeenCalled();
        expect(onLog).toHaveBeenCalledTimes(3);

        onLog.mock.calls.forEach(call => {
            call[0].forEach((logEntry: IStep) => {
                expect(logEntry).toHaveProperty('step');
                expect(logEntry).toHaveProperty('id');
                expect(logEntry).toHaveProperty('timestamp');
                expect(logEntry).toHaveProperty('dependsOn');
                expect(logEntry).toHaveProperty('result');
            });
        });

        const startStep = onLog.mock.calls[2][0][0];

        expect(startStep).toHaveProperty('step', 'start');
        expect(startStep).toHaveProperty('result', 'initiated');
        expect(startStep).toHaveProperty('dependsOn', null);

        const smsStep = onLog.mock.calls[2][0][1];

        expect(smsStep).toHaveProperty('step', 'sms');
        expect(smsStep).toHaveProperty('result', 'success');
        expect(smsStep).toHaveProperty('dependsOn', undefined);

        const endStep = onLog.mock.calls[2][0][2];

        expect(endStep).toHaveProperty('step', 'end');
        expect(endStep).toHaveProperty('result', 'completed');
        expect(endStep).toHaveProperty('dependsOn', null);

    });
});
