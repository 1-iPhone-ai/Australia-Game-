import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  UNIVERSAL_COALITION_IMMORTALITY_THRESHOLD,
  isUniversalCoalitionImmortality,
} from './coalition-universal-immortality.ts';

export const COSMIC_COALITION_PERPETUITY_THRESHOLD = 4;
const COSMIC_MANDATE_BONUS_PER_DAY = 1;

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

export function isCosmicCoalitionPerpetuity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionCosmicPerpetuityStreakDays ?? 0) >= COSMIC_COALITION_PERPETUITY_THRESHOLD
  );
}

function cosmicPerpetuityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const universal = state.coalitionUniversalImmortalityStreakDays ?? 0;
  return (
    isUniversalCoalitionImmortality(state) ||
    universal >= UNIVERSAL_COALITION_IMMORTALITY_THRESHOLD
  );
}

/** Cosmic perpetuity streak after universal immortality is sustained. */
export function advanceCoalitionCosmicPerpetuityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!cosmicPerpetuityEligible(state)) {
    if ((state.coalitionCosmicPerpetuityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionCosmicPerpetuityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionCosmicPerpetuityStreakDays:
      (state.coalitionCosmicPerpetuityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionCosmicPerpetuityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionCosmicPerpetuityStreakDays: 0 };
}

export function applyCosmicPerpetuityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isCosmicCoalitionPerpetuity(state)) return state;

  const bonusTotal = daysAdvanced * COSMIC_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
