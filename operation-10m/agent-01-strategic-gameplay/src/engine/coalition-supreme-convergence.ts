import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  TRANSCENDENT_COALITION_OMNIUM_THRESHOLD,
  isTranscendentCoalitionOmnium,
} from './coalition-transcendent-omnium.ts';

export const SUPREME_COALITION_CONVERGENCE_THRESHOLD = 4;
const SUPREME_CONVERGENCE_MANDATE_BONUS_PER_DAY = 1;

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

export function isSupremeCoalitionConvergence(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionSupremeConvergenceStreakDays ?? 0) >= SUPREME_COALITION_CONVERGENCE_THRESHOLD
  );
}

function supremeConvergenceEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const transcendent = state.coalitionTranscendentOmniumStreakDays ?? 0;
  return (
    isTranscendentCoalitionOmnium(state) ||
    transcendent >= TRANSCENDENT_COALITION_OMNIUM_THRESHOLD
  );
}

/** Supreme convergence streak after transcendent omnium is sustained. */
export function advanceCoalitionSupremeConvergenceStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!supremeConvergenceEligible(state)) {
    if ((state.coalitionSupremeConvergenceStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionSupremeConvergenceStreakDays: 0 };
  }
  return {
    ...state,
    coalitionSupremeConvergenceStreakDays:
      (state.coalitionSupremeConvergenceStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionSupremeConvergenceStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionSupremeConvergenceStreakDays: 0 };
}

export function applySupremeConvergenceMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isSupremeCoalitionConvergence(state)) return state;

  const bonusTotal = daysAdvanced * SUPREME_CONVERGENCE_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
