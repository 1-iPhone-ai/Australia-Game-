import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  SENTINEL_COALITION_ASCENDANCY_THRESHOLD,
  isSentinelCoalitionAscendancy,
} from './coalition-sentinel-ascendancy.ts';

export const ORACLE_COALITION_PERPETUITY_THRESHOLD = 4;
const ORACLE_PERPETUITY_MANDATE_BONUS_PER_DAY = 1;

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

export function isOracleCoalitionPerpetuity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionOraclePerpetuityStreakDays ?? 0) >= ORACLE_COALITION_PERPETUITY_THRESHOLD
  );
}

function oraclePerpetuityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const sentinel = state.coalitionSentinelAscendancyStreakDays ?? 0;
  return (
    isSentinelCoalitionAscendancy(state) || sentinel >= SENTINEL_COALITION_ASCENDANCY_THRESHOLD
  );
}

/** Oracle perpetuity streak after sentinel ascendancy is sustained. */
export function advanceCoalitionOraclePerpetuityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!oraclePerpetuityEligible(state)) {
    if ((state.coalitionOraclePerpetuityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionOraclePerpetuityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionOraclePerpetuityStreakDays:
      (state.coalitionOraclePerpetuityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionOraclePerpetuityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionOraclePerpetuityStreakDays: 0 };
}

export function applyOraclePerpetuityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isOracleCoalitionPerpetuity(state)) return state;

  const bonusTotal = daysAdvanced * ORACLE_PERPETUITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
