import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  MULTIVERSAL_COALITION_PERSISTENCE_THRESHOLD,
  isMultiversalCoalitionPersistence,
} from './coalition-multiversal-persistence.ts';

export const METAVERSE_COALITION_CONTINUITY_THRESHOLD = 4;
const METAVERSE_MANDATE_BONUS_PER_DAY = 1;

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

export function isMetaversalCoalitionContinuity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionMetaversalContinuityStreakDays ?? 0) >= METAVERSE_COALITION_CONTINUITY_THRESHOLD
  );
}

function metaversalContinuityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const multiversal = state.coalitionMultiversalPersistenceStreakDays ?? 0;
  return (
    isMultiversalCoalitionPersistence(state) ||
    multiversal >= MULTIVERSAL_COALITION_PERSISTENCE_THRESHOLD
  );
}

/** Metaversal continuity streak after multiversal persistence is sustained. */
export function advanceCoalitionMetaversalContinuityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!metaversalContinuityEligible(state)) {
    if ((state.coalitionMetaversalContinuityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionMetaversalContinuityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionMetaversalContinuityStreakDays:
      (state.coalitionMetaversalContinuityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionMetaversalContinuityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionMetaversalContinuityStreakDays: 0 };
}

export function applyMetaversalContinuityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isMetaversalCoalitionContinuity(state)) return state;

  const bonusTotal = daysAdvanced * METAVERSE_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
