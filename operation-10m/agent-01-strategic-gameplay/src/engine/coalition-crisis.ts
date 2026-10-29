import type { CoalitionCrisisLevel } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { computeCoalitionBalanceIndex } from './coalition-balance.ts';
import { PROLONGED_COALITION_CRISIS_THRESHOLD } from './coalition-crisis-pressure.ts';
import { incrementCoalitionVolatilityEvents } from './coalition-volatility.ts';
import { createDefaultStakeholderSentiment } from './stakeholder-coalition.ts';

const STABLE_MIN_INDEX = 70;
const STRAINED_MIN_INDEX = 45;

export function classifyCoalitionCrisisLevel(
  state: StrategicGameplayState,
): CoalitionCrisisLevel {
  const sentiment = state.stakeholderSentiment ?? createDefaultStakeholderSentiment();
  const index = computeCoalitionBalanceIndex(sentiment);
  if (index >= STABLE_MIN_INDEX) return 'stable';
  if (index >= STRAINED_MIN_INDEX) return 'strained';
  return 'acute';
}

/** Increment crisis streak while coalition balance stays acute; reset otherwise. */
export function advanceCoalitionCrisisStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (classifyCoalitionCrisisLevel(state) !== 'acute') {
    if ((state.coalitionCrisisStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionCrisisStreakDays: 0 };
  }
  return {
    ...state,
    coalitionCrisisStreakDays: (state.coalitionCrisisStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionCrisisStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  const peak = state.coalitionCrisisStreakDays ?? 0;
  let next: StrategicGameplayState = { ...state, coalitionCrisisStreakDays: 0 };
  if (peak >= PROLONGED_COALITION_CRISIS_THRESHOLD) {
    next = incrementCoalitionVolatilityEvents(next);
  }
  return next;
}
