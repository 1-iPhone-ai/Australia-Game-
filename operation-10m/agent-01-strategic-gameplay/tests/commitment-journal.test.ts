import { describe, expect, it, beforeEach } from 'vitest';
import { createMemoryStrategicContracts } from '../src/adapters/memory-contracts.ts';
import {
  getStrategicAction,
  listStrategicActions,
} from '../src/catalog/strategic-action-catalog.ts';
import {
  appendJournalEntry,
  computeCommitmentPressure,
} from '../src/engine/commitment-journal.ts';
import { resetDelayedEffectSequence } from '../src/engine/delayed-effects.ts';
import {
  createInitialStrategicState,
  executeStrategicAction,
} from '../src/engine/strategic-gameplay-engine.ts';

describe('commitment journal', () => {
  beforeEach(() => resetDelayedEffectSequence(0));

  it('records journal entries after successful execution', () => {
    const contracts = createMemoryStrategicContracts();
    const state = createInitialStrategicState(2);
    const action = getStrategicAction('sga_supply_chain_buffer')!;
    const result = executeStrategicAction(
      state,
      action,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.journal).toHaveLength(1);
    expect(result.state.journal[0].actionId).toBe(action.id);
  });

  it('increases commitment pressure with pending trade-offs', () => {
    let state = createInitialStrategicState(1);
    state = appendJournalEntry(
      state,
      getStrategicAction('sga_supply_chain_buffer')!,
      'moderate',
      1,
    );
    state = {
      ...state,
      pendingDelayed: [
        {
          id: 'x',
          firesOnDay: 4,
          sourceActionId: 'sga_supply_chain_buffer',
          label: 'test',
          warning: 'w',
          effects: {},
        },
      ],
    };
    expect(computeCommitmentPressure(state)).toBeGreaterThan(10);
  });

  it('blocks repeat of non-repeatable strategic action', () => {
    const contracts = createMemoryStrategicContracts();
    const action = getStrategicAction('sga_water_grid_upgrade')!;
    const budget = { actionsUsedThisTurn: 0, actionsPerTurn: 5 };
    let state = createInitialStrategicState(1);
    const first = executeStrategicAction(state, action, contracts, budget, null);
    expect(first.ok).toBe(true);
    state = first.state;
    const second = executeStrategicAction(state, action, contracts, budget, null);
    expect(second.ok).toBe(false);
    expect(second.issues?.some((i) => i.code === 'ALREADY_COMPLETED')).toBe(true);
  });
});

describe('catalog depth', () => {
  it('ships twelve strategic actions after round 5 expansion', () => {
    expect(listStrategicActions().length).toBe(12);
  });
});
