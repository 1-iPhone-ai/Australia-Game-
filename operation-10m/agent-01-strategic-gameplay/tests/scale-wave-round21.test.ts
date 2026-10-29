import { describe, expect, it } from 'vitest';
import {
  advanceStrategicGameplayCalendar,
  ANCHORED_COALITION_GOVERNANCE_THRESHOLD,
  buildExternalCoalitionTurnSignals,
  buildTurnStrategicBriefing,
  CIVILIZATIONAL_COALITION_ENDURANCE_THRESHOLD,
  createInitialStrategicState,
  createMemoryStrategicContracts,
  ETERNAL_COALITION_ASCENDANCE_THRESHOLD,
  executeStrategicAction,
  GENERATIONAL_COALITION_CONTINUITY_THRESHOLD,
  getStrategicAction,
  INFINITE_COALITION_PERSISTENCE_THRESHOLD,
  INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD,
  INTEGRATED_COALITION_MATURITY_THRESHOLD,
  isPrimordialCoalitionContinuity,
  PRIMORDIAL_COALITION_CONTINUITY_THRESHOLD,
  SOVEREIGN_COALITION_CONTINUUM_THRESHOLD,
  SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD,
  serializeStrategicGameplayState,
  TRANSCENDENT_COALITION_LEGACY_THRESHOLD,
  validateAction,
} from '../src/index.ts';

describe('scale wave round 21 — primordial coalition continuity', () => {
  const inbound = { postQueueCalm: true, pendingStabilizationWave: true };

  it('blocks primordial charter until primordial streak reaches threshold', () => {
    const contracts = createMemoryStrategicContracts();
    const charter = getStrategicAction('sga_coalition_primordial_continuity_charter')!;
    const blocked = validateAction(
      charter,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      {
        ...createInitialStrategicState(4),
        coalitionVolatilityEvents: 0,
        coalitionInfinitePersistenceStreakDays: INFINITE_COALITION_PERSISTENCE_THRESHOLD,
        coalitionPrimordialContinuityStreakDays: 2,
      },
    );
    expect(
      blocked.some((i) => i.code === 'COALITION_PRIMORDIAL_CONTINUITY_STREAK_TOO_SHORT'),
    ).toBe(true);
  });

  it('accumulates primordial continuity streak after infinite persistence is sustained', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(1),
      coalitionVolatilityEvents: 0,
      coalitionStabilizationStreakDays: 3,
      coalitionLockInStreakDays: 2,
      crossModuleSyncStreakDays: 2,
      integratedCoalitionMaturityStreakDays: INTEGRATED_COALITION_MATURITY_THRESHOLD,
      coalitionStewardshipStreakDays: SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD,
      coalitionAnchoredGovernanceStreakDays: ANCHORED_COALITION_GOVERNANCE_THRESHOLD,
      coalitionInstitutionalPermanenceStreakDays: INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD,
      coalitionGenerationalContinuityStreakDays: GENERATIONAL_COALITION_CONTINUITY_THRESHOLD,
      coalitionCivilizationalEnduranceStreakDays: CIVILIZATIONAL_COALITION_ENDURANCE_THRESHOLD,
      coalitionTranscendentLegacyStreakDays: TRANSCENDENT_COALITION_LEGACY_THRESHOLD,
      coalitionSovereignContinuumStreakDays: SOVEREIGN_COALITION_CONTINUUM_THRESHOLD,
      coalitionEternalAscendanceStreakDays: ETERNAL_COALITION_ASCENDANCE_THRESHOLD,
      coalitionInfinitePersistenceStreakDays: INFINITE_COALITION_PERSISTENCE_THRESHOLD,
    };
    const { state: advanced } = advanceStrategicGameplayCalendar(state, contracts, 5, inbound);
    expect(advanced.coalitionPrimordialContinuityStreakDays).toBe(4);
    expect(isPrimordialCoalitionContinuity(advanced)).toBe(true);
  });

  it('exports primordial continuity on outbound coalition signals', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionPrimordialContinuityStreakDays: PRIMORDIAL_COALITION_CONTINUITY_THRESHOLD,
    };
    const signals = buildExternalCoalitionTurnSignals(state);
    expect(signals.primordialCoalitionContinuity).toBe(true);
    expect(signals.coalitionPrimordialContinuityStreakDays).toBe(
      PRIMORDIAL_COALITION_CONTINUITY_THRESHOLD,
    );
  });

  it('clears primordial streak after continuity endowment executes', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(2),
      coalitionVolatilityEvents: 0,
      coalitionPrimordialContinuityStreakDays: 2,
    };
    const result = executeStrategicAction(
      state,
      getStrategicAction('sga_coalition_primordial_continuity_endowment')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.coalitionPrimordialContinuityStreakDays).toBe(0);
  });

  it('extends turn briefing with primordial continuity fields', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(3),
      coalitionPrimordialContinuityStreakDays: PRIMORDIAL_COALITION_CONTINUITY_THRESHOLD,
    };
    const briefing = buildTurnStrategicBriefing(state, contracts, null, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(briefing.primordialCoalitionContinuity).toBe(true);
    expect(briefing.coalitionPrimordialContinuityStreakDays).toBe(
      PRIMORDIAL_COALITION_CONTINUITY_THRESHOLD,
    );
  });

  it('serializes save v19 with coalitionPrimordialContinuityStreakDays', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionPrimordialContinuityStreakDays: 5,
    };
    const save = serializeStrategicGameplayState(state);
    expect(save.version).toBe(45);
    expect(save.coalitionPrimordialContinuityStreakDays).toBe(5);
  });
});
