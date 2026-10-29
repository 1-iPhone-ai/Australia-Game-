import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  EXARCH_COALITION_ASCENDANCY_THRESHOLD,
  isExarchCoalitionAscendancy,
} from './coalition-exarch-ascendancy.ts';

export const PRIMARCH_COALITION_PERPETUITY_THRESHOLD = 4;
const PRIMARCH_PERPETUITY_MANDATE_BONUS_PER_DAY = 1;

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

export function isPrimarchCoalitionPerpetuity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionPrimarchPerpetuityStreakDays ?? 0) >= PRIMARCH_COALITION_PERPETUITY_THRESHOLD
  );
}

function primarchPerpetuityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const exarch = state.coalitionExarchAscendancyStreakDays ?? 0;
  return isExarchCoalitionAscendancy(state) || exarch >= EXARCH_COALITION_ASCENDANCY_THRESHOLD;
}

/** Primarch perpetuity streak after exarch ascendancy is sustained. */
export function advanceCoalitionPrimarchPerpetuityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!primarchPerpetuityEligible(state)) {
    if ((state.coalitionPrimarchPerpetuityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionPrimarchPerpetuityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionPrimarchPerpetuityStreakDays:
      (state.coalitionPrimarchPerpetuityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionPrimarchPerpetuityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionPrimarchPerpetuityStreakDays: 0 };
}

export function applyPrimarchPerpetuityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isPrimarchCoalitionPerpetuity(state)) return state;

  const bonusTotal = daysAdvanced * PRIMARCH_PERPETUITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
