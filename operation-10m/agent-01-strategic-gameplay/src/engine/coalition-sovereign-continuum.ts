import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  TRANSCENDENT_COALITION_LEGACY_THRESHOLD,
  isTranscendentCoalitionLegacy,
} from './coalition-transcendent-legacy.ts';

export const SOVEREIGN_COALITION_CONTINUUM_THRESHOLD = 4;
const SOVEREIGN_MANDATE_BONUS_PER_DAY = 1;

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

export function isSovereignCoalitionContinuum(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionSovereignContinuumStreakDays ?? 0) >= SOVEREIGN_COALITION_CONTINUUM_THRESHOLD
  );
}

function sovereignContinuumEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const legacy = state.coalitionTranscendentLegacyStreakDays ?? 0;
  return (
    isTranscendentCoalitionLegacy(state) || legacy >= TRANSCENDENT_COALITION_LEGACY_THRESHOLD
  );
}

/** Sovereign continuum streak after transcendent legacy is sustained. */
export function advanceCoalitionSovereignContinuumStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!sovereignContinuumEligible(state)) {
    if ((state.coalitionSovereignContinuumStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionSovereignContinuumStreakDays: 0 };
  }
  return {
    ...state,
    coalitionSovereignContinuumStreakDays:
      (state.coalitionSovereignContinuumStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionSovereignContinuumStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionSovereignContinuumStreakDays: 0 };
}

export function applySovereignContinuumMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isSovereignCoalitionContinuum(state)) return state;

  const bonusTotal = daysAdvanced * SOVEREIGN_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
