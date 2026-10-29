import type { StrategicGameplayContracts } from '../contracts/index.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { advanceDayAndResolveDelayed } from './delayed-effects.ts';
import { applyMandateIdleDrift } from './mandate-idle-drift.ts';
import { advanceCoalitionCrisisStreak } from './coalition-crisis.ts';
import { createDefaultStakeholderSentiment } from './stakeholder-coalition.ts';
import type { StakeholderGroupId, StakeholderSentiment } from '../types/coalition-mandate.ts';

const MEAN_SENTIMENT = 55;
const PASSIVE_EROSION_PER_DAY = 1;

function clampSentiment(value: number): number {
  return Math.max(0, Math.min(100, value));
}

/** Pull extreme coalition sentiment slightly toward the long-run mean each day. */
export function applyPassiveStakeholderReversion(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  const base = state.stakeholderSentiment ?? createDefaultStakeholderSentiment();
  const sentiment: StakeholderSentiment = { ...base };
  const step = PASSIVE_EROSION_PER_DAY * daysAdvanced;

  for (const group of Object.keys(sentiment) as StakeholderGroupId[]) {
    const value = sentiment[group];
    if (value > MEAN_SENTIMENT) {
      sentiment[group] = clampSentiment(value - step);
    } else if (value < MEAN_SENTIMENT) {
      sentiment[group] = clampSentiment(value + step);
    }
  }

  return { ...state, stakeholderSentiment: sentiment };
}

export interface AdvanceStrategicCalendarResult {
  state: StrategicGameplayState;
  firedTradeOffCount: number;
}

/** Agent 02 calendar hook — resolves delayed trade-offs, mandate drift, coalition reversion. */
export function advanceStrategicGameplayCalendar(
  state: StrategicGameplayState,
  contracts: StrategicGameplayContracts,
  toDay: number,
): AdvanceStrategicCalendarResult {
  if (toDay <= state.day) {
    return { state, firedTradeOffCount: 0 };
  }

  const daysAdvanced = toDay - state.day;
  const { state: afterDelayed, fired } = advanceDayAndResolveDelayed(state, contracts, toDay);
  let next = applyMandateIdleDrift(afterDelayed, toDay);
  next = advanceCoalitionCrisisStreak(next, daysAdvanced);
  next = applyPassiveStakeholderReversion(next, daysAdvanced);

  return { state: next, firedTradeOffCount: fired.length };
}
