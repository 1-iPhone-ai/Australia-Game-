import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  MATRIARCH_COALITION_TRANSCENDENCE_THRESHOLD,
  isMatriarchCoalitionTranscendence,
} from './coalition-matriarch-transcendence.ts';

export const MATRIARCH_COALITION_APOTHEOSIS_THRESHOLD = 4;
const MATRIARCH_APOTHEOSIS_MANDATE_BONUS_PER_DAY = 1;

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

export function isMatriarchCoalitionApotheosis(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionMatriarchApotheosisStreakDays ?? 0) >= MATRIARCH_COALITION_APOTHEOSIS_THRESHOLD
  );
}

function matriarchApotheosisEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const transcendence = state.coalitionMatriarchTranscendenceStreakDays ?? 0;
  return (
    isMatriarchCoalitionTranscendence(state) ||
    transcendence >= MATRIARCH_COALITION_TRANSCENDENCE_THRESHOLD
  );
}

/** Matriarch apotheosis streak after matriarch transcendence is sustained. */
export function advanceCoalitionMatriarchApotheosisStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!matriarchApotheosisEligible(state)) {
    if ((state.coalitionMatriarchApotheosisStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionMatriarchApotheosisStreakDays: 0 };
  }
  return {
    ...state,
    coalitionMatriarchApotheosisStreakDays:
      (state.coalitionMatriarchApotheosisStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionMatriarchApotheosisStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionMatriarchApotheosisStreakDays: 0 };
}

export function applyMatriarchApotheosisMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isMatriarchCoalitionApotheosis(state)) return state;

  const bonusTotal = daysAdvanced * MATRIARCH_APOTHEOSIS_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
