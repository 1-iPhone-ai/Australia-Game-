import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  MATRIARCH_COALITION_PERPETUITY_THRESHOLD,
  isMatriarchCoalitionPerpetuity,
} from './coalition-matriarch-perpetuity.ts';

export const MATRIARCH_COALITION_ETERNITY_THRESHOLD = 4;
const MATRIARCH_ETERNITY_MANDATE_BONUS_PER_DAY = 1;

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

export function isMatriarchCoalitionEternity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionMatriarchEternityStreakDays ?? 0) >= MATRIARCH_COALITION_ETERNITY_THRESHOLD
  );
}

function matriarchEternityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const perpetuity = state.coalitionMatriarchPerpetuityStreakDays ?? 0;
  return (
    isMatriarchCoalitionPerpetuity(state) || perpetuity >= MATRIARCH_COALITION_PERPETUITY_THRESHOLD
  );
}

/** Matriarch eternity streak after matriarch perpetuity is sustained. */
export function advanceCoalitionMatriarchEternityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!matriarchEternityEligible(state)) {
    if ((state.coalitionMatriarchEternityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionMatriarchEternityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionMatriarchEternityStreakDays:
      (state.coalitionMatriarchEternityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionMatriarchEternityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionMatriarchEternityStreakDays: 0 };
}

export function applyMatriarchEternityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isMatriarchCoalitionEternity(state)) return state;

  const bonusTotal = daysAdvanced * MATRIARCH_ETERNITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
