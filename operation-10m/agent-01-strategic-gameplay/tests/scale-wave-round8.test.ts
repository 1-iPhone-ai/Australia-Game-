import { describe, expect, it } from 'vitest';
import {
  advanceStrategicGameplayCalendar,
  buildTurnStrategicBriefing,
  createInitialStrategicState,
  createMemoryStrategicContracts,
  executeStrategicAction,
  getStrategicAction,
  isSustainedCoalitionRecovery,
  SUSTAINED_COALITION_RECOVERY_THRESHOLD,
  serializeStrategicGameplayState,
  validateAction,
} from '../src/index.ts';
import { advanceMandateOnAction } from '../src/engine/strategic-mandate.ts';

describe('scale wave round 8 — sustained recovery and coalition volatility', () => {
  it('blocks sustained trust charter until recovery streak reaches threshold', () => {
    const contracts = createMemoryStrategicContracts();
    const charter = getStrategicAction('sga_coalition_sustained_trust_charter')!;
    const shortStreak = {
      ...createInitialStrategicState(4),
      coalitionRecoveryStreakDays: 3,
    };
    const blocked = validateAction(
      charter,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      shortStreak,
    );
    expect(blocked.some((i) => i.code === 'COALITION_RECOVERY_STREAK_TOO_SHORT')).toBe(true);

    const ready = {
      ...shortStreak,
      coalitionRecoveryStreakDays: SUSTAINED_COALITION_RECOVERY_THRESHOLD,
    };
    const ok = validateAction(
      charter,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      ready,
    );
    expect(ok.some((i) => i.code === 'COALITION_RECOVERY_STREAK_TOO_SHORT')).toBe(false);
  });

  it('applies mandate bonus during sustained coalition recovery on calendar', () => {
    const contracts = createMemoryStrategicContracts();
    let state = createInitialStrategicState(1);
    state = advanceMandateOnAction(state, getStrategicAction('sga_supply_chain_buffer')!);
    const beforePoints = state.mandateProgress?.supply_chain_security?.points ?? 0;
    state = {
      ...state,
      coalitionRecoveryStreakDays: SUSTAINED_COALITION_RECOVERY_THRESHOLD,
    };
    const { state: afterCalendar } = advanceStrategicGameplayCalendar(state, contracts, 3);
    expect(isSustainedCoalitionRecovery(afterCalendar)).toBe(true);
    const afterPoints = afterCalendar.mandateProgress?.supply_chain_security?.points ?? 0;
    expect(afterPoints).toBeGreaterThan(beforePoints);
  });

  it('records volatility when prolonged crisis ends via emergency compact', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(2),
      stakeholderSentiment: {
        industry: 100,
        households: 0,
        regions: 20,
        public_services: 80,
      },
      coalitionCrisisStreakDays: 5,
    };
    const result = executeStrategicAction(
      state,
      getStrategicAction('sga_coalition_emergency_compact')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.coalitionVolatilityEvents).toBe(1);
  });

  it('clears volatility events after volatility review executes', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(2),
      coalitionVolatilityEvents: 2,
    };
    const result = executeStrategicAction(
      state,
      getStrategicAction('sga_coalition_volatility_review')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.coalitionVolatilityEvents).toBe(0);
  });

  it('extends turn briefing with sustained recovery and volatility fields', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(3),
      coalitionRecoveryStreakDays: SUSTAINED_COALITION_RECOVERY_THRESHOLD,
      coalitionVolatilityEvents: 1,
    };
    const briefing = buildTurnStrategicBriefing(state, contracts, null, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(briefing.sustainedCoalitionRecovery).toBe(true);
    expect(briefing.coalitionVolatilityEvents).toBe(1);
  });

  it('serializes save v6 with coalitionVolatilityEvents', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionVolatilityEvents: 3,
    };
    const save = serializeStrategicGameplayState(state);
    expect(save.version).toBe(42);
    expect(save.coalitionVolatilityEvents).toBe(3);
  });
});
