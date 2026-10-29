import { describe, expect, it } from 'vitest';
import {
  ABSOLUTE_COALITION_SANCTITY_THRESHOLD,
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
  isAbsoluteCoalitionSanctity,
  PRIMORDIAL_COALITION_CONTINUITY_THRESHOLD,
  SOVEREIGN_COALITION_CONTINUUM_THRESHOLD,
  SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD,
  serializeStrategicGameplayState,
  TRANSCENDENT_COALITION_LEGACY_THRESHOLD,
  validateAction,
} from '../src/index.ts';

describe('scale wave round 22 — absolute coalition sanctity', () => {
  const inbound = { postQueueCalm: true, pendingStabilizationWave: true };

  it('blocks sanctity charter until absolute streak reaches threshold', () => {
    const contracts = createMemoryStrategicContracts();
    const charter = getStrategicAction('sga_coalition_absolute_sanctity_charter')!;
    const blocked = validateAction(
      charter,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      {
        ...createInitialStrategicState(4),
        coalitionVolatilityEvents: 0,
        coalitionPrimordialContinuityStreakDays: PRIMORDIAL_COALITION_CONTINUITY_THRESHOLD,
        coalitionAbsoluteSanctityStreakDays: 2,
      },
    );
    expect(
      blocked.some((i) => i.code === 'COALITION_ABSOLUTE_SANCTITY_STREAK_TOO_SHORT'),
    ).toBe(true);
  });

  it('accumulates absolute sanctity streak after primordial continuity is sustained', () => {
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
      coalitionPrimordialContinuityStreakDays: PRIMORDIAL_COALITION_CONTINUITY_THRESHOLD,
    };
    const { state: advanced } = advanceStrategicGameplayCalendar(state, contracts, 5, inbound);
    expect(advanced.coalitionAbsoluteSanctityStreakDays).toBe(4);
    expect(isAbsoluteCoalitionSanctity(advanced)).toBe(true);
  });

  it('exports absolute sanctity on outbound coalition signals', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionAbsoluteSanctityStreakDays: ABSOLUTE_COALITION_SANCTITY_THRESHOLD,
    };
    const signals = buildExternalCoalitionTurnSignals(state);
    expect(signals.absoluteCoalitionSanctity).toBe(true);
    expect(signals.coalitionAbsoluteSanctityStreakDays).toBe(ABSOLUTE_COALITION_SANCTITY_THRESHOLD);
  });

  it('clears absolute streak after continuity pact executes', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(2),
      coalitionVolatilityEvents: 0,
      coalitionAbsoluteSanctityStreakDays: 2,
    };
    const result = executeStrategicAction(
      state,
      getStrategicAction('sga_coalition_absolute_continuity_pact')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.coalitionAbsoluteSanctityStreakDays).toBe(0);
  });

  it('extends turn briefing with absolute sanctity fields', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(3),
      coalitionAbsoluteSanctityStreakDays: ABSOLUTE_COALITION_SANCTITY_THRESHOLD,
    };
    const briefing = buildTurnStrategicBriefing(state, contracts, null, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(briefing.absoluteCoalitionSanctity).toBe(true);
    expect(briefing.coalitionAbsoluteSanctityStreakDays).toBe(ABSOLUTE_COALITION_SANCTITY_THRESHOLD);
  });

  it('serializes save v20 with coalitionAbsoluteSanctityStreakDays', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionAbsoluteSanctityStreakDays: 5,
    };
    const save = serializeStrategicGameplayState(state);
    expect(save.version).toBe(38);
    expect(save.coalitionAbsoluteSanctityStreakDays).toBe(5);
  });
});
