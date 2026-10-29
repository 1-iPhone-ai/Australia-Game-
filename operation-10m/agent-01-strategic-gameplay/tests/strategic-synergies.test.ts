import { describe, expect, it, beforeEach } from 'vitest';
import { STRATEGIC_ACTION_CATALOG, getStrategicAction } from '../src/catalog/strategic-action-catalog.ts';
import { resetDelayedEffectSequence } from '../src/engine/delayed-effects.ts';
import {
  createInitialStrategicState,
  executeStrategicAction,
} from '../src/engine/strategic-gameplay-engine.ts';
import {
  applySynergyApprovalBoost,
  detectStrategicSynergies,
} from '../src/engine/strategic-synergies.ts';
import { createMemoryStrategicContracts } from '../src/adapters/memory-contracts.ts';
import { validateAction } from '../src/engine/validation.ts';

describe('strategic synergies', () => {
  beforeEach(() => resetDelayedEffectSequence(0));

  it('detects synergy when new action aligns with completed work', () => {
    let state = createInitialStrategicState(1);
    state = {
      ...state,
      completedActionIds: ['sga_supply_chain_buffer'],
    };
    const contingency = getStrategicAction('sga_supply_chain_contingency_plan')!;
    const matches = detectStrategicSynergies(state, contingency, STRATEGIC_ACTION_CATALOG);
    expect(matches.length).toBeGreaterThan(0);
    expect(applySynergyApprovalBoost(matches)).toBeGreaterThan(0);
  });

  it('applies cooldown after surge action', () => {
    const contracts = createMemoryStrategicContracts({ government: { approvalRating: 60 } });
    let state = createInitialStrategicState(5);
    const surge = getStrategicAction('sga_critical_priority_surge')!;
    state = executeStrategicAction(state, surge, contracts, { actionsUsedThisTurn: 0, actionsPerTurn: 5 }, null).state;
    const issues = validateAction(surge, contracts, { actionsUsedThisTurn: 0, actionsPerTurn: 5 }, [], state);
    expect(issues.some((i) => i.code === 'COOLDOWN_ACTIVE')).toBe(true);
    state = { ...state, day: 20, actionCooldowns: { [surge.id]: { untilDay: 10 } } };
    expect(
      validateAction(surge, contracts, { actionsUsedThisTurn: 0, actionsPerTurn: 5 }, [], state).some(
        (i) => i.code === 'COOLDOWN_ACTIVE',
      ),
    ).toBe(false);
  });
});
