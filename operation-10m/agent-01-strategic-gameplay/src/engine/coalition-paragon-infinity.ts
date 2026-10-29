import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  ZENITH_COALITION_PERPETUITY_THRESHOLD,
  isZenithCoalitionPerpetuity,
} from './coalition-zenith-perpetuity.ts';

export const PARAGON_COALITION_INFINITY_THRESHOLD = 4;
const PARAGON_INFINITY_MANDATE_BONUS_PER_DAY = 1;

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

export function isParagonCoalitionInfinity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionParagonInfinityStreakDays ?? 0) >= PARAGON_COALITION_INFINITY_THRESHOLD
  );
}

function paragonInfinityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const zenith = state.coalitionZenithPerpetuityStreakDays ?? 0;
  return (
    isZenithCoalitionPerpetuity(state) || zenith >= ZENITH_COALITION_PERPETUITY_THRESHOLD
  );
}

/** Paragon infinity streak after zenith perpetuity is sustained. */
export function advanceCoalitionParagonInfinityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!paragonInfinityEligible(state)) {
    if ((state.coalitionParagonInfinityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionParagonInfinityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionParagonInfinityStreakDays:
      (state.coalitionParagonInfinityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionParagonInfinityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionParagonInfinityStreakDays: 0 };
}

export function applyParagonInfinityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isParagonCoalitionInfinity(state)) return state;

  const bonusTotal = daysAdvanced * PARAGON_INFINITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
