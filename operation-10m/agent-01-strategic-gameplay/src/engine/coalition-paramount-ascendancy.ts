import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  PARAGON_COALITION_INFINITY_THRESHOLD,
  isParagonCoalitionInfinity,
} from './coalition-paragon-infinity.ts';

export const PARAMOUNT_COALITION_ASCENDANCY_THRESHOLD = 4;
const PARAMOUNT_ASCENDANCY_MANDATE_BONUS_PER_DAY = 1;

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

export function isParamountCoalitionAscendancy(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionParamountAscendancyStreakDays ?? 0) >= PARAMOUNT_COALITION_ASCENDANCY_THRESHOLD
  );
}

function paramountAscendancyEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const paragon = state.coalitionParagonInfinityStreakDays ?? 0;
  return isParagonCoalitionInfinity(state) || paragon >= PARAGON_COALITION_INFINITY_THRESHOLD;
}

/** Paramount ascendancy streak after paragon infinity is sustained. */
export function advanceCoalitionParamountAscendancyStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!paramountAscendancyEligible(state)) {
    if ((state.coalitionParamountAscendancyStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionParamountAscendancyStreakDays: 0 };
  }
  return {
    ...state,
    coalitionParamountAscendancyStreakDays:
      (state.coalitionParamountAscendancyStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionParamountAscendancyStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionParamountAscendancyStreakDays: 0 };
}

export function applyParamountAscendancyMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isParamountCoalitionAscendancy(state)) return state;

  const bonusTotal = daysAdvanced * PARAMOUNT_ASCENDANCY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
