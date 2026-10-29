import { describe, expect, it, beforeEach } from 'vitest';
import { createMemoryStrategicContracts } from '../src/adapters/memory-contracts.ts';
import { getStrategicAction } from '../src/catalog/strategic-action-catalog.ts';
import { resetDelayedEffectSequence } from '../src/engine/delayed-effects.ts';
import {
  applyPriorityMomentum,
  priorityMomentumBonus,
} from '../src/engine/priority-momentum.ts';
import {
  createInitialStrategicState,
  executeStrategicAction,
} from '../src/engine/strategic-gameplay-engine.ts';

describe('priority momentum', () => {
  beforeEach(() => resetDelayedEffectSequence(0));

  it('accumulates momentum on aligned priorities after execution', () => {
    const contracts = createMemoryStrategicContracts();
    let state = createInitialStrategicState(1);
    const action = getStrategicAction('sga_freight_corridor_modernization')!;
    state = executeStrategicAction(state, action, contracts, { actionsUsedThisTurn: 0, actionsPerTurn: 5 }, null).state;
    expect(state.priorityMomentum.freight_modernization).toBeGreaterThanOrEqual(8);
  });

  it('increases recommendation score via momentum bonus', () => {
    let state = createInitialStrategicState(1);
    const action = getStrategicAction('sga_supply_chain_buffer')!;
    state = applyPriorityMomentum(state, action);
    state = applyPriorityMomentum(state, action);
    expect(priorityMomentumBonus(state, action)).toBeGreaterThanOrEqual(1);
  });
});
