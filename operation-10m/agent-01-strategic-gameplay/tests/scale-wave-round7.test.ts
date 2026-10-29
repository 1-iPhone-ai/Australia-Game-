import { describe, expect, it } from 'vitest';
import {
  advanceStrategicGameplayCalendar,
  buildTurnStrategicBriefing,
  createInitialStrategicState,
  createMemoryStrategicContracts,
  executeStrategicAction,
  getStrategicAction,
  isProlongedCoalitionCrisis,
  PROLONGED_COALITION_CRISIS_THRESHOLD,
  serializeStrategicGameplayState,
  validateAction,
} from '../src/index.ts';
import { advanceMandateOnAction } from '../src/engine/strategic-mandate.ts';

describe('scale wave round 7 — coalition recovery and prolonged crisis', () => {
  const acuteSentiment = {
    industry: 100,
    households: 0,
    regions: 20,
    public_services: 80,
  };

  it('blocks emergency compact until crisis streak reaches threshold', () => {
    const contracts = createMemoryStrategicContracts();
    const compact = getStrategicAction('sga_coalition_emergency_compact')!;
    const shortStreak = {
      ...createInitialStrategicState(4),
      stakeholderSentiment: acuteSentiment,
      coalitionCrisisStreakDays: 2,
    };
    const blocked = validateAction(
      compact,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      shortStreak,
    );
    expect(blocked.some((i) => i.code === 'COALITION_CRISIS_STREAK_TOO_SHORT')).toBe(true);

    const ready = {
      ...shortStreak,
      coalitionCrisisStreakDays: 3,
    };
    const ok = validateAction(
      compact,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      ready,
    );
    expect(ok.some((i) => i.code === 'COALITION_CRISIS_STREAK_TOO_SHORT')).toBe(false);
  });

  it('accumulates coalition recovery streak while balance stays stable', () => {
    const contracts = createMemoryStrategicContracts();
    let state = createInitialStrategicState(1);
    const { state: advanced } = advanceStrategicGameplayCalendar(state, contracts, 4);
    expect(advanced.coalitionRecoveryStreakDays).toBe(3);
  });

  it('flags prolonged coalition crisis and applies extra mandate pressure', () => {
    const contracts = createMemoryStrategicContracts();
    let state = createInitialStrategicState(1);
    state = {
      ...state,
      stakeholderSentiment: acuteSentiment,
    };
    state = advanceMandateOnAction(state, getStrategicAction('sga_supply_chain_buffer')!);
    const beforePoints = state.mandateProgress?.supply_chain_security?.points ?? 0;
    const { state: afterCalendar } = advanceStrategicGameplayCalendar(state, contracts, 6);
    expect(afterCalendar.coalitionCrisisStreakDays).toBeGreaterThanOrEqual(
      PROLONGED_COALITION_CRISIS_THRESHOLD,
    );
    expect(isProlongedCoalitionCrisis(afterCalendar)).toBe(true);
    const afterPoints = afterCalendar.mandateProgress?.supply_chain_security?.points ?? 0;
    expect(afterPoints).toBeLessThan(beforePoints);
  });

  it('resets crisis streak after emergency compact executes', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(2),
      stakeholderSentiment: acuteSentiment,
      coalitionCrisisStreakDays: 4,
    };
    const result = executeStrategicAction(
      state,
      getStrategicAction('sga_coalition_emergency_compact')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.coalitionCrisisStreakDays).toBe(0);
    expect(result.state.coalitionVolatilityEvents).toBe(1);
  });

  it('extends turn briefing with recovery and prolonged crisis fields', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(3),
      coalitionRecoveryStreakDays: 2,
      coalitionCrisisStreakDays: PROLONGED_COALITION_CRISIS_THRESHOLD,
    };
    const briefing = buildTurnStrategicBriefing(state, contracts, null, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(briefing.coalitionRecoveryStreakDays).toBe(2);
    expect(briefing.prolongedCoalitionCrisis).toBe(true);
  });

  it('serializes save v6 with coalitionRecoveryStreakDays', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionRecoveryStreakDays: 4,
    };
    const save = serializeStrategicGameplayState(state);
    expect(save.version).toBe(17);
    expect(save.coalitionRecoveryStreakDays).toBe(4);
  });
});
