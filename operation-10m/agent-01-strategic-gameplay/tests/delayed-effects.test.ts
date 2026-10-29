import { describe, expect, it, beforeEach } from 'vitest';
import { createMemoryStrategicContracts } from '../src/adapters/memory-contracts.ts';
import { getStrategicAction } from '../src/catalog/strategic-action-catalog.ts';
import {
  advanceDayAndResolveDelayed,
  resetDelayedEffectSequence,
} from '../src/engine/delayed-effects.ts';
import {
  createInitialStrategicState,
  executeStrategicAction,
} from '../src/engine/strategic-gameplay-engine.ts';

describe('delayed trade-offs', () => {
  beforeEach(() => resetDelayedEffectSequence(0));

  it('schedules effects and fires them when day advances', () => {
    const contracts = createMemoryStrategicContracts();
    let state = createInitialStrategicState(1);
    const action = getStrategicAction('sga_supply_chain_buffer')!;
    const budget = { actionsUsedThisTurn: 0, actionsPerTurn: 3 };

    const result = executeStrategicAction(state, action, contracts, budget, null, {
      delayDays: 3,
    });
    expect(result.ok).toBe(true);
    state = result.state;
    expect(state.pendingDelayed).toHaveLength(1);
    expect(state.pendingDelayed[0].firesOnDay).toBe(4);

    const treasuryBefore = contracts.economy.snapshot().treasuryReserve;
    const { state: after, fired } = advanceDayAndResolveDelayed(state, contracts, 4);
    expect(fired).toHaveLength(1);
    expect(after.pendingDelayed).toHaveLength(0);
    expect(contracts.economy.snapshot().treasuryReserve).toBe(treasuryBefore - 40_000);
    expect(contracts.uiLog.toasts.some((t) => t.title === 'Delayed trade-off')).toBe(true);
  });
});
