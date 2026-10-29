import { describe, expect, it } from 'vitest';
import {
  applyStakeholderReaction,
  createDefaultStakeholderSentiment,
  createInitialStrategicState,
  executeStrategicAction,
  stakeholderApprovalPenalty,
  validateAction,
} from '../src/index.ts';
import { createMemoryStrategicContracts } from '../src/adapters/memory-contracts.ts';
import { getStrategicAction } from '../src/catalog/strategic-action-catalog.ts';

describe('stakeholder coalition', () => {
  it('shifts sentiment after infrastructure actions', () => {
    const action = getStrategicAction('sga_water_grid_upgrade')!;
    const before = createDefaultStakeholderSentiment();
    const state = applyStakeholderReaction(createInitialStrategicState(1), action);
    expect(state.stakeholderSentiment!.regions).toBeGreaterThan(before.regions);
  });

  it('blocks actions when sentiment drives approval floor above rating', () => {
    const contracts = createMemoryStrategicContracts();
    contracts.government.applyPatch({ approvalDelta: -20 });
    let state = createInitialStrategicState(1);
    state = {
      ...state,
      stakeholderSentiment: {
        industry: 30,
        households: 30,
        regions: 30,
        public_services: 30,
      },
    };
    const action = getStrategicAction('sga_freight_corridor_modernization')!;
    const penalty = stakeholderApprovalPenalty(state, action);
    expect(penalty).toBeGreaterThan(0);
    const issues = validateAction(
      action,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      state,
    );
    expect(issues.some((i) => i.code === 'STAKEHOLDER_OPPOSITION')).toBe(true);
  });

  it('updates sentiment on successful execution', () => {
    const contracts = createMemoryStrategicContracts();
    const action = getStrategicAction('sga_supply_chain_buffer')!;
    const result = executeStrategicAction(
      createInitialStrategicState(1),
      action,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.stakeholderSentiment!.households).toBeGreaterThan(55);
  });
});
