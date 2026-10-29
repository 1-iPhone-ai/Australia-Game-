import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD,
  isInstitutionalCoalitionPermanence,
} from './coalition-institutional-permanence.ts';

export const GENERATIONAL_COALITION_CONTINUITY_THRESHOLD = 4;
const GENERATIONAL_MANDATE_BONUS_PER_DAY = 1;

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

export function isGenerationalCoalitionContinuity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionGenerationalContinuityStreakDays ?? 0) >=
    GENERATIONAL_COALITION_CONTINUITY_THRESHOLD
  );
}

function generationalContinuityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const permanence = state.coalitionInstitutionalPermanenceStreakDays ?? 0;
  return (
    isInstitutionalCoalitionPermanence(state) ||
    permanence >= INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD
  );
}

/** Generational continuity streak after institutional permanence is sustained. */
export function advanceCoalitionGenerationalContinuityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!generationalContinuityEligible(state)) {
    if ((state.coalitionGenerationalContinuityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionGenerationalContinuityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionGenerationalContinuityStreakDays:
      (state.coalitionGenerationalContinuityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionGenerationalContinuityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionGenerationalContinuityStreakDays: 0 };
}

export function applyGenerationalContinuityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isGenerationalCoalitionContinuity(state)) return state;

  const bonusTotal = daysAdvanced * GENERATIONAL_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
