import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  MATRIARCH_COALITION_OMNIPOTENCE_THRESHOLD,
  isMatriarchCoalitionOmnipotence,
} from './coalition-matriarch-omnipotence.ts';

export const MATRIARCH_COALITION_SOVEREIGNTY_THRESHOLD = 4;
const MATRIARCH_SOVEREIGNTY_MANDATE_BONUS_PER_DAY = 1;

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

export function isMatriarchCoalitionSovereignty(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionMatriarchSovereigntyStreakDays ?? 0) >= MATRIARCH_COALITION_SOVEREIGNTY_THRESHOLD
  );
}

function matriarchSovereigntyEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const omnipotence = state.coalitionMatriarchOmnipotenceStreakDays ?? 0;
  return (
    isMatriarchCoalitionOmnipotence(state) ||
    omnipotence >= MATRIARCH_COALITION_OMNIPOTENCE_THRESHOLD
  );
}

/** Matriarch sovereignty streak after matriarch omnipotence is sustained. */
export function advanceCoalitionMatriarchSovereigntyStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!matriarchSovereigntyEligible(state)) {
    if ((state.coalitionMatriarchSovereigntyStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionMatriarchSovereigntyStreakDays: 0 };
  }
  return {
    ...state,
    coalitionMatriarchSovereigntyStreakDays:
      (state.coalitionMatriarchSovereigntyStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionMatriarchSovereigntyStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionMatriarchSovereigntyStreakDays: 0 };
}

export function applyMatriarchSovereigntyMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isMatriarchCoalitionSovereignty(state)) return state;

  const bonusTotal = daysAdvanced * MATRIARCH_SOVEREIGNTY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
