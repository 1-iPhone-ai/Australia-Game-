import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  SOVEREIGN_COALITION_CONTINUUM_THRESHOLD,
  isSovereignCoalitionContinuum,
} from './coalition-sovereign-continuum.ts';

export const ETERNAL_COALITION_ASCENDANCE_THRESHOLD = 4;
const ETERNAL_MANDATE_BONUS_PER_DAY = 1;

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

export function isEternalCoalitionAscendance(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionEternalAscendanceStreakDays ?? 0) >= ETERNAL_COALITION_ASCENDANCE_THRESHOLD
  );
}

function eternalAscendanceEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const sovereign = state.coalitionSovereignContinuumStreakDays ?? 0;
  return (
    isSovereignCoalitionContinuum(state) || sovereign >= SOVEREIGN_COALITION_CONTINUUM_THRESHOLD
  );
}

/** Eternal ascendance streak after sovereign continuum is sustained. */
export function advanceCoalitionEternalAscendanceStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!eternalAscendanceEligible(state)) {
    if ((state.coalitionEternalAscendanceStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionEternalAscendanceStreakDays: 0 };
  }
  return {
    ...state,
    coalitionEternalAscendanceStreakDays:
      (state.coalitionEternalAscendanceStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionEternalAscendanceStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionEternalAscendanceStreakDays: 0 };
}

export function applyEternalAscendanceMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isEternalCoalitionAscendance(state)) return state;

  const bonusTotal = daysAdvanced * ETERNAL_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
