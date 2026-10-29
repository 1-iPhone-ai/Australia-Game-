import { describe, expect, it, beforeEach } from 'vitest';
import { createMemoryStrategicContracts } from '../src/adapters/memory-contracts.ts';
import {
  MULTI_STAGE_CHOICE_CATALOG,
  getStrategicAction,
} from '../src/catalog/strategic-action-catalog.ts';
import { resetDelayedEffectSequence } from '../src/engine/delayed-effects.ts';
import {
  advanceMultiStageChoice,
  beginMultiStageChoice,
  createInitialStrategicState,
  executeStrategicAction,
} from '../src/engine/strategic-gameplay-engine.ts';

describe('multi-stage choice flow', () => {
  beforeEach(() => resetDelayedEffectSequence(0));

  it('walks scope → finance → confirm and resolves action', () => {
    const choice = MULTI_STAGE_CHOICE_CATALOG.msc_water_commitment;
    const contracts = createMemoryStrategicContracts();
    const budget = { actionsUsedThisTurn: 0, actionsPerTurn: 5 };
    let state = beginMultiStageChoice(createInitialStrategicState(1), choice);

    let step = advanceMultiStageChoice(state, choice, 'scope_national', contracts, budget);
    expect(step.issues ?? []).toHaveLength(0);
    state = step.state;
    expect(state.activeChoice?.stageId).toBe('stage_finance');

    step = advanceMultiStageChoice(state, choice, 'finance_treasury', contracts, budget);
    state = step.state;
    expect(state.activeChoice?.stageId).toBe('stage_confirm');

    step = advanceMultiStageChoice(state, choice, 'confirm_execute', contracts, budget);
    expect(step.resolvedActionId).toBe('sga_water_grid_upgrade');
    state = step.state;
    expect(state.activeChoice).toBeNull();

    const action = getStrategicAction(step.resolvedActionId!)!;
    const exec = executeStrategicAction(state, action, contracts, budget, {
      day: 1,
      playerFocusId: 'water_security',
      priorities: [
        {
          id: 'water_security',
          title: 'Water Security',
          urgency: 'urgent',
          progress: 30,
          isPrimary: true,
        },
      ],
    });
    expect(exec.ok).toBe(true);
    expect(contracts.population.snapshot().essentialAccessIndex).toBeGreaterThan(70);
    expect(exec.state.pendingDelayed.length).toBeGreaterThan(0);
  });

  it('blocks confirm when affordability stress is too high', () => {
    const choice = MULTI_STAGE_CHOICE_CATALOG.msc_water_commitment;
    const contracts = createMemoryStrategicContracts({
      population: { affordabilityStress: 90 },
    });
    const budget = { actionsUsedThisTurn: 0, actionsPerTurn: 5 };
    let state = beginMultiStageChoice(createInitialStrategicState(1), choice);
    state = advanceMultiStageChoice(state, choice, 'scope_regional', contracts, budget).state;
    state = advanceMultiStageChoice(state, choice, 'finance_bonds', contracts, budget).state;
    const step = advanceMultiStageChoice(state, choice, 'confirm_execute', contracts, budget);
    expect(step.resolvedActionId).toBeUndefined();
    expect(step.issues?.some((i) => i.code === 'POPULATION_STRESS')).toBe(true);
  });
});
