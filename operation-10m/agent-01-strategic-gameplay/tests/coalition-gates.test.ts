import { describe, expect, it } from 'vitest';
import {
  computeCoalitionBalanceIndex,
  createInitialStrategicState,
  createMemoryStrategicContracts,
  getStrategicAction,
  validateAction,
} from '../src/index.ts';

describe('coalition balance gates', () => {
  it('blocks unity roundtable when coalition balance is too low', () => {
    const contracts = createMemoryStrategicContracts();
    const roundtable = getStrategicAction('sga_coalition_unity_roundtable')!;
    const state = {
      ...createInitialStrategicState(3),
      stakeholderSentiment: {
        industry: 90,
        households: 20,
        regions: 55,
        public_services: 55,
      },
    };
    expect(computeCoalitionBalanceIndex(state.stakeholderSentiment)).toBeLessThan(72);
    const issues = validateAction(
      roundtable,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      state,
    );
    expect(issues.some((i) => i.code === 'COALITION_BALANCE_TOO_LOW')).toBe(true);
  });

  it('blocks reconciliation forum when coalition is healthy', () => {
    const contracts = createMemoryStrategicContracts();
    const forum = getStrategicAction('sga_coalition_reconciliation_forum')!;
    const state = createInitialStrategicState(1);
    expect(computeCoalitionBalanceIndex(state.stakeholderSentiment)).toBeGreaterThan(44);
    const issues = validateAction(
      forum,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      state,
    );
    expect(issues.some((i) => i.code === 'COALITION_NOT_IN_CRISIS')).toBe(true);
  });
});
