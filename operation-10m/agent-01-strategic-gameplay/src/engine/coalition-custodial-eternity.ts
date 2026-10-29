import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  IMPERIAL_COALITION_PERPETUITY_THRESHOLD,
  isImperialCoalitionPerpetuity,
} from './coalition-imperial-perpetuity.ts';

export const CUSTODIAL_COALITION_ETERNITY_THRESHOLD = 4;
const CUSTODIAL_ETERNITY_MANDATE_BONUS_PER_DAY = 1;

function boostTrack(track: PriorityMandateTrack, pointsGained: number): PriorityMandateTrack {
  const points = track.points + pointsGained;
  const milestonesUnlocked = track.milestonesUnlocked.filter((id) => {
    if (id === 'mandate_priority_leadership') return points >= 75;
    if (id === 'mandate_priority_momentum') return points >= 50;
    if (id === 'mandate_priority_engaged') return points >= 25;
    return true;
  });
  for (const step of [
    { id: 'mandate_priority_engaged' as const, min: 25 },
    { id: 'mandate_priority_momentum' as const, min: 50 },
    { id: 'mandate_priority_leadership' as const, min: 75 },
  ]) {
    if (points >= step.min && !milestonesUnlocked.includes(step.id)) {
      milestonesUnlocked.push(step.id);
    }
  }
  return { ...track, points, milestonesUnlocked };
}

export function isCustodialCoalitionEternity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionCustodialEternityStreakDays ?? 0) >= CUSTODIAL_COALITION_ETERNITY_THRESHOLD
  );
}

function custodialEternityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const imperial = state.coalitionImperialPerpetuityStreakDays ?? 0;
  return (
    isImperialCoalitionPerpetuity(state) || imperial >= IMPERIAL_COALITION_PERPETUITY_THRESHOLD
  );
}

/** Custodial eternity streak after imperial perpetuity is sustained. */
export function advanceCoalitionCustodialEternityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!custodialEternityEligible(state)) {
    if ((state.coalitionCustodialEternityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionCustodialEternityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionCustodialEternityStreakDays:
      (state.coalitionCustodialEternityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionCustodialEternityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionCustodialEternityStreakDays: 0 };
}

export function applyCustodialEternityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isCustodialCoalitionEternity(state)) return state;

  const bonusTotal = daysAdvanced * CUSTODIAL_ETERNITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
