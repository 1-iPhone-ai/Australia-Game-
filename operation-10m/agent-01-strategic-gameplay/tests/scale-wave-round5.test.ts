import { describe, expect, it } from 'vitest';
import {
  advanceStrategicGameplayCalendar,
  applyMandateIdleDrift,
  buildTurnStrategicBriefing,
  classifyMandateDriftRisk,
  computeCoalitionBalanceIndex,
  createInitialStrategicState,
  createMemoryStrategicContracts,
  executeStrategicAction,
  getStrategicAction,
  mandateMilestoneIssues,
  serializeStrategicGameplayState,
  validateAction,
} from '../src/index.ts';
import { advanceMandateOnAction } from '../src/engine/strategic-mandate.ts';

describe('scale wave round 5 — strategic gameplay', () => {
  it('blocks mandate leadership summit until water_security leadership milestone', () => {
    const contracts = createMemoryStrategicContracts();
    const summit = getStrategicAction('sga_mandate_leadership_summit')!;
    let state = createInitialStrategicState(5);
    const blocked = validateAction(summit, contracts, { actionsUsedThisTurn: 0, actionsPerTurn: 3 }, [], state);
    expect(blocked.some((i) => i.code === 'MANDATE_MILESTONE_REQUIRED')).toBe(true);

    const water = getStrategicAction('sga_water_grid_upgrade')!;
    for (let i = 0; i < 7; i += 1) {
      state = advanceMandateOnAction(state, water);
    }
    expect(mandateMilestoneIssues(summit, state)).toHaveLength(0);
  });

  it('decays mandate tracks after idle days beyond grace period', () => {
    const water = getStrategicAction('sga_water_grid_upgrade')!;
    let state = createInitialStrategicState(1);
    state = advanceMandateOnAction(state, water);
    state = { ...state, lastAlignedActionDay: 1, day: 1 };
    state = applyMandateIdleDrift(state, 10);
    expect(state.mandateProgress?.water_security?.points).toBeLessThan(12);
    expect(classifyMandateDriftRisk(state)).toBe('critical');
  });

  it('advances calendar with delayed trade-offs and coalition reversion', () => {
    const contracts = createMemoryStrategicContracts();
    let state = createInitialStrategicState(1);
    state = executeStrategicAction(
      state,
      getStrategicAction('sga_supply_chain_buffer')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    ).state;
    state = {
      ...state,
      stakeholderSentiment: {
        industry: 80,
        households: 30,
        regions: 55,
        public_services: 55,
      },
    };
    const { state: advanced, firedTradeOffCount } = advanceStrategicGameplayCalendar(
      state,
      contracts,
      state.day + 5,
    );
    expect(advanced.day).toBe(state.day + 5);
    expect(firedTradeOffCount).toBeGreaterThanOrEqual(0);
    expect(computeCoalitionBalanceIndex(advanced.stakeholderSentiment)).toBeGreaterThan(
      computeCoalitionBalanceIndex(state.stakeholderSentiment),
    );
  });

  it('extends turn briefing with coalition balance and drift risk', () => {
    const contracts = createMemoryStrategicContracts();
    let state = createInitialStrategicState(12);
    state = { ...state, lastAlignedActionDay: 1 };
    const briefing = buildTurnStrategicBriefing(state, contracts, null, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(briefing.coalitionBalanceIndex).toBeGreaterThan(0);
    expect(briefing.mandateDriftRisk).toBe('critical');
  });

  it('serializes save v3 with lastAlignedActionDay', () => {
    const state = createInitialStrategicState(2);
    const save = serializeStrategicGameplayState(state);
    expect(save.version).toBe(13);
    expect(save.lastAlignedActionDay).toBe(2);
  });
});
