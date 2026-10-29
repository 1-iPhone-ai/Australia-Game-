import { describe, expect, it } from 'vitest';
import { createInitialStrategicState, executeStrategicAction } from '../src/engine/strategic-gameplay-engine.ts';
import {
  deserializeStrategicGameplayState,
  mergeStrategicSaveIntoState,
  serializeStrategicGameplayState,
} from '../src/engine/strategic-save.ts';
import { createMemoryStrategicContracts } from '../src/adapters/memory-contracts.ts';
import { getStrategicAction } from '../src/catalog/strategic-action-catalog.ts';

describe('strategic save v1', () => {
  it('round-trips state through serialize/deserialize', () => {
    const contracts = createMemoryStrategicContracts();
    let state = createInitialStrategicState(3);
    state = executeStrategicAction(
      state,
      getStrategicAction('sga_supply_chain_buffer')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    ).state;
    const save = serializeStrategicGameplayState(state);
    expect(save.version).toBe(21);
    const restored = deserializeStrategicGameplayState(save);
    expect(restored.completedActionIds).toEqual(state.completedActionIds);
    expect(restored.pendingDelayed.length).toBe(state.pendingDelayed.length);
    expect(restored.journal.length).toBe(1);
    expect(restored.stakeholderSentiment).toBeDefined();
  });

  it('upgrades v1 saves with default coalition fields', () => {
    const v1 = {
      version: 1 as const,
      day: 4,
      completedActionIds: ['sga_supply_chain_buffer'],
      pendingDelayed: [],
      journal: [],
      priorityMomentum: {},
      actionCooldowns: {},
      activeChoice: null,
    };
    const restored = deserializeStrategicGameplayState(v1);
    expect(restored.mandateProgress).toEqual({});
    expect(restored.stakeholderSentiment?.industry).toBe(55);
  });

  it('merge preserves newer day', () => {
    const base = createInitialStrategicState(1);
    const save = serializeStrategicGameplayState({ ...base, day: 9, completedActionIds: ['a'] });
    const merged = mergeStrategicSaveIntoState(base, save);
    expect(merged.day).toBe(9);
    expect(merged.completedActionIds).toEqual(['a']);
  });
});
