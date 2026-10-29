import { describe, expect, it, beforeEach } from 'vitest';
import { createMemoryStrategicContracts } from '../src/adapters/memory-contracts.ts';
import { getStrategicAction } from '../src/catalog/strategic-action-catalog.ts';
import { validatePrerequisites } from '../src/engine/action-prerequisites.ts';
import { resetDelayedEffectSequence } from '../src/engine/delayed-effects.ts';
import {
  createInitialStrategicState,
  executeStrategicAction,
} from '../src/engine/strategic-gameplay-engine.ts';
import { validateAction } from '../src/engine/validation.ts';

describe('action prerequisites', () => {
  beforeEach(() => resetDelayedEffectSequence(0));

  it('blocks resilience compact until prerequisites complete', () => {
    const contracts = createMemoryStrategicContracts();
    const compact = getStrategicAction('sga_national_resilience_compact')!;
    const state = createInitialStrategicState(1);
    const issues = validateAction(compact, contracts, { actionsUsedThisTurn: 0, actionsPerTurn: 5 }, [], state);
    expect(issues.some((i) => i.code === 'MISSING_PREREQUISITES')).toBe(true);
    expect(validatePrerequisites(state, compact)[0].message).toContain('sga_energy_resilience_reserve');
  });

  it('allows compact after prerequisite actions executed', () => {
    const contracts = createMemoryStrategicContracts();
    const budget = { actionsUsedThisTurn: 0, actionsPerTurn: 5 };
    let state = createInitialStrategicState(1);
    state = executeStrategicAction(
      state,
      getStrategicAction('sga_supply_chain_buffer')!,
      contracts,
      budget,
      null,
    ).state;
    state = executeStrategicAction(
      state,
      getStrategicAction('sga_energy_resilience_reserve')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 5 },
      null,
    ).state;
    const compact = getStrategicAction('sga_national_resilience_compact')!;
    const issues = validateAction(
      compact,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 5 },
      [],
      state,
    );
    expect(issues.some((i) => i.code === 'MISSING_PREREQUISITES')).toBe(false);
  });
});
