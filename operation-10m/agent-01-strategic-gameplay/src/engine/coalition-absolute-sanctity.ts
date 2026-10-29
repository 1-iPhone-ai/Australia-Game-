import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  PRIMORDIAL_COALITION_CONTINUITY_THRESHOLD,
  isPrimordialCoalitionContinuity,
} from './coalition-primordial-continuity.ts';

export const ABSOLUTE_COALITION_SANCTITY_THRESHOLD = 4;
const ABSOLUTE_MANDATE_BONUS_PER_DAY = 1;

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

export function isAbsoluteCoalitionSanctity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionAbsoluteSanctityStreakDays ?? 0) >= ABSOLUTE_COALITION_SANCTITY_THRESHOLD
  );
}

function absoluteSanctityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const primordial = state.coalitionPrimordialContinuityStreakDays ?? 0;
  return (
    isPrimordialCoalitionContinuity(state) ||
    primordial >= PRIMORDIAL_COALITION_CONTINUITY_THRESHOLD
  );
}

/** Absolute sanctity streak after primordial continuity is sustained. */
export function advanceCoalitionAbsoluteSanctityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!absoluteSanctityEligible(state)) {
    if ((state.coalitionAbsoluteSanctityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionAbsoluteSanctityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionAbsoluteSanctityStreakDays:
      (state.coalitionAbsoluteSanctityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionAbsoluteSanctityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionAbsoluteSanctityStreakDays: 0 };
}

export function applyAbsoluteSanctityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isAbsoluteCoalitionSanctity(state)) return state;

  const bonusTotal = daysAdvanced * ABSOLUTE_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
