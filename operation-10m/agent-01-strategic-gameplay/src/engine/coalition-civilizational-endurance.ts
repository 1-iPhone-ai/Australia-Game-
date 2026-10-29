import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  GENERATIONAL_COALITION_CONTINUITY_THRESHOLD,
  isGenerationalCoalitionContinuity,
} from './coalition-generational-continuity.ts';

export const CIVILIZATIONAL_COALITION_ENDURANCE_THRESHOLD = 4;
const CIVILIZATIONAL_MANDATE_BONUS_PER_DAY = 1;

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

export function isCivilizationalCoalitionEndurance(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionCivilizationalEnduranceStreakDays ?? 0) >=
    CIVILIZATIONAL_COALITION_ENDURANCE_THRESHOLD
  );
}

function civilizationalEnduranceEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const generational = state.coalitionGenerationalContinuityStreakDays ?? 0;
  return (
    isGenerationalCoalitionContinuity(state) ||
    generational >= GENERATIONAL_COALITION_CONTINUITY_THRESHOLD
  );
}

/** Civilizational endurance streak after generational continuity is sustained. */
export function advanceCoalitionCivilizationalEnduranceStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!civilizationalEnduranceEligible(state)) {
    if ((state.coalitionCivilizationalEnduranceStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionCivilizationalEnduranceStreakDays: 0 };
  }
  return {
    ...state,
    coalitionCivilizationalEnduranceStreakDays:
      (state.coalitionCivilizationalEnduranceStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionCivilizationalEnduranceStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionCivilizationalEnduranceStreakDays: 0 };
}

export function applyCivilizationalEnduranceMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isCivilizationalCoalitionEndurance(state)) return state;

  const bonusTotal = daysAdvanced * CIVILIZATIONAL_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
