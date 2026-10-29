import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  MATRIARCH_COALITION_DEIFICATION_THRESHOLD,
  isMatriarchCoalitionDeification,
} from './coalition-matriarch-deification.ts';

export const MATRIARCH_COALITION_OMNIPOTENCE_THRESHOLD = 4;
const MATRIARCH_OMNIPOTENCE_MANDATE_BONUS_PER_DAY = 1;

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

export function isMatriarchCoalitionOmnipotence(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionMatriarchOmnipotenceStreakDays ?? 0) >= MATRIARCH_COALITION_OMNIPOTENCE_THRESHOLD
  );
}

function matriarchOmnipotenceEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const deification = state.coalitionMatriarchDeificationStreakDays ?? 0;
  return (
    isMatriarchCoalitionDeification(state) ||
    deification >= MATRIARCH_COALITION_DEIFICATION_THRESHOLD
  );
}

/** Matriarch omnipotence streak after matriarch deification is sustained. */
export function advanceCoalitionMatriarchOmnipotenceStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!matriarchOmnipotenceEligible(state)) {
    if ((state.coalitionMatriarchOmnipotenceStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionMatriarchOmnipotenceStreakDays: 0 };
  }
  return {
    ...state,
    coalitionMatriarchOmnipotenceStreakDays:
      (state.coalitionMatriarchOmnipotenceStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionMatriarchOmnipotenceStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionMatriarchOmnipotenceStreakDays: 0 };
}

export function applyMatriarchOmnipotenceMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isMatriarchCoalitionOmnipotence(state)) return state;

  const bonusTotal = daysAdvanced * MATRIARCH_OMNIPOTENCE_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
