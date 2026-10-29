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
  isUniversalCoalitionImmortality,
  PRIMORDIAL_COALITION_CONTINUITY_THRESHOLD,
  SOVEREIGN_COALITION_CONTINUUM_THRESHOLD,
  SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD,
  serializeStrategicGameplayState,
  TRANSCENDENT_COALITION_LEGACY_THRESHOLD,
  UNIVERSAL_COALITION_IMMORTALITY_THRESHOLD,
  validateAction,
} from '../src/index.ts';

describe('scale wave round 23 — universal coalition immortality', () => {
  const inbound = { postQueueCalm: true, pendingStabilizationWave: true };

  it('blocks immortality charter until universal streak reaches threshold', () => {
    const contracts = createMemoryStrategicContracts();
    const charter = getStrategicAction('sga_coalition_universal_immortality_charter')!;
    const blocked = validateAction(
      charter,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      {
        ...createInitialStrategicState(4),
        coalitionVolatilityEvents: 0,
        coalitionAbsoluteSanctityStreakDays: ABSOLUTE_COALITION_SANCTITY_THRESHOLD,
        coalitionUniversalImmortalityStreakDays: 2,
      },
    );
    expect(
      blocked.some((i) => i.code === 'COALITION_UNIVERSAL_IMMORTALITY_STREAK_TOO_SHORT'),
    ).toBe(true);
  });

  it('accumulates universal immortality streak after absolute sanctity is sustained', () => {
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
      coalitionAbsoluteSanctityStreakDays: ABSOLUTE_COALITION_SANCTITY_THRESHOLD,
    };
    const { state: advanced } = advanceStrategicGameplayCalendar(state, contracts, 5, inbound);
    expect(advanced.coalitionUniversalImmortalityStreakDays).toBe(4);
    expect(isUniversalCoalitionImmortality(advanced)).toBe(true);
  });

  it('exports universal immortality on outbound coalition signals', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionUniversalImmortalityStreakDays: UNIVERSAL_COALITION_IMMORTALITY_THRESHOLD,
    };
    const signals = buildExternalCoalitionTurnSignals(state);
    expect(signals.universalCoalitionImmortality).toBe(true);
    expect(signals.coalitionUniversalImmortalityStreakDays).toBe(
      UNIVERSAL_COALITION_IMMORTALITY_THRESHOLD,
    );
  });

  it('clears universal streak after continuity compact executes', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(2),
      coalitionVolatilityEvents: 0,
      coalitionUniversalImmortalityStreakDays: 2,
    };
    const result = executeStrategicAction(
      state,
      getStrategicAction('sga_coalition_universal_continuity_compact')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.coalitionUniversalImmortalityStreakDays).toBe(0);
  });

  it('extends turn briefing with universal immortality fields', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(3),
      coalitionUniversalImmortalityStreakDays: UNIVERSAL_COALITION_IMMORTALITY_THRESHOLD,
    };
    const briefing = buildTurnStrategicBriefing(state, contracts, null, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(briefing.universalCoalitionImmortality).toBe(true);
    expect(briefing.coalitionUniversalImmortalityStreakDays).toBe(
      UNIVERSAL_COALITION_IMMORTALITY_THRESHOLD,
    );
  });

  it('serializes save v21 with coalitionUniversalImmortalityStreakDays', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionUniversalImmortalityStreakDays: 5,
    };
    const save = serializeStrategicGameplayState(state);
    expect(save.version).toBe(49);
    expect(save.coalitionUniversalImmortalityStreakDays).toBe(5);
  });
});
