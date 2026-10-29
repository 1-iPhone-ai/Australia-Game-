import { describe, expect, it } from 'vitest';
import {
  advanceStrategicGameplayCalendar,
  ANCHORED_COALITION_GOVERNANCE_THRESHOLD,
  INTEGRATED_COALITION_MATURITY_THRESHOLD,
  buildExternalCoalitionTurnSignals,
  buildTurnStrategicBriefing,
  createInitialStrategicState,
  createMemoryStrategicContracts,
  executeStrategicAction,
  getStrategicAction,
  isAnchoredCoalitionGovernance,
  SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD,
  serializeStrategicGameplayState,
  validateAction,
} from '../src/index.ts';

describe('scale wave round 13 — anchored coalition governance', () => {
  const inbound = { postQueueCalm: true, pendingStabilizationWave: true };

  it('blocks governance compact until anchored streak reaches threshold', () => {
    const contracts = createMemoryStrategicContracts();
    const compact = getStrategicAction('sga_coalition_anchored_governance_compact')!;
    const blocked = validateAction(
      compact,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      {
        ...createInitialStrategicState(4),
        coalitionVolatilityEvents: 0,
        coalitionStewardshipStreakDays: SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD,
        coalitionAnchoredGovernanceStreakDays: 2,
      },
    );
    expect(blocked.some((i) => i.code === 'COALITION_ANCHORED_GOVERNANCE_STREAK_TOO_SHORT')).toBe(
      true,
    );
  });

  it('accumulates anchored governance streak after stewardship is sustained', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(1),
      coalitionVolatilityEvents: 0,
      coalitionStabilizationStreakDays: 3,
      coalitionLockInStreakDays: 2,
      crossModuleSyncStreakDays: 2,
      integratedCoalitionMaturityStreakDays: INTEGRATED_COALITION_MATURITY_THRESHOLD,
      coalitionStewardshipStreakDays: SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD,
    };
    const { state: advanced } = advanceStrategicGameplayCalendar(state, contracts, 5, inbound);
    expect(advanced.coalitionAnchoredGovernanceStreakDays).toBe(4);
    expect(isAnchoredCoalitionGovernance(advanced)).toBe(true);
  });

  it('exports anchored governance on outbound coalition signals', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionAnchoredGovernanceStreakDays: ANCHORED_COALITION_GOVERNANCE_THRESHOLD,
    };
    const signals = buildExternalCoalitionTurnSignals(state);
    expect(signals.anchoredCoalitionGovernance).toBe(true);
    expect(signals.coalitionAnchoredGovernanceStreakDays).toBe(ANCHORED_COALITION_GOVERNANCE_THRESHOLD);
  });

  it('clears anchored streak after legacy trust endowment executes', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(2),
      coalitionVolatilityEvents: 0,
      coalitionAnchoredGovernanceStreakDays: 2,
    };
    const result = executeStrategicAction(
      state,
      getStrategicAction('sga_coalition_legacy_trust_endowment')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.coalitionAnchoredGovernanceStreakDays).toBe(0);
  });

  it('extends turn briefing with anchored governance fields', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(3),
      coalitionAnchoredGovernanceStreakDays: ANCHORED_COALITION_GOVERNANCE_THRESHOLD,
    };
    const briefing = buildTurnStrategicBriefing(state, contracts, null, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(briefing.anchoredCoalitionGovernance).toBe(true);
    expect(briefing.coalitionAnchoredGovernanceStreakDays).toBe(ANCHORED_COALITION_GOVERNANCE_THRESHOLD);
  });

  it('serializes save v11 with coalitionAnchoredGovernanceStreakDays', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionAnchoredGovernanceStreakDays: 5,
    };
    const save = serializeStrategicGameplayState(state);
    expect(save.version).toBe(32);
    expect(save.coalitionAnchoredGovernanceStreakDays).toBe(5);
  });
});
