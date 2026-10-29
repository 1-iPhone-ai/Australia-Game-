import { describe, expect, it } from 'vitest';
import { createMemoryStrategicContracts } from '../src/adapters/memory-contracts.ts';
import { MULTI_STAGE_CHOICE_CATALOG } from '../src/catalog/strategic-action-catalog.ts';
import {
  advanceMultiStageChoice,
  beginMultiStageChoice,
  createInitialStrategicState,
} from '../src/engine/strategic-gameplay-engine.ts';

describe('msc_freight_corridor', () => {
  it('resolves to freight modernization action', () => {
    const choice = MULTI_STAGE_CHOICE_CATALOG.msc_freight_corridor;
    const contracts = createMemoryStrategicContracts();
    const budget = { actionsUsedThisTurn: 0, actionsPerTurn: 5 };
    let state = beginMultiStageChoice(createInitialStrategicState(1), choice);
    state = advanceMultiStageChoice(state, choice, 'route_coastal', contracts, budget).state;
    state = advanceMultiStageChoice(state, choice, 'risk_mitigate', contracts, budget).state;
    const step = advanceMultiStageChoice(state, choice, 'freight_execute', contracts, budget);
    expect(step.resolvedActionId).toBe('sga_freight_corridor_modernization');
  });
});
