import { describe, expect, it } from 'vitest';
import {
  advanceStrategicGameplayCalendar,
  ANCHORED_COALITION_GOVERNANCE_THRESHOLD,
  buildExternalCoalitionTurnSignals,
  buildTurnStrategicBriefing,
  CIVILIZATIONAL_COALITION_ENDURANCE_THRESHOLD,
  createInitialStrategicState,
  createMemoryStrategicContracts,
  executeStrategicAction,
  GENERATIONAL_COALITION_CONTINUITY_THRESHOLD,
  getStrategicAction,
  INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD,
  INTEGRATED_COALITION_MATURITY_THRESHOLD,
  isSovereignCoalitionContinuum,
  SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD,
  serializeStrategicGameplayState,
  SOVEREIGN_COALITION_CONTINUUM_THRESHOLD,
  TRANSCENDENT_COALITION_LEGACY_THRESHOLD,
  validateAction,
} from '../src/index.ts';

describe('scale wave round 18 — sovereign coalition continuum', () => {
  const inbound = { postQueueCalm: true, pendingStabilizationWave: true };

  it('blocks continuum charter until sovereign streak reaches threshold', () => {
    const contracts = createMemoryStrategicContracts();
    const charter = getStrategicAction('sga_coalition_sovereign_continuum_charter')!;
    const blocked = validateAction(
      charter,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      {
        ...createInitialStrategicState(4),
        coalitionVolatilityEvents: 0,
        coalitionTranscendentLegacyStreakDays: TRANSCENDENT_COALITION_LEGACY_THRESHOLD,
        coalitionSovereignContinuumStreakDays: 2,
      },
    );
    expect(
      blocked.some((i) => i.code === 'COALITION_SOVEREIGN_CONTINUUM_STREAK_TOO_SHORT'),
    ).toBe(true);
  });

  it('accumulates sovereign continuum streak after transcendent legacy is sustained', () => {
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
    };
    const { state: advanced } = advanceStrategicGameplayCalendar(state, contracts, 5, inbound);
    expect(advanced.coalitionSovereignContinuumStreakDays).toBe(4);
    expect(isSovereignCoalitionContinuum(advanced)).toBe(true);
  });

  it('exports sovereign continuum on outbound coalition signals', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionSovereignContinuumStreakDays: SOVEREIGN_COALITION_CONTINUUM_THRESHOLD,
    };
    const signals = buildExternalCoalitionTurnSignals(state);
    expect(signals.sovereignCoalitionContinuum).toBe(true);
    expect(signals.coalitionSovereignContinuumStreakDays).toBe(
      SOVEREIGN_COALITION_CONTINUUM_THRESHOLD,
    );
  });

  it('clears sovereign streak after continuity endowment executes', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(2),
      coalitionVolatilityEvents: 0,
      coalitionSovereignContinuumStreakDays: 2,
    };
    const result = executeStrategicAction(
      state,
      getStrategicAction('sga_coalition_sovereign_continuity_endowment')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.coalitionSovereignContinuumStreakDays).toBe(0);
  });

  it('extends turn briefing with sovereign continuum fields', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(3),
      coalitionSovereignContinuumStreakDays: SOVEREIGN_COALITION_CONTINUUM_THRESHOLD,
    };
    const briefing = buildTurnStrategicBriefing(state, contracts, null, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(briefing.sovereignCoalitionContinuum).toBe(true);
    expect(briefing.coalitionSovereignContinuumStreakDays).toBe(
      SOVEREIGN_COALITION_CONTINUUM_THRESHOLD,
    );
  });

  it('serializes save v16 with coalitionSovereignContinuumStreakDays', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionSovereignContinuumStreakDays: 5,
    };
    const save = serializeStrategicGameplayState(state);
    expect(save.version).toBe(16);
    expect(save.coalitionSovereignContinuumStreakDays).toBe(5);
  });
});
