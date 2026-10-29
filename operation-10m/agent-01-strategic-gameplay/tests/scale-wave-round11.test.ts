import { describe, expect, it } from 'vitest';
import {
  advanceStrategicGameplayCalendar,
  buildExternalCoalitionTurnSignals,
  buildTurnStrategicBriefing,
  createInitialStrategicState,
  createMemoryStrategicContracts,
  executeStrategicAction,
  getStrategicAction,
  INTEGRATED_COALITION_MATURITY_THRESHOLD,
  INTEGRATED_CROSS_MODULE_SYNC_MIN,
  isIntegratedCoalitionMaturity,
  POST_STABILIZATION_LOCK_IN_THRESHOLD,
  serializeStrategicGameplayState,
  validateAction,
} from '../src/index.ts';
import { advanceMandateOnAction } from '../src/engine/strategic-mandate.ts';

describe('scale wave round 11 — integrated coalition maturity', () => {
  const inbound = { postQueueCalm: true, pendingStabilizationWave: true };

  it('blocks maturity compact until integrated streak reaches threshold', () => {
    const contracts = createMemoryStrategicContracts();
    const compact = getStrategicAction('sga_coalition_integrated_maturity_compact')!;
    const blocked = validateAction(
      compact,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      { ...createInitialStrategicState(4), integratedCoalitionMaturityStreakDays: 1 },
    );
    expect(blocked.some((i) => i.code === 'INTEGRATED_COALITION_MATURITY_TOO_LOW')).toBe(true);
  });

  it('accumulates integrated maturity when lock-in and cross-module sync align', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(1),
      coalitionVolatilityEvents: 0,
      coalitionStabilizationStreakDays: 3,
      coalitionLockInStreakDays: POST_STABILIZATION_LOCK_IN_THRESHOLD,
      crossModuleSyncStreakDays: INTEGRATED_CROSS_MODULE_SYNC_MIN,
    };
    const { state: advanced } = advanceStrategicGameplayCalendar(state, contracts, 3, inbound);
    expect(advanced.integratedCoalitionMaturityStreakDays).toBe(2);
    expect(isIntegratedCoalitionMaturity(advanced)).toBe(true);
  });

  it('applies mandate bonus during integrated coalition maturity', () => {
    const contracts = createMemoryStrategicContracts();
    let state = createInitialStrategicState(1);
    state = advanceMandateOnAction(state, getStrategicAction('sga_supply_chain_buffer')!);
    const beforePoints = state.mandateProgress?.supply_chain_security?.points ?? 0;
    state = {
      ...state,
      coalitionVolatilityEvents: 0,
      coalitionStabilizationStreakDays: 3,
      coalitionLockInStreakDays: POST_STABILIZATION_LOCK_IN_THRESHOLD,
      crossModuleSyncStreakDays: INTEGRATED_CROSS_MODULE_SYNC_MIN,
      integratedCoalitionMaturityStreakDays: INTEGRATED_COALITION_MATURITY_THRESHOLD,
    };
    const { state: afterCalendar } = advanceStrategicGameplayCalendar(state, contracts, 3, inbound);
    const afterPoints = afterCalendar.mandateProgress?.supply_chain_security?.points ?? 0;
    expect(afterPoints).toBeGreaterThan(beforePoints);
  });

  it('exports integrated maturity on outbound coalition signals', () => {
    const state = {
      ...createInitialStrategicState(5),
      integratedCoalitionMaturityStreakDays: INTEGRATED_COALITION_MATURITY_THRESHOLD,
    };
    const signals = buildExternalCoalitionTurnSignals(state);
    expect(signals.integratedCoalitionMaturity).toBe(true);
    expect(signals.integratedCoalitionMaturityStreakDays).toBe(
      INTEGRATED_COALITION_MATURITY_THRESHOLD,
    );
  });

  it('clears integrated maturity streak after maturity compact executes', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(2),
      coalitionVolatilityEvents: 0,
      coalitionStabilizationStreakDays: 3,
      integratedCoalitionMaturityStreakDays: 2,
    };
    const result = executeStrategicAction(
      state,
      getStrategicAction('sga_coalition_integrated_maturity_compact')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.integratedCoalitionMaturityStreakDays).toBe(0);
  });

  it('extends turn briefing with integrated maturity fields', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(3),
      integratedCoalitionMaturityStreakDays: INTEGRATED_COALITION_MATURITY_THRESHOLD,
    };
    const briefing = buildTurnStrategicBriefing(state, contracts, null, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(briefing.integratedCoalitionMaturity).toBe(true);
    expect(briefing.integratedCoalitionMaturityStreakDays).toBe(
      INTEGRATED_COALITION_MATURITY_THRESHOLD,
    );
  });

  it('serializes save v9 with integratedCoalitionMaturityStreakDays', () => {
    const state = {
      ...createInitialStrategicState(5),
      integratedCoalitionMaturityStreakDays: 4,
    };
    const save = serializeStrategicGameplayState(state);
    expect(save.version).toBe(39);
    expect(save.integratedCoalitionMaturityStreakDays).toBe(4);
  });
});
