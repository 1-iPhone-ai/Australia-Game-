import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import { isPostStabilizationLockIn, POST_STABILIZATION_LOCK_IN_THRESHOLD } from './coalition-lock-in.ts';

export const INTEGRATED_COALITION_MATURITY_THRESHOLD = 2;
export const INTEGRATED_CROSS_MODULE_SYNC_MIN = 2;

const MATURITY_MANDATE_BONUS_PER_DAY = 1;

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

export function isIntegratedCoalitionMaturity(state: StrategicGameplayState): boolean {
  return (
    (state.integratedCoalitionMaturityStreakDays ?? 0) >= INTEGRATED_COALITION_MATURITY_THRESHOLD
  );
}

function integratedMaturityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  if ((state.crossModuleSyncStreakDays ?? 0) < INTEGRATED_CROSS_MODULE_SYNC_MIN) return false;
  const lockIn = state.coalitionLockInStreakDays ?? 0;
  return lockIn >= POST_STABILIZATION_LOCK_IN_THRESHOLD || isPostStabilizationLockIn(state);
}

/** Days where lock-in and cross-module sync both hold while volatility stays cleared. */
export function advanceIntegratedCoalitionMaturityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!integratedMaturityEligible(state)) {
    if ((state.integratedCoalitionMaturityStreakDays ?? 0) === 0) return state;
    return { ...state, integratedCoalitionMaturityStreakDays: 0 };
  }
  return {
    ...state,
    integratedCoalitionMaturityStreakDays:
      (state.integratedCoalitionMaturityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetIntegratedCoalitionMaturityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, integratedCoalitionMaturityStreakDays: 0 };
}

export function applyIntegratedCoalitionMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isIntegratedCoalitionMaturity(state)) return state;

  const bonusTotal = daysAdvanced * MATURITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
