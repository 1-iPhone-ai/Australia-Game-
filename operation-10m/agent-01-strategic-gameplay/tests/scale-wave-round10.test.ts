import { describe, expect, it } from 'vitest';
import {
  advanceStrategicGameplayCalendar,
  buildExternalCoalitionTurnSignals,
  buildTurnStrategicBriefing,
  createInitialStrategicState,
  createMemoryStrategicContracts,
  crossModuleStabilizationAligned,
  executeStrategicAction,
  getStrategicAction,
  isPostStabilizationLockIn,
  POST_STABILIZATION_LOCK_IN_THRESHOLD,
  COALITION_STABILIZATION_STREAK_THRESHOLD,
  serializeStrategicGameplayState,
  validateAction,
} from '../src/index.ts';

describe('scale wave round 10 — lock-in and cross-module hooks', () => {
  const inbound = { postQueueCalm: true, pendingStabilizationWave: true };

  it('blocks lock-in charter until streak and volatility cap satisfied', () => {
    const contracts = createMemoryStrategicContracts();
    const charter = getStrategicAction('sga_coalition_lock_in_charter')!;
    const blocked = validateAction(
      charter,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      { ...createInitialStrategicState(4), coalitionLockInStreakDays: 1, coalitionVolatilityEvents: 1 },
    );
    expect(blocked.some((i) => i.code === 'COALITION_LOCK_IN_STREAK_TOO_SHORT')).toBe(true);
    expect(blocked.some((i) => i.code === 'COALITION_VOLATILITY_TOO_HIGH')).toBe(true);
  });

  it('accumulates lock-in streak after stabilization matured with zero volatility', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(1),
      coalitionVolatilityEvents: 0,
      coalitionStabilizationStreakDays: COALITION_STABILIZATION_STREAK_THRESHOLD,
    };
    const { state: advanced } = advanceStrategicGameplayCalendar(state, contracts, 3);
    expect(advanced.coalitionLockInStreakDays).toBe(2);
    expect(isPostStabilizationLockIn(advanced)).toBe(true);
  });

  it('aligns cross-module stabilization when inbound Agent 02/05 flags match', () => {
    const state = {
      ...createInitialStrategicState(2),
      coalitionVolatilityEvents: 0,
      coalitionStabilizationStreakDays: COALITION_STABILIZATION_STREAK_THRESHOLD,
    };
    expect(crossModuleStabilizationAligned(state, inbound)).toBe(true);
  });

  it('accumulates cross-module sync streak on calendar with inbound flags', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(1),
      coalitionVolatilityEvents: 0,
      coalitionStabilizationStreakDays: COALITION_STABILIZATION_STREAK_THRESHOLD,
    };
    const { state: advanced } = advanceStrategicGameplayCalendar(state, contracts, 3, inbound);
    expect(advanced.crossModuleSyncStreakDays).toBe(2);
  });

  it('exports outbound coalition turn signals for assembly', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionVolatilityEvents: 0,
      coalitionStabilizationStreakDays: COALITION_STABILIZATION_STREAK_THRESHOLD,
      coalitionLockInStreakDays: POST_STABILIZATION_LOCK_IN_THRESHOLD,
      crossModuleSyncStreakDays: 2,
    };
    const signals = buildExternalCoalitionTurnSignals(state);
    expect(signals.postStabilizationLockIn).toBe(true);
    expect(signals.crossModuleSyncStreakDays).toBe(2);
    expect(signals.coalitionCrisisLevel).toBe('stable');
  });

  it('clears cross-module sync streak after integrated stabilization review', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(2),
      coalitionVolatilityEvents: 0,
      crossModuleSyncStreakDays: 2,
    };
    const result = executeStrategicAction(
      state,
      getStrategicAction('sga_coalition_integrated_stabilization_review')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.crossModuleSyncStreakDays).toBe(0);
  });

  it('extends turn briefing with lock-in and cross-module sync fields', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(3),
      coalitionLockInStreakDays: POST_STABILIZATION_LOCK_IN_THRESHOLD,
      crossModuleSyncStreakDays: 1,
    };
    const briefing = buildTurnStrategicBriefing(state, contracts, null, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(briefing.postStabilizationLockIn).toBe(true);
    expect(briefing.coalitionLockInStreakDays).toBe(POST_STABILIZATION_LOCK_IN_THRESHOLD);
    expect(briefing.crossModuleSyncStreakDays).toBe(1);
  });

  it('serializes save v8 with lock-in and cross-module sync streaks', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionLockInStreakDays: 3,
      crossModuleSyncStreakDays: 4,
    };
    const save = serializeStrategicGameplayState(state);
    expect(save.version).toBe(42);
    expect(save.coalitionLockInStreakDays).toBe(3);
    expect(save.crossModuleSyncStreakDays).toBe(4);
  });
});
