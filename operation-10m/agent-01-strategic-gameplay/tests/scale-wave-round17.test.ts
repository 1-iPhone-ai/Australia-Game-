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
  isTranscendentCoalitionLegacy,
  SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD,
  serializeStrategicGameplayState,
  TRANSCENDENT_COALITION_LEGACY_THRESHOLD,
  validateAction,
} from '../src/index.ts';

describe('scale wave round 17 — transcendent coalition legacy', () => {
  const inbound = { postQueueCalm: true, pendingStabilizationWave: true };

  it('blocks legacy charter until transcendent streak reaches threshold', () => {
    const contracts = createMemoryStrategicContracts();
    const charter = getStrategicAction('sga_coalition_transcendent_legacy_charter')!;
    const blocked = validateAction(
      charter,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      {
        ...createInitialStrategicState(4),
        coalitionVolatilityEvents: 0,
        coalitionCivilizationalEnduranceStreakDays: CIVILIZATIONAL_COALITION_ENDURANCE_THRESHOLD,
        coalitionTranscendentLegacyStreakDays: 2,
      },
    );
    expect(
      blocked.some((i) => i.code === 'COALITION_TRANSCENDENT_LEGACY_STREAK_TOO_SHORT'),
    ).toBe(true);
  });

  it('accumulates transcendent legacy streak after civilizational endurance is sustained', () => {
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
    };
    const { state: advanced } = advanceStrategicGameplayCalendar(state, contracts, 5, inbound);
    expect(advanced.coalitionTranscendentLegacyStreakDays).toBe(4);
    expect(isTranscendentCoalitionLegacy(advanced)).toBe(true);
  });

  it('exports transcendent legacy on outbound coalition signals', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionTranscendentLegacyStreakDays: TRANSCENDENT_COALITION_LEGACY_THRESHOLD,
    };
    const signals = buildExternalCoalitionTurnSignals(state);
    expect(signals.transcendentCoalitionLegacy).toBe(true);
    expect(signals.coalitionTranscendentLegacyStreakDays).toBe(
      TRANSCENDENT_COALITION_LEGACY_THRESHOLD,
    );
  });

  it('clears transcendent streak after enduring covenant executes', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(2),
      coalitionVolatilityEvents: 0,
      coalitionTranscendentLegacyStreakDays: 2,
    };
    const result = executeStrategicAction(
      state,
      getStrategicAction('sga_coalition_transcendent_enduring_covenant')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.coalitionTranscendentLegacyStreakDays).toBe(0);
  });

  it('extends turn briefing with transcendent legacy fields', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(3),
      coalitionTranscendentLegacyStreakDays: TRANSCENDENT_COALITION_LEGACY_THRESHOLD,
    };
    const briefing = buildTurnStrategicBriefing(state, contracts, null, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(briefing.transcendentCoalitionLegacy).toBe(true);
    expect(briefing.coalitionTranscendentLegacyStreakDays).toBe(
      TRANSCENDENT_COALITION_LEGACY_THRESHOLD,
    );
  });

  it('serializes save v15 with coalitionTranscendentLegacyStreakDays', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionTranscendentLegacyStreakDays: 5,
    };
    const save = serializeStrategicGameplayState(state);
    expect(save.version).toBe(33);
    expect(save.coalitionTranscendentLegacyStreakDays).toBe(5);
  });
});
