import type { StakeholderGroupId, StakeholderSentiment } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import { isIntegratedCoalitionMaturity } from './coalition-integrated-maturity.ts';
import { createDefaultStakeholderSentiment } from './stakeholder-coalition.ts';

export const SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD = 3;
const STEWARDSHIP_SENTIMENT_CALM_PER_DAY = 1;

function clampSentiment(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function isSustainedIntegratedCoalitionStewardship(
  state: StrategicGameplayState,
): boolean {
  return (state.coalitionStewardshipStreakDays ?? 0) >= SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD;
}

function stewardshipEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  return isIntegratedCoalitionMaturity(state);
}

/** Stewardship days while integrated maturity remains active and volatility stays cleared. */
export function advanceCoalitionStewardshipStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!stewardshipEligible(state)) {
    if ((state.coalitionStewardshipStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionStewardshipStreakDays: 0 };
  }
  return {
    ...state,
    coalitionStewardshipStreakDays: (state.coalitionStewardshipStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionStewardshipStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionStewardshipStreakDays: 0 };
}

/** Gentle stakeholder calm while integrated stewardship is sustained. */
export function applyStewardshipStakeholderCalm(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isSustainedIntegratedCoalitionStewardship(state)) return state;

  const base = state.stakeholderSentiment ?? createDefaultStakeholderSentiment();
  const sentiment: StakeholderSentiment = { ...base };
  const step = STEWARDSHIP_SENTIMENT_CALM_PER_DAY * daysAdvanced;

  for (const group of Object.keys(sentiment) as StakeholderGroupId[]) {
    const value = sentiment[group];
    if (value < 55) {
      sentiment[group] = clampSentiment(value + step);
    } else if (value > 55) {
      sentiment[group] = clampSentiment(value - Math.ceil(step / 2));
    }
  }

  return { ...state, stakeholderSentiment: sentiment };
}
