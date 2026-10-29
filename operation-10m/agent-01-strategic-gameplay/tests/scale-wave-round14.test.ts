import { describe, expect, it } from 'vitest';
import {
  advanceStrategicGameplayCalendar,
  ANCHORED_COALITION_GOVERNANCE_THRESHOLD,
  buildExternalCoalitionTurnSignals,
  buildTurnStrategicBriefing,
  createInitialStrategicState,
  createMemoryStrategicContracts,
  executeStrategicAction,
  getStrategicAction,
  INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD,
  INTEGRATED_COALITION_MATURITY_THRESHOLD,
  isInstitutionalCoalitionPermanence,
  SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD,
  serializeStrategicGameplayState,
  validateAction,
} from '../src/index.ts';

describe('scale wave round 14 — institutional coalition permanence', () => {
  const inbound = { postQueueCalm: true, pendingStabilizationWave: true };

  it('blocks permanence charter until institutional streak reaches threshold', () => {
    const contracts = createMemoryStrategicContracts();
    const charter = getStrategicAction('sga_coalition_institutional_permanence_charter')!;
    const blocked = validateAction(
      charter,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      {
        ...createInitialStrategicState(4),
        coalitionVolatilityEvents: 0,
        coalitionAnchoredGovernanceStreakDays: ANCHORED_COALITION_GOVERNANCE_THRESHOLD,
        coalitionInstitutionalPermanenceStreakDays: 2,
      },
    );
    expect(
      blocked.some((i) => i.code === 'COALITION_INSTITUTIONAL_PERMANENCE_STREAK_TOO_SHORT'),
    ).toBe(true);
  });

  it('accumulates institutional permanence streak after anchored governance is sustained', () => {
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
    };
    const { state: advanced } = advanceStrategicGameplayCalendar(state, contracts, 5, inbound);
    expect(advanced.coalitionInstitutionalPermanenceStreakDays).toBe(4);
    expect(isInstitutionalCoalitionPermanence(advanced)).toBe(true);
  });

  it('exports institutional permanence on outbound coalition signals', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionInstitutionalPermanenceStreakDays: INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD,
    };
    const signals = buildExternalCoalitionTurnSignals(state);
    expect(signals.institutionalCoalitionPermanence).toBe(true);
    expect(signals.coalitionInstitutionalPermanenceStreakDays).toBe(
      INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD,
    );
  });

  it('clears institutional permanence streak after succession covenant executes', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(2),
      coalitionVolatilityEvents: 0,
      coalitionInstitutionalPermanenceStreakDays: 2,
    };
    const result = executeStrategicAction(
      state,
      getStrategicAction('sga_coalition_succession_resilience_covenant')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.coalitionInstitutionalPermanenceStreakDays).toBe(0);
  });

  it('extends turn briefing with institutional permanence fields', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(3),
      coalitionInstitutionalPermanenceStreakDays: INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD,
    };
    const briefing = buildTurnStrategicBriefing(state, contracts, null, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(briefing.institutionalCoalitionPermanence).toBe(true);
    expect(briefing.coalitionInstitutionalPermanenceStreakDays).toBe(
      INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD,
    );
  });

  it('serializes save v12 with coalitionInstitutionalPermanenceStreakDays', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionInstitutionalPermanenceStreakDays: 5,
    };
    const save = serializeStrategicGameplayState(state);
    expect(save.version).toBe(22);
    expect(save.coalitionInstitutionalPermanenceStreakDays).toBe(5);
  });
});
