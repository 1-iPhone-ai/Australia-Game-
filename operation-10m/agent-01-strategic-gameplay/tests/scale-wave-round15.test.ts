import { describe, expect, it } from 'vitest';
import {
  advanceStrategicGameplayCalendar,
  ANCHORED_COALITION_GOVERNANCE_THRESHOLD,
  buildExternalCoalitionTurnSignals,
  buildTurnStrategicBriefing,
  createInitialStrategicState,
  createMemoryStrategicContracts,
  executeStrategicAction,
  GENERATIONAL_COALITION_CONTINUITY_THRESHOLD,
  getStrategicAction,
  INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD,
  INTEGRATED_COALITION_MATURITY_THRESHOLD,
  isGenerationalCoalitionContinuity,
  SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD,
  serializeStrategicGameplayState,
  validateAction,
} from '../src/index.ts';

describe('scale wave round 15 — generational coalition continuity', () => {
  const inbound = { postQueueCalm: true, pendingStabilizationWave: true };

  it('blocks continuity charter until generational streak reaches threshold', () => {
    const contracts = createMemoryStrategicContracts();
    const charter = getStrategicAction('sga_coalition_generational_continuity_charter')!;
    const blocked = validateAction(
      charter,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      {
        ...createInitialStrategicState(4),
        coalitionVolatilityEvents: 0,
        coalitionInstitutionalPermanenceStreakDays: INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD,
        coalitionGenerationalContinuityStreakDays: 2,
      },
    );
    expect(
      blocked.some((i) => i.code === 'COALITION_GENERATIONAL_CONTINUITY_STREAK_TOO_SHORT'),
    ).toBe(true);
  });

  it('accumulates generational continuity streak after institutional permanence is sustained', () => {
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
    };
    const { state: advanced } = advanceStrategicGameplayCalendar(state, contracts, 5, inbound);
    expect(advanced.coalitionGenerationalContinuityStreakDays).toBe(4);
    expect(isGenerationalCoalitionContinuity(advanced)).toBe(true);
  });

  it('exports generational continuity on outbound coalition signals', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionGenerationalContinuityStreakDays: GENERATIONAL_COALITION_CONTINUITY_THRESHOLD,
    };
    const signals = buildExternalCoalitionTurnSignals(state);
    expect(signals.generationalCoalitionContinuity).toBe(true);
    expect(signals.coalitionGenerationalContinuityStreakDays).toBe(
      GENERATIONAL_COALITION_CONTINUITY_THRESHOLD,
    );
  });

  it('clears generational streak after intergenerational endowment executes', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(2),
      coalitionVolatilityEvents: 0,
      coalitionGenerationalContinuityStreakDays: 2,
    };
    const result = executeStrategicAction(
      state,
      getStrategicAction('sga_coalition_intergenerational_trust_endowment')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.coalitionGenerationalContinuityStreakDays).toBe(0);
  });

  it('extends turn briefing with generational continuity fields', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(3),
      coalitionGenerationalContinuityStreakDays: GENERATIONAL_COALITION_CONTINUITY_THRESHOLD,
    };
    const briefing = buildTurnStrategicBriefing(state, contracts, null, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(briefing.generationalCoalitionContinuity).toBe(true);
    expect(briefing.coalitionGenerationalContinuityStreakDays).toBe(
      GENERATIONAL_COALITION_CONTINUITY_THRESHOLD,
    );
  });

  it('serializes save v14 with coalitionGenerationalContinuityStreakDays', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionGenerationalContinuityStreakDays: 5,
    };
    const save = serializeStrategicGameplayState(state);
    expect(save.version).toBe(31);
    expect(save.coalitionGenerationalContinuityStreakDays).toBe(5);
    expect(save.coalitionCivilizationalEnduranceStreakDays).toBe(0);
  });
});
