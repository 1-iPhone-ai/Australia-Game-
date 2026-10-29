import { describe, expect, it } from 'vitest';
import {
  ABSOLUTE_COALITION_SANCTITY_THRESHOLD,
  advanceStrategicGameplayCalendar,
  ANCHORED_COALITION_GOVERNANCE_THRESHOLD,
  APEX_COALITION_TRANSCENDENCE_THRESHOLD,
  buildExternalCoalitionTurnSignals,
  buildTurnStrategicBriefing,
  CIVILIZATIONAL_COALITION_ENDURANCE_THRESHOLD,
  COSMIC_COALITION_PERPETUITY_THRESHOLD,
  createInitialStrategicState,
  createMemoryStrategicContracts,
  CUSTODIAL_COALITION_ETERNITY_THRESHOLD,
  ETERNAL_COALITION_ASCENDANCE_THRESHOLD,
  executeStrategicAction,
  GALACTIC_COALITION_INFINITY_THRESHOLD,
  GENERATIONAL_COALITION_CONTINUITY_THRESHOLD,
  getStrategicAction,
  HYPERVERSAL_COALITION_HARMONIZATION_THRESHOLD,
  IMPERIAL_COALITION_PERPETUITY_THRESHOLD,
  INFINITE_COALITION_PERSISTENCE_THRESHOLD,
  INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD,
  INTEGRATED_COALITION_MATURITY_THRESHOLD,
  isOracleCoalitionPerpetuity,
  METAVERSE_COALITION_CONTINUITY_THRESHOLD,
  MULTIVERSAL_COALITION_PERSISTENCE_THRESHOLD,
  OMNIVERSAL_COALITION_SYNTHESIS_THRESHOLD,
  ORACLE_COALITION_PERPETUITY_THRESHOLD,
  PARAMOUNT_COALITION_ASCENDANCY_THRESHOLD,
  PARAGON_COALITION_INFINITY_THRESHOLD,
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

describe('scale wave round 42 — oracle coalition perpetuity', () => {
  const inbound = { postQueueCalm: true, pendingStabilizationWave: true };

  it('blocks oracle charter until oracle streak reaches threshold', () => {
    const contracts = createMemoryStrategicContracts();
    const charter = getStrategicAction('sga_coalition_oracle_perpetuity_charter')!;
    const blocked = validateAction(
      charter,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      {
        ...createInitialStrategicState(4),
        coalitionVolatilityEvents: 0,
        coalitionSentinelAscendancyStreakDays: SENTINEL_COALITION_ASCENDANCY_THRESHOLD,
        coalitionOraclePerpetuityStreakDays: 2,
      },
    );
    expect(blocked.some((i) => i.code === 'COALITION_ORACLE_PERPETUITY_STREAK_TOO_SHORT')).toBe(
      true,
    );
  });

  it('accumulates oracle perpetuity streak after sentinel ascendancy is sustained', () => {
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
    };
    const { state: advanced } = advanceStrategicGameplayCalendar(state, contracts, 5, inbound);
    expect(advanced.coalitionOraclePerpetuityStreakDays).toBe(4);
    expect(isOracleCoalitionPerpetuity(advanced)).toBe(true);
  });

  it('exports oracle perpetuity on outbound coalition signals', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionOraclePerpetuityStreakDays: ORACLE_COALITION_PERPETUITY_THRESHOLD,
    };
    const signals = buildExternalCoalitionTurnSignals(state);
    expect(signals.oracleCoalitionPerpetuity).toBe(true);
    expect(signals.coalitionOraclePerpetuityStreakDays).toBe(ORACLE_COALITION_PERPETUITY_THRESHOLD);
  });

  it('clears oracle streak after continuity covenant executes', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(2),
      coalitionVolatilityEvents: 0,
      coalitionOraclePerpetuityStreakDays: 2,
    };
    const result = executeStrategicAction(
      state,
      getStrategicAction('sga_coalition_oracle_continuity_covenant')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.coalitionOraclePerpetuityStreakDays).toBe(0);
  });

  it('extends turn briefing with oracle perpetuity fields', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(3),
      coalitionOraclePerpetuityStreakDays: ORACLE_COALITION_PERPETUITY_THRESHOLD,
    };
    const briefing = buildTurnStrategicBriefing(state, contracts, null, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(briefing.oracleCoalitionPerpetuity).toBe(true);
    expect(briefing.coalitionOraclePerpetuityStreakDays).toBe(ORACLE_COALITION_PERPETUITY_THRESHOLD);
  });

  it('serializes save v40 with coalitionOraclePerpetuityStreakDays', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionOraclePerpetuityStreakDays: 5,
    };
    const save = serializeStrategicGameplayState(state);
    expect(save.version).toBe(49);
    expect(save.coalitionOraclePerpetuityStreakDays).toBe(5);
  });
});
