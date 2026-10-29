import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  ORACLE_COALITION_PERPETUITY_THRESHOLD,
  isOracleCoalitionPerpetuity,
} from './coalition-oracle-perpetuity.ts';

export const ARCHON_COALITION_ETERNITY_THRESHOLD = 4;
const ARCHON_ETERNITY_MANDATE_BONUS_PER_DAY = 1;

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

export function isArchonCoalitionEternity(state: StrategicGameplayState): boolean {
  return (state.coalitionArchonEternityStreakDays ?? 0) >= ARCHON_COALITION_ETERNITY_THRESHOLD;
}

function archonEternityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const oracle = state.coalitionOraclePerpetuityStreakDays ?? 0;
  return isOracleCoalitionPerpetuity(state) || oracle >= ORACLE_COALITION_PERPETUITY_THRESHOLD;
}

/** Archon eternity streak after oracle perpetuity is sustained. */
export function advanceCoalitionArchonEternityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!archonEternityEligible(state)) {
    if ((state.coalitionArchonEternityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionArchonEternityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionArchonEternityStreakDays: (state.coalitionArchonEternityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionArchonEternityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionArchonEternityStreakDays: 0 };
}

export function applyArchonEternityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isArchonCoalitionEternity(state)) return state;

  const bonusTotal = daysAdvanced * ARCHON_ETERNITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
