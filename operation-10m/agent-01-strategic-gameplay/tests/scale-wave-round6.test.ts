import { describe, expect, it } from 'vitest';
import {
  advanceStrategicGameplayCalendar,
  buildTurnStrategicBriefing,
  classifyCoalitionCrisisLevel,
  computeCoalitionBalanceIndex,
  createInitialStrategicState,
  createMemoryStrategicContracts,
  executeStrategicAction,
  getStrategicAction,
  serializeStrategicGameplayState,
  validateAction,
} from '../src/index.ts';

describe('scale wave round 6 — coalition crisis depth', () => {
  const acuteSentiment = {
    industry: 100,
    households: 0,
    regions: 20,
    public_services: 80,
  };

  it('allows crisis forum only when coalition balance is acute', () => {
    const contracts = createMemoryStrategicContracts();
    const forum = getStrategicAction('sga_coalition_reconciliation_forum')!;
    const state = {
      ...createInitialStrategicState(4),
      stakeholderSentiment: acuteSentiment,
    };
    expect(classifyCoalitionCrisisLevel(state)).toBe('acute');
    expect(computeCoalitionBalanceIndex(state.stakeholderSentiment)).toBeLessThanOrEqual(44);
    const issues = validateAction(
      forum,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      [],
      state,
    );
    expect(issues.some((i) => i.code === 'COALITION_NOT_IN_CRISIS')).toBe(false);
  });

  it('accumulates coalition crisis streak across calendar days while acute', () => {
    const contracts = createMemoryStrategicContracts();
    let state = {
      ...createInitialStrategicState(1),
      stakeholderSentiment: acuteSentiment,
    };
    const { state: advanced } = advanceStrategicGameplayCalendar(state, contracts, 6);
    expect(advanced.coalitionCrisisStreakDays).toBe(5);
  });

  it('resets crisis streak after reconciliation forum executes', () => {
    const contracts = createMemoryStrategicContracts();
    let state = {
      ...createInitialStrategicState(2),
      stakeholderSentiment: acuteSentiment,
      coalitionCrisisStreakDays: 4,
    };
    const result = executeStrategicAction(
      state,
      getStrategicAction('sga_coalition_reconciliation_forum')!,
      contracts,
      { actionsUsedThisTurn: 0, actionsPerTurn: 3 },
      null,
    );
    expect(result.ok).toBe(true);
    expect(result.state.coalitionCrisisStreakDays).toBe(0);
  });

  it('extends turn briefing with coalition crisis fields', () => {
    const contracts = createMemoryStrategicContracts();
    const state = {
      ...createInitialStrategicState(3),
      stakeholderSentiment: acuteSentiment,
      coalitionCrisisStreakDays: 2,
    };
    const briefing = buildTurnStrategicBriefing(state, contracts, null, {
      actionsUsedThisTurn: 0,
      actionsPerTurn: 3,
    });
    expect(briefing.coalitionCrisisLevel).toBe('acute');
    expect(briefing.coalitionCrisisStreakDays).toBe(2);
  });

  it('serializes save v4 with coalitionCrisisStreakDays', () => {
    const state = {
      ...createInitialStrategicState(5),
      coalitionCrisisStreakDays: 3,
    };
    const save = serializeStrategicGameplayState(state);
    expect(save.version).toBe(20);
    expect(save.coalitionCrisisStreakDays).toBe(3);
  });
});
