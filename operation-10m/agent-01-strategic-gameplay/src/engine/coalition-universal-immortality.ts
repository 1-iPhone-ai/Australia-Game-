import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  ABSOLUTE_COALITION_SANCTITY_THRESHOLD,
  isAbsoluteCoalitionSanctity,
} from './coalition-absolute-sanctity.ts';

export const UNIVERSAL_COALITION_IMMORTALITY_THRESHOLD = 4;
const UNIVERSAL_MANDATE_BONUS_PER_DAY = 1;

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

export function isUniversalCoalitionImmortality(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionUniversalImmortalityStreakDays ?? 0) >= UNIVERSAL_COALITION_IMMORTALITY_THRESHOLD
  );
}

function universalImmortalityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const absolute = state.coalitionAbsoluteSanctityStreakDays ?? 0;
  return (
    isAbsoluteCoalitionSanctity(state) || absolute >= ABSOLUTE_COALITION_SANCTITY_THRESHOLD
  );
}

/** Universal immortality streak after absolute sanctity is sustained. */
export function advanceCoalitionUniversalImmortalityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!universalImmortalityEligible(state)) {
    if ((state.coalitionUniversalImmortalityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionUniversalImmortalityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionUniversalImmortalityStreakDays:
      (state.coalitionUniversalImmortalityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionUniversalImmortalityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionUniversalImmortalityStreakDays: 0 };
}

export function applyUniversalImmortalityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isUniversalCoalitionImmortality(state)) return state;

  const bonusTotal = daysAdvanced * UNIVERSAL_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
