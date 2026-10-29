import { describe, expect, it } from 'vitest';
import {
  buildTurnStrategicBriefing,
  createInitialStrategicState,
  executeStrategicAction,
} from '../src/index.ts';
import { createMemoryStrategicContracts } from '../src/adapters/memory-contracts.ts';
import { getStrategicAction } from '../src/catalog/strategic-action-catalog.ts';

describe('turn strategic briefing', () => {
  it('summarizes pressure, mandate, and top feasible recommendation', () => {
    const contracts = createMemoryStrategicContracts();
    let state = createInitialStrategicState(2);
    state = executeStrategicAction(
      state,
      getStrategicAction('sga_supply_chain_buffer')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    ).state;
    const briefing = buildTurnStrategicBriefing(state, contracts, null, {
      actionsUsedThisTurn: 1,
      actionsPerTurn: 3,
    });
    expect(briefing.day).toBe(2);
    expect(briefing.completedActionCount).toBe(1);
    expect(briefing.mandateHeadline.length).toBeGreaterThan(10);
    expect(briefing.topRecommendationTitle).toBeDefined();
  });
});
