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
  INFINITE_COALITION_PERSISTENCE_THRESHOLD,
  INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD,
  INTEGRATED_COALITION_MATURITY_THRESHOLD,
  isMultiversalCoalitionPersistence,
  MULTIVERSAL_COALITION_PERSISTENCE_THRESHOLD,
  PRIMORDIAL_COALITION_CONTINUITY_THRESHOLD,
  QUANTUM_COALITION_OMNIPRESENCE_THRESHOLD,
  SOVEREIGN_COALITION_CONTINUUM_THRESHOLD,
  STELLAR_COALITION_TRANSCENDENCE_THRESHOLD,
  SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD,
  serializeStrategicGameplayState,
  TRANSCENDENT_COALITION_LEGACY_THRESHOLD,
  UNIVERSAL_COALITION_IMMORTALITY_THRESHOLD,
  validateAction,
} from '../src/index.ts';

describe('scale wave round 28 — multiversal coalition persistence', () => {
  const inbound = { postQueueCalm: true, pendingStabilizationWave: true };

  it('blocks persistence charter until multiversal streak reaches threshold', () => {
    const contracts = createMemoryStrategicContracts();
    const charter = getStrategicAction('sga_coalition_multiversal_persistence_charter')!;
    const blocked = validateAction(
      charter,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      {
        ...createInitialStrategicState(4),
        coalitionVolatilityEvents: 0,
        coalitionQuantumOmnipresenceStreakDays: QUANTUM_COALITION_OMNIPRESENCE_THRESHOLD,
        coalitionMultiversalPersistenceStreakDays: 2,
      },
    );
    expect(
      blocked.some((i) => i.code === 'COALITION_MULTIVERSAL_PERSISTENCE_STREAK_TOO_SHORT'),
    ).toBe(true);
  });

  it('accumulates multiversal persistence streak after quantum omnipresence is sustained', () => {
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
    };
    const { state: advanced } = advanceStrategicGameplayCalendar(state, contracts, 5, inbound);
    expect(advanced.coalitionMultiversalPersistenceStreakDays).toBe(4);
    expect(isMultiversalCoalitionPersistence(advanced)).toBe(true);
  });

  it('exports multiversal persistence on outbound coalition signals', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionMultiversalPersistenceStreakDays: MULTIVERSAL_COALITION_PERSISTENCE_THRESHOLD,
    };
    const signals = buildExternalCoalitionTurnSignals(state);
    expect(signals.multiversalCoalitionPersistence).toBe(true);
    expect(signals.coalitionMultiversalPersistenceStreakDays).toBe(
      MULTIVERSAL_COALITION_PERSISTENCE_THRESHOLD,
    );
  });

  it('clears multiversal streak after continuity pact executes', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(2),
      coalitionVolatilityEvents: 0,
      coalitionMultiversalPersistenceStreakDays: 2,
    };
    const result = executeStrategicAction(
      state,
      getStrategicAction('sga_coalition_multiversal_continuity_pact')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.coalitionMultiversalPersistenceStreakDays).toBe(0);
  });

  it('extends turn briefing with multiversal persistence fields', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(3),
      coalitionMultiversalPersistenceStreakDays: MULTIVERSAL_COALITION_PERSISTENCE_THRESHOLD,
    };
    const briefing = buildTurnStrategicBriefing(state, contracts, null, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(briefing.multiversalCoalitionPersistence).toBe(true);
    expect(briefing.coalitionMultiversalPersistenceStreakDays).toBe(
      MULTIVERSAL_COALITION_PERSISTENCE_THRESHOLD,
    );
  });

  it('serializes save v26 with coalitionMultiversalPersistenceStreakDays', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionMultiversalPersistenceStreakDays: 5,
    };
    const save = serializeStrategicGameplayState(state);
    expect(save.version).toBe(43);
    expect(save.coalitionMultiversalPersistenceStreakDays).toBe(5);
  });
});
