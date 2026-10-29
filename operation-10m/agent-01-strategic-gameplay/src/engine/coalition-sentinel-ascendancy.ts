import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  VANGUARD_COALITION_SYNTHESIS_THRESHOLD,
  isVanguardCoalitionSynthesis,
} from './coalition-vanguard-synthesis.ts';

export const SENTINEL_COALITION_ASCENDANCY_THRESHOLD = 4;
const SENTINEL_ASCENDANCY_MANDATE_BONUS_PER_DAY = 1;

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

export function isSentinelCoalitionAscendancy(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionSentinelAscendancyStreakDays ?? 0) >= SENTINEL_COALITION_ASCENDANCY_THRESHOLD
  );
}

function sentinelAscendancyEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const vanguard = state.coalitionVanguardSynthesisStreakDays ?? 0;
  return (
    isVanguardCoalitionSynthesis(state) || vanguard >= VANGUARD_COALITION_SYNTHESIS_THRESHOLD
  );
}

/** Sentinel ascendancy streak after vanguard synthesis is sustained. */
export function advanceCoalitionSentinelAscendancyStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!sentinelAscendancyEligible(state)) {
    if ((state.coalitionSentinelAscendancyStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionSentinelAscendancyStreakDays: 0 };
  }
  return {
    ...state,
    coalitionSentinelAscendancyStreakDays:
      (state.coalitionSentinelAscendancyStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionSentinelAscendancyStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionSentinelAscendancyStreakDays: 0 };
}

export function applySentinelAscendancyMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isSentinelCoalitionAscendancy(state)) return state;

  const bonusTotal = daysAdvanced * SENTINEL_ASCENDANCY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
