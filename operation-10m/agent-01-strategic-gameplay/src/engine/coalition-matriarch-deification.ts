import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  MATRIARCH_COALITION_APOTHEOSIS_THRESHOLD,
  isMatriarchCoalitionApotheosis,
} from './coalition-matriarch-apotheosis.ts';

export const MATRIARCH_COALITION_DEIFICATION_THRESHOLD = 4;
const MATRIARCH_DEIFICATION_MANDATE_BONUS_PER_DAY = 1;

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

export function isMatriarchCoalitionDeification(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionMatriarchDeificationStreakDays ?? 0) >= MATRIARCH_COALITION_DEIFICATION_THRESHOLD
  );
}

function matriarchDeificationEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const transcendence = state.coalitionMatriarchApotheosisStreakDays ?? 0;
  return (
    isMatriarchCoalitionApotheosis(state) ||
    transcendence >= MATRIARCH_COALITION_APOTHEOSIS_THRESHOLD
  );
}

/** Matriarch deification streak after matriarch apotheosis is sustained. */
export function advanceCoalitionMatriarchDeificationStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!matriarchDeificationEligible(state)) {
    if ((state.coalitionMatriarchDeificationStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionMatriarchDeificationStreakDays: 0 };
  }
  return {
    ...state,
    coalitionMatriarchDeificationStreakDays:
      (state.coalitionMatriarchDeificationStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionMatriarchDeificationStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionMatriarchDeificationStreakDays: 0 };
}

export function applyMatriarchDeificationMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isMatriarchCoalitionDeification(state)) return state;

  const bonusTotal = daysAdvanced * MATRIARCH_DEIFICATION_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
