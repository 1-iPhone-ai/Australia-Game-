import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  COSMIC_COALITION_PERPETUITY_THRESHOLD,
  isCosmicCoalitionPerpetuity,
} from './coalition-cosmic-perpetuity.ts';

export const GALACTIC_COALITION_INFINITY_THRESHOLD = 4;
const GALACTIC_MANDATE_BONUS_PER_DAY = 1;

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

export function isGalacticCoalitionInfinity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionGalacticInfinityStreakDays ?? 0) >= GALACTIC_COALITION_INFINITY_THRESHOLD
  );
}

function galacticInfinityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const cosmic = state.coalitionCosmicPerpetuityStreakDays ?? 0;
  return (
    isCosmicCoalitionPerpetuity(state) || cosmic >= COSMIC_COALITION_PERPETUITY_THRESHOLD
  );
}

/** Galactic infinity streak after cosmic perpetuity is sustained. */
export function advanceCoalitionGalacticInfinityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!galacticInfinityEligible(state)) {
    if ((state.coalitionGalacticInfinityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionGalacticInfinityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionGalacticInfinityStreakDays:
      (state.coalitionGalacticInfinityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionGalacticInfinityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionGalacticInfinityStreakDays: 0 };
}

export function applyGalacticInfinityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isGalacticCoalitionInfinity(state)) return state;

  const bonusTotal = daysAdvanced * GALACTIC_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
