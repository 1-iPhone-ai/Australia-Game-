import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  PRIMARCH_COALITION_PERPETUITY_THRESHOLD,
  isPrimarchCoalitionPerpetuity,
} from './coalition-primarch-perpetuity.ts';

export const PATRIARCH_COALITION_ETERNITY_THRESHOLD = 4;
const PATRIARCH_ETERNITY_MANDATE_BONUS_PER_DAY = 1;

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

export function isPatriarchCoalitionEternity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionPatriarchEternityStreakDays ?? 0) >= PATRIARCH_COALITION_ETERNITY_THRESHOLD
  );
}

function patriarchEternityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const primarch = state.coalitionPrimarchPerpetuityStreakDays ?? 0;
  return (
    isPrimarchCoalitionPerpetuity(state) || primarch >= PRIMARCH_COALITION_PERPETUITY_THRESHOLD
  );
}

/** Patriarch eternity streak after primarch perpetuity is sustained. */
export function advanceCoalitionPatriarchEternityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!patriarchEternityEligible(state)) {
    if ((state.coalitionPatriarchEternityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionPatriarchEternityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionPatriarchEternityStreakDays:
      (state.coalitionPatriarchEternityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionPatriarchEternityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionPatriarchEternityStreakDays: 0 };
}

export function applyPatriarchEternityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isPatriarchCoalitionEternity(state)) return state;

  const bonusTotal = daysAdvanced * PATRIARCH_ETERNITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
