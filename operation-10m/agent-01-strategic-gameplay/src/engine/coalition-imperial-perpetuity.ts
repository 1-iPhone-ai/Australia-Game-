import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  PARAMOUNT_COALITION_ASCENDANCY_THRESHOLD,
  isParamountCoalitionAscendancy,
} from './coalition-paramount-ascendancy.ts';

export const IMPERIAL_COALITION_PERPETUITY_THRESHOLD = 4;
const IMPERIAL_PERPETUITY_MANDATE_BONUS_PER_DAY = 1;

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

export function isImperialCoalitionPerpetuity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionImperialPerpetuityStreakDays ?? 0) >= IMPERIAL_COALITION_PERPETUITY_THRESHOLD
  );
}

function imperialPerpetuityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const paramount = state.coalitionParamountAscendancyStreakDays ?? 0;
  return (
    isParamountCoalitionAscendancy(state) || paramount >= PARAMOUNT_COALITION_ASCENDANCY_THRESHOLD
  );
}

/** Imperial perpetuity streak after paramount ascendancy is sustained. */
export function advanceCoalitionImperialPerpetuityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!imperialPerpetuityEligible(state)) {
    if ((state.coalitionImperialPerpetuityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionImperialPerpetuityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionImperialPerpetuityStreakDays:
      (state.coalitionImperialPerpetuityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionImperialPerpetuityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionImperialPerpetuityStreakDays: 0 };
}

export function applyImperialPerpetuityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isImperialCoalitionPerpetuity(state)) return state;

  const bonusTotal = daysAdvanced * IMPERIAL_PERPETUITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
