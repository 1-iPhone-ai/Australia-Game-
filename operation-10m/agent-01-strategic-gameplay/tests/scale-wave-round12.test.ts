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
  isSustainedIntegratedCoalitionStewardship,
  SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD,
  serializeStrategicGameplayState,
  validateAction,
} from '../src/index.ts';

describe('scale wave round 12 — integrated coalition stewardship', () => {
  const inbound = { postQueueCalm: true, pendingStabilizationWave: true };

  it('blocks stewardship charter until stewardship streak reaches threshold', () => {
    const contracts = createMemoryStrategicContracts();
    const charter = getStrategicAction('sga_coalition_stewardship_charter')!;
    const blocked = validateAction(
      charter,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      {
        ...createInitialStrategicState(4),
        coalitionVolatilityEvents: 0,
        integratedCoalitionMaturityStreakDays: 2,
        coalitionStewardshipStreakDays: 2,
      },
    );
    expect(blocked.some((i) => i.code === 'COALITION_STEWARDSHIP_STREAK_TOO_SHORT')).toBe(true);
  });

  it('accumulates stewardship streak while integrated maturity stays active', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(1),
      coalitionVolatilityEvents: 0,
      coalitionStabilizationStreakDays: 3,
      coalitionLockInStreakDays: 2,
      crossModuleSyncStreakDays: 2,
      integratedCoalitionMaturityStreakDays: INTEGRATED_COALITION_MATURITY_THRESHOLD,
    };
    const { state: advanced } = advanceStrategicGameplayCalendar(state, contracts, 4, inbound);
    expect(advanced.coalitionStewardshipStreakDays).toBe(3);
    expect(isSustainedIntegratedCoalitionStewardship(advanced)).toBe(true);
  });

  it('exports stewardship fields on outbound coalition signals', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionStewardshipStreakDays: SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD,
      integratedCoalitionMaturityStreakDays: INTEGRATED_COALITION_MATURITY_THRESHOLD,
    };
    const signals = buildExternalCoalitionTurnSignals(state);
    expect(signals.sustainedIntegratedCoalitionStewardship).toBe(true);
    expect(signals.coalitionStewardshipStreakDays).toBe(SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD);
  });

  it('clears stewardship streak after anchored trust dividend executes', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(2),
      coalitionVolatilityEvents: 0,
      coalitionStewardshipStreakDays: 2,
    };
    const result = executeStrategicAction(
      state,
      getStrategicAction('sga_coalition_anchored_trust_dividend')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.coalitionStewardshipStreakDays).toBe(0);
  });

  it('extends turn briefing with stewardship fields', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(3),
      coalitionStewardshipStreakDays: SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD,
    };
    const briefing = buildTurnStrategicBriefing(state, contracts, null, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(briefing.sustainedIntegratedCoalitionStewardship).toBe(true);
    expect(briefing.coalitionStewardshipStreakDays).toBe(SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD);
  });

  it('serializes save v10 with coalitionStewardshipStreakDays', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionStewardshipStreakDays: 4,
    };
    const save = serializeStrategicGameplayState(state);
    expect(save.version).toBe(33);
    expect(save.coalitionStewardshipStreakDays).toBe(4);
  });
});
