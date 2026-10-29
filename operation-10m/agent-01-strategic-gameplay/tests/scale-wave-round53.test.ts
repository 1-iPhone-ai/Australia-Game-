import { describe, expect, it } from 'vitest';
import {
  ABSOLUTE_COALITION_SANCTITY_THRESHOLD,
  advanceStrategicGameplayCalendar,
  ANCHORED_COALITION_GOVERNANCE_THRESHOLD,
  APEX_COALITION_TRANSCENDENCE_THRESHOLD,
  ARCHON_COALITION_ETERNITY_THRESHOLD,
  buildExternalCoalitionTurnSignals,
  buildTurnStrategicBriefing,
  CIVILIZATIONAL_COALITION_ENDURANCE_THRESHOLD,
  COSMIC_COALITION_PERPETUITY_THRESHOLD,
  createInitialStrategicState,
  createMemoryStrategicContracts,
  CUSTODIAL_COALITION_ETERNITY_THRESHOLD,
  ETERNAL_COALITION_ASCENDANCE_THRESHOLD,
  EXARCH_COALITION_ASCENDANCY_THRESHOLD,
  executeStrategicAction,
  GALACTIC_COALITION_INFINITY_THRESHOLD,
  GENERATIONAL_COALITION_CONTINUITY_THRESHOLD,
  getStrategicAction,
  HYPERVERSAL_COALITION_HARMONIZATION_THRESHOLD,
  IMPERIAL_COALITION_PERPETUITY_THRESHOLD,
  INFINITE_COALITION_PERSISTENCE_THRESHOLD,
  INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD,
  INTEGRATED_COALITION_MATURITY_THRESHOLD,
  isMatriarchCoalitionDeification,
  MATRIARCH_COALITION_ASCENDANCY_THRESHOLD,
  MATRIARCH_COALITION_ETERNITY_THRESHOLD,
  MATRIARCH_COALITION_INFINITY_THRESHOLD,
  MATRIARCH_COALITION_PERPETUITY_THRESHOLD,
  MATRIARCH_COALITION_TRANSCENDENCE_THRESHOLD,
  MATRIARCH_COALITION_APOTHEOSIS_THRESHOLD,
  MATRIARCH_COALITION_DEIFICATION_THRESHOLD,
  METAVERSE_COALITION_CONTINUITY_THRESHOLD,
  MULTIVERSAL_COALITION_PERSISTENCE_THRESHOLD,
  OMNIVERSAL_COALITION_SYNTHESIS_THRESHOLD,
  ORACLE_COALITION_PERPETUITY_THRESHOLD,
  PARAMOUNT_COALITION_ASCENDANCY_THRESHOLD,
  PARAGON_COALITION_INFINITY_THRESHOLD,
  PATRIARCH_COALITION_ETERNITY_THRESHOLD,
  PRIMARCH_COALITION_PERPETUITY_THRESHOLD,
  PRIMORDIAL_COALITION_CONTINUITY_THRESHOLD,
  QUANTUM_COALITION_OMNIPRESENCE_THRESHOLD,
  SENTINEL_COALITION_ASCENDANCY_THRESHOLD,
  serializeStrategicGameplayState,
  SOVEREIGN_COALITION_CONTINUUM_THRESHOLD,
  STELLAR_COALITION_TRANSCENDENCE_THRESHOLD,
  SUPREME_COALITION_CONVERGENCE_THRESHOLD,
  SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD,
  TRANSCENDENT_COALITION_LEGACY_THRESHOLD,
  TRANSCENDENT_COALITION_OMNIUM_THRESHOLD,
  UNIVERSAL_COALITION_IMMORTALITY_THRESHOLD,
  validateAction,
  VANGUARD_COALITION_SYNTHESIS_THRESHOLD,
  ZENITH_COALITION_PERPETUITY_THRESHOLD,
} from '../src/index.ts';

describe('scale wave round 53 — matriarch coalition apotheosis', () => {
  const inbound = { postQueueCalm: true, pendingStabilizationWave: true };

  it('blocks matriarch apotheosis charter until apotheosis streak reaches threshold', () => {
    const contracts = createMemoryStrategicContracts();
    const charter = getStrategicAction('sga_coalition_matriarch_deification_charter')!;
    const blocked = validateAction(
      charter,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      {
        ...createInitialStrategicState(4),
        coalitionVolatilityEvents: 0,
        coalitionMatriarchTranscendenceStreakDays: MATRIARCH_COALITION_TRANSCENDENCE_THRESHOLD,
        coalitionMatriarchApotheosisStreakDays: MATRIARCH_COALITION_APOTHEOSIS_THRESHOLD,
        coalitionMatriarchDeificationStreakDays: 2,
      },
    );
    expect(blocked.some((i) => i.code === 'COALITION_MATRIARCH_DEIFICATION_STREAK_TOO_SHORT')).toBe(
      true,
    );
  });

  it('accumulates matriarch apotheosis streak after matriarch transcendence is sustained', () => {
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
      coalitionTranscendentOmniumStreakDays: TRANSCENDENT_COALITION_OMNIUM_THRESHOLD,
      coalitionSupremeConvergenceStreakDays: SUPREME_COALITION_CONVERGENCE_THRESHOLD,
      coalitionApexTranscendenceStreakDays: APEX_COALITION_TRANSCENDENCE_THRESHOLD,
      coalitionZenithPerpetuityStreakDays: ZENITH_COALITION_PERPETUITY_THRESHOLD,
      coalitionParagonInfinityStreakDays: PARAGON_COALITION_INFINITY_THRESHOLD,
      coalitionParamountAscendancyStreakDays: PARAMOUNT_COALITION_ASCENDANCY_THRESHOLD,
      coalitionImperialPerpetuityStreakDays: IMPERIAL_COALITION_PERPETUITY_THRESHOLD,
      coalitionCustodialEternityStreakDays: CUSTODIAL_COALITION_ETERNITY_THRESHOLD,
      coalitionVanguardSynthesisStreakDays: VANGUARD_COALITION_SYNTHESIS_THRESHOLD,
      coalitionSentinelAscendancyStreakDays: SENTINEL_COALITION_ASCENDANCY_THRESHOLD,
      coalitionOraclePerpetuityStreakDays: ORACLE_COALITION_PERPETUITY_THRESHOLD,
      coalitionArchonEternityStreakDays: ARCHON_COALITION_ETERNITY_THRESHOLD,
      coalitionExarchAscendancyStreakDays: EXARCH_COALITION_ASCENDANCY_THRESHOLD,
      coalitionPrimarchPerpetuityStreakDays: PRIMARCH_COALITION_PERPETUITY_THRESHOLD,
      coalitionPatriarchEternityStreakDays: PATRIARCH_COALITION_ETERNITY_THRESHOLD,
      coalitionMatriarchAscendancyStreakDays: MATRIARCH_COALITION_ASCENDANCY_THRESHOLD,
      coalitionMatriarchPerpetuityStreakDays: MATRIARCH_COALITION_PERPETUITY_THRESHOLD,
      coalitionMatriarchEternityStreakDays: MATRIARCH_COALITION_ETERNITY_THRESHOLD,
      coalitionMatriarchInfinityStreakDays: MATRIARCH_COALITION_INFINITY_THRESHOLD,
      coalitionMatriarchTranscendenceStreakDays: MATRIARCH_COALITION_TRANSCENDENCE_THRESHOLD,
      coalitionMatriarchApotheosisStreakDays: MATRIARCH_COALITION_APOTHEOSIS_THRESHOLD,
    };
    const { state: advanced } = advanceStrategicGameplayCalendar(state, contracts, 5, inbound);
    expect(advanced.coalitionMatriarchDeificationStreakDays).toBe(4);
    expect(isMatriarchCoalitionDeification(advanced)).toBe(true);
  });

  it('exports matriarch apotheosis on outbound coalition signals', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionMatriarchDeificationStreakDays: MATRIARCH_COALITION_DEIFICATION_THRESHOLD,
    };
    const signals = buildExternalCoalitionTurnSignals(state);
    expect(signals.matriarchCoalitionDeification).toBe(true);
    expect(signals.coalitionMatriarchDeificationStreakDays).toBe(
      MATRIARCH_COALITION_DEIFICATION_THRESHOLD,
    );
  });

  it('clears matriarch apotheosis streak after apotheosis covenant executes', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(2),
      coalitionVolatilityEvents: 0,
      coalitionMatriarchDeificationStreakDays: 2,
    };
    const result = executeStrategicAction(
      state,
      getStrategicAction('sga_coalition_matriarch_deification_covenant')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.coalitionMatriarchDeificationStreakDays).toBe(0);
  });

  it('extends turn briefing with matriarch apotheosis fields', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(3),
      coalitionMatriarchDeificationStreakDays: MATRIARCH_COALITION_DEIFICATION_THRESHOLD,
    };
    const briefing = buildTurnStrategicBriefing(state, contracts, null, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(briefing.matriarchCoalitionDeification).toBe(true);
    expect(briefing.coalitionMatriarchDeificationStreakDays).toBe(
      MATRIARCH_COALITION_DEIFICATION_THRESHOLD,
    );
  });

  it('serializes save v51 with coalitionMatriarchDeificationStreakDays', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionMatriarchDeificationStreakDays: 5,
    };
    const save = serializeStrategicGameplayState(state);
    expect(save.version).toBe(51);
    expect(save.coalitionMatriarchDeificationStreakDays).toBe(5);
  });
});
