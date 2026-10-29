import { describe, expect, it } from 'vitest';
import { AGENT_01_MODULE_ID, listStrategicActions } from '../src/index.ts';

describe('module surface', () => {
  it('exports stable module id and non-empty catalog', () => {
    expect(AGENT_01_MODULE_ID).toBe('operation-10m/agent-01-strategic-gameplay');
    expect(listStrategicActions().length).toBeGreaterThanOrEqual(11);
  });
});
