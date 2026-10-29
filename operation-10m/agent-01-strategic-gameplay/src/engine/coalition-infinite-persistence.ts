import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  ETERNAL_COALITION_ASCENDANCE_THRESHOLD,
  isEternalCoalitionAscendance,
} from './coalition-eternal-ascendance.ts';

export const INFINITE_COALITION_PERSISTENCE_THRESHOLD = 4;
const INFINITE_MANDATE_BONUS_PER_DAY = 1;

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

export function isInfiniteCoalitionPersistence(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionInfinitePersistenceStreakDays ?? 0) >= INFINITE_COALITION_PERSISTENCE_THRESHOLD
  );
}

function infinitePersistenceEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const eternal = state.coalitionEternalAscendanceStreakDays ?? 0;
  return (
    isEternalCoalitionAscendance(state) || eternal >= ETERNAL_COALITION_ASCENDANCE_THRESHOLD
  );
}

/** Infinite persistence streak after eternal ascendance is sustained. */
export function advanceCoalitionInfinitePersistenceStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!infinitePersistenceEligible(state)) {
    if ((state.coalitionInfinitePersistenceStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionInfinitePersistenceStreakDays: 0 };
  }
  return {
    ...state,
    coalitionInfinitePersistenceStreakDays:
      (state.coalitionInfinitePersistenceStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionInfinitePersistenceStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionInfinitePersistenceStreakDays: 0 };
}

export function applyInfinitePersistenceMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isInfiniteCoalitionPersistence(state)) return state;

  const bonusTotal = daysAdvanced * INFINITE_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
