import { describe, expect, it, beforeEach } from 'vitest';
import { createMemoryStrategicContracts } from '../src/adapters/memory-contracts.ts';
import { getStrategicAction } from '../src/catalog/strategic-action-catalog.ts';
import { resetDelayedEffectSequence, scheduleDelayedTradeOffs } from '../src/engine/delayed-effects.ts';
import { createInitialStrategicState } from '../src/engine/strategic-gameplay-engine.ts';
import {
  mitigateNextPendingTradeOff,
  summarizePendingTradeOffLoad,
} from '../src/engine/tradeoff-mitigation.ts';

describe('trade-off mitigation', () => {
  beforeEach(() => resetDelayedEffectSequence(0));

  it('defers the next pending trade-off', () => {
    const contracts = createMemoryStrategicContracts();
    const action = getStrategicAction('sga_supply_chain_buffer')!;
    let state = scheduleDelayedTradeOffs(createInitialStrategicState(1), action.id, action.delayedTradeOffs, 3);
    const before = state.pendingDelayed[0].firesOnDay;
    const result = mitigateNextPendingTradeOff(state, contracts, {
      apCost: 1,
      treasuryCost: 20_000,
      extraDays: 2,
    });
    expect(result.ok).toBe(true);
    expect(result.state.pendingDelayed[0].firesOnDay).toBe(before + 2);
    expect(contracts.uiLog.toasts.length).toBe(1);
  });

  it('summarizes pending load', () => {
    const action = getStrategicAction('sga_economic_diversification_pilot')!;
    const state = scheduleDelayedTradeOffs(
      createInitialStrategicState(1),
      action.id,
      action.delayedTradeOffs,
      2,
    );
    const summary = summarizePendingTradeOffLoad(state);
    expect(summary.count).toBe(2);
    expect(summary.nextFireDay).toBe(3);
  });
});
