import { describe, expect, it } from 'vitest';
import {
  advanceStrategicGameplayCalendar,
  buildTurnStrategicBriefing,
  createInitialStrategicState,
  createMemoryStrategicContracts,
  executeStrategicAction,
  getStrategicAction,
  isElevatedCoalitionVolatility,
  ELEVATED_COALITION_VOLATILITY_THRESHOLD,
  COALITION_STABILIZATION_STREAK_THRESHOLD,
  serializeStrategicGameplayState,
  validateAction,
} from '../src/index.ts';
import { advanceMandateOnAction } from '../src/engine/strategic-mandate.ts';

describe('scale wave round 9 — elevated volatility and stabilization accord', () => {
  it('blocks volatility mediation until volatility is elevated', () => {
    const contracts = createMemoryStrategicContracts();
    const mediation = getStrategicAction('sga_coalition_volatility_mediation')!;
    const low = {
      ...createInitialStrategicState(4),
      coalitionVolatilityEvents: 1,
    };
    const blocked = validateAction(
      mediation,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      low,
    );
    expect(blocked.some((i) => i.code === 'COALITION_VOLATILITY_TOO_LOW')).toBe(true);

    const ready = {
      ...low,
      coalitionVolatilityEvents: ELEVATED_COALITION_VOLATILITY_THRESHOLD,
    };
    const ok = validateAction(
      mediation,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      ready,
    );
    expect(ok.some((i) => i.code === 'COALITION_VOLATILITY_TOO_LOW')).toBe(false);
  });

  it('applies mandate drag while coalition volatility stays elevated', () => {
    const contracts = createMemoryStrategicContracts();
    let state = createInitialStrategicState(1);
    state = advanceMandateOnAction(state, getStrategicAction('sga_supply_chain_buffer')!);
    const beforePoints = state.mandateProgress?.supply_chain_security?.points ?? 0;
    state = {
      ...state,
      coalitionVolatilityEvents: ELEVATED_COALITION_VOLATILITY_THRESHOLD,
    };
    const { state: afterCalendar } = advanceStrategicGameplayCalendar(state, contracts, 3);
    expect(isElevatedCoalitionVolatility(afterCalendar)).toBe(true);
    const afterPoints = afterCalendar.mandateProgress?.supply_chain_security?.points ?? 0;
    expect(afterPoints).toBeLessThan(beforePoints);
  });

  it('accumulates stabilization streak while stable with volatility on record', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(1),
      coalitionVolatilityEvents: 2,
    };
    const { state: advanced } = advanceStrategicGameplayCalendar(state, contracts, 4);
    expect(advanced.coalitionStabilizationStreakDays).toBe(3);
  });

  it('decrements volatility after mediation executes', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(2),
      coalitionVolatilityEvents: 3,
    };
    const result = executeStrategicAction(
      state,
      getStrategicAction('sga_coalition_volatility_mediation')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.coalitionVolatilityEvents).toBe(2);
  });

  it('clears volatility and stabilization streak after accord executes', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(2),
      coalitionVolatilityEvents: 2,
      coalitionStabilizationStreakDays: COALITION_STABILIZATION_STREAK_THRESHOLD,
    };
    const result = executeStrategicAction(
      state,
      getStrategicAction('sga_coalition_stabilization_accord')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.coalitionVolatilityEvents).toBe(0);
    expect(result.state.coalitionStabilizationStreakDays).toBe(0);
  });

  it('extends turn briefing with elevated volatility and stabilization streak', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(3),
      coalitionVolatilityEvents: 2,
      coalitionStabilizationStreakDays: 2,
    };
    const briefing = buildTurnStrategicBriefing(state, contracts, null, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(briefing.elevatedCoalitionVolatility).toBe(true);
    expect(briefing.coalitionStabilizationStreakDays).toBe(2);
  });

  it('serializes save v7 with coalitionStabilizationStreakDays', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionStabilizationStreakDays: 4,
    };
    const save = serializeStrategicGameplayState(state);
    expect(save.version).toBe(42);
    expect(save.coalitionStabilizationStreakDays).toBe(4);
  });
});
