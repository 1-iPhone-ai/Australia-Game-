import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  SUPREME_COALITION_CONVERGENCE_THRESHOLD,
  isSupremeCoalitionConvergence,
} from './coalition-supreme-convergence.ts';

export const APEX_COALITION_TRANSCENDENCE_THRESHOLD = 4;
const APEX_TRANSCENDENCE_MANDATE_BONUS_PER_DAY = 1;

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

export function isApexCoalitionTranscendence(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionApexTranscendenceStreakDays ?? 0) >= APEX_COALITION_TRANSCENDENCE_THRESHOLD
  );
}

function apexTranscendenceEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const supreme = state.coalitionSupremeConvergenceStreakDays ?? 0;
  return (
    isSupremeCoalitionConvergence(state) ||
    supreme >= SUPREME_COALITION_CONVERGENCE_THRESHOLD
  );
}

/** Apex transcendence streak after supreme convergence is sustained. */
export function advanceCoalitionApexTranscendenceStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!apexTranscendenceEligible(state)) {
    if ((state.coalitionApexTranscendenceStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionApexTranscendenceStreakDays: 0 };
  }
  return {
    ...state,
    coalitionApexTranscendenceStreakDays:
      (state.coalitionApexTranscendenceStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionApexTranscendenceStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionApexTranscendenceStreakDays: 0 };
}

export function applyApexTranscendenceMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isApexCoalitionTranscendence(state)) return state;

  const bonusTotal = daysAdvanced * APEX_TRANSCENDENCE_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
