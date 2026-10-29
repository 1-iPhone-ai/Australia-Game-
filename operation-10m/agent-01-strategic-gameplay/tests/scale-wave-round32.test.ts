import { describe, expect, it } from 'vitest';
import {
  ABSOLUTE_COALITION_SANCTITY_THRESHOLD,
  advanceStrategicGameplayCalendar,
  ANCHORED_COALITION_GOVERNANCE_THRESHOLD,
  buildExternalCoalitionTurnSignals,
  buildTurnStrategicBriefing,
  CIVILIZATIONAL_COALITION_ENDURANCE_THRESHOLD,
  COSMIC_COALITION_PERPETUITY_THRESHOLD,
  createInitialStrategicState,
  createMemoryStrategicContracts,
  ETERNAL_COALITION_ASCENDANCE_THRESHOLD,
  executeStrategicAction,
  GALACTIC_COALITION_INFINITY_THRESHOLD,
  GENERATIONAL_COALITION_CONTINUITY_THRESHOLD,
  getStrategicAction,
  HYPERVERSAL_COALITION_HARMONIZATION_THRESHOLD,
  INFINITE_COALITION_PERSISTENCE_THRESHOLD,
  INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD,
  INTEGRATED_COALITION_MATURITY_THRESHOLD,
  isTranscendentCoalitionOmnium,
  METAVERSE_COALITION_CONTINUITY_THRESHOLD,
  MULTIVERSAL_COALITION_PERSISTENCE_THRESHOLD,
  OMNIVERSAL_COALITION_SYNTHESIS_THRESHOLD,
  PRIMORDIAL_COALITION_CONTINUITY_THRESHOLD,
  QUANTUM_COALITION_OMNIPRESENCE_THRESHOLD,
  SOVEREIGN_COALITION_CONTINUUM_THRESHOLD,
  STELLAR_COALITION_TRANSCENDENCE_THRESHOLD,
  SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD,
  serializeStrategicGameplayState,
  TRANSCENDENT_COALITION_OMNIUM_THRESHOLD,
  TRANSCENDENT_COALITION_LEGACY_THRESHOLD,
  UNIVERSAL_COALITION_IMMORTALITY_THRESHOLD,
  validateAction,
} from '../src/index.ts';

describe('scale wave round 32 — transcendent coalition omnium', () => {
  const inbound = { postQueueCalm: true, pendingStabilizationWave: true };

  it('blocks omnium charter until transcendent streak reaches threshold', () => {
    const contracts = createMemoryStrategicContracts();
    const charter = getStrategicAction('sga_coalition_transcendent_omnium_charter')!;
    const blocked = validateAction(
      charter,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      {
        ...createInitialStrategicState(4),
        coalitionVolatilityEvents: 0,
        coalitionHyperversalHarmonizationStreakDays: HYPERVERSAL_COALITION_HARMONIZATION_THRESHOLD,
        coalitionTranscendentOmniumStreakDays: 2,
      },
    );
    expect(blocked.some((i) => i.code === 'COALITION_TRANSCENDENT_OMNIUM_STREAK_TOO_SHORT')).toBe(
      true,
    );
  });

  it('accumulates transcendent omnium streak after hyperversal harmonization is sustained', () => {
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
      coalitionUniversalImmortalityStreakDays: UNIVERSAL_COALITION_IMMORTALITY_THRESHOLD,
      coalitionCosmicPerpetuityStreakDays: COSMIC_COALITION_PERPETUITY_THRESHOLD,
      coalitionGalacticInfinityStreakDays: GALACTIC_COALITION_INFINITY_THRESHOLD,
      coalitionStellarTranscendenceStreakDays: STELLAR_COALITION_TRANSCENDENCE_THRESHOLD,
      coalitionQuantumOmnipresenceStreakDays: QUANTUM_COALITION_OMNIPRESENCE_THRESHOLD,
      coalitionMultiversalPersistenceStreakDays: MULTIVERSAL_COALITION_PERSISTENCE_THRESHOLD,
      coalitionMetaversalContinuityStreakDays: METAVERSE_COALITION_CONTINUITY_THRESHOLD,
      coalitionOmniversalSynthesisStreakDays: OMNIVERSAL_COALITION_SYNTHESIS_THRESHOLD,
      coalitionHyperversalHarmonizationStreakDays: HYPERVERSAL_COALITION_HARMONIZATION_THRESHOLD,
    };
    const { state: advanced } = advanceStrategicGameplayCalendar(state, contracts, 5, inbound);
    expect(advanced.coalitionTranscendentOmniumStreakDays).toBe(4);
    expect(isTranscendentCoalitionOmnium(advanced)).toBe(true);
  });

  it('exports transcendent omnium on outbound coalition signals', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionTranscendentOmniumStreakDays: TRANSCENDENT_COALITION_OMNIUM_THRESHOLD,
    };
    const signals = buildExternalCoalitionTurnSignals(state);
    expect(signals.transcendentCoalitionOmnium).toBe(true);
    expect(signals.coalitionTranscendentOmniumStreakDays).toBe(
      TRANSCENDENT_COALITION_OMNIUM_THRESHOLD,
    );
  });

  it('clears transcendent streak after permanence endowment executes', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(2),
      coalitionVolatilityEvents: 0,
      coalitionTranscendentOmniumStreakDays: 2,
    };
    const result = executeStrategicAction(
      state,
      getStrategicAction('sga_coalition_transcendent_permanence_endowment')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.coalitionTranscendentOmniumStreakDays).toBe(0);
  });

  it('extends turn briefing with transcendent omnium fields', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(3),
      coalitionTranscendentOmniumStreakDays: TRANSCENDENT_COALITION_OMNIUM_THRESHOLD,
    };
    const briefing = buildTurnStrategicBriefing(state, contracts, null, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(briefing.transcendentCoalitionOmnium).toBe(true);
    expect(briefing.coalitionTranscendentOmniumStreakDays).toBe(
      TRANSCENDENT_COALITION_OMNIUM_THRESHOLD,
    );
  });

  it('serializes save v30 with coalitionTranscendentOmniumStreakDays', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionTranscendentOmniumStreakDays: 5,
    };
    const save = serializeStrategicGameplayState(state);
    expect(save.version).toBe(49);
    expect(save.coalitionTranscendentOmniumStreakDays).toBe(5);
  });
});
