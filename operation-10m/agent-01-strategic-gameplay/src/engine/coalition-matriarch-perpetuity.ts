import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  MATRIARCH_COALITION_ASCENDANCY_THRESHOLD,
  isMatriarchCoalitionAscendancy,
} from './coalition-matriarch-ascendancy.ts';

export const MATRIARCH_COALITION_PERPETUITY_THRESHOLD = 4;
const MATRIARCH_PERPETUITY_MANDATE_BONUS_PER_DAY = 1;

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

export function isMatriarchCoalitionPerpetuity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionMatriarchPerpetuityStreakDays ?? 0) >= MATRIARCH_COALITION_PERPETUITY_THRESHOLD
  );
}

function matriarchPerpetuityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const ascendancy = state.coalitionMatriarchAscendancyStreakDays ?? 0;
  return (
    isMatriarchCoalitionAscendancy(state) || ascendancy >= MATRIARCH_COALITION_ASCENDANCY_THRESHOLD
  );
}

/** Matriarch perpetuity streak after matriarch ascendancy is sustained. */
export function advanceCoalitionMatriarchPerpetuityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!matriarchPerpetuityEligible(state)) {
    if ((state.coalitionMatriarchPerpetuityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionMatriarchPerpetuityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionMatriarchPerpetuityStreakDays:
      (state.coalitionMatriarchPerpetuityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionMatriarchPerpetuityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionMatriarchPerpetuityStreakDays: 0 };
}

export function applyMatriarchPerpetuityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isMatriarchCoalitionPerpetuity(state)) return state;

  const bonusTotal = daysAdvanced * MATRIARCH_PERPETUITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
