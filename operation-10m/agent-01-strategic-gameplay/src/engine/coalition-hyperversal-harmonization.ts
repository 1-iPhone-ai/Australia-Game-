import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  OMNIVERSAL_COALITION_SYNTHESIS_THRESHOLD,
  isOmniversalCoalitionSynthesis,
} from './coalition-omniversal-synthesis.ts';

export const HYPERVERSAL_COALITION_HARMONIZATION_THRESHOLD = 4;
const HYPERVERSAL_MANDATE_BONUS_PER_DAY = 1;

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

export function isHyperversalCoalitionHarmonization(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionHyperversalHarmonizationStreakDays ?? 0) >=
    HYPERVERSAL_COALITION_HARMONIZATION_THRESHOLD
  );
}

function hyperversalHarmonizationEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const omniversal = state.coalitionOmniversalSynthesisStreakDays ?? 0;
  return (
    isOmniversalCoalitionSynthesis(state) ||
    omniversal >= OMNIVERSAL_COALITION_SYNTHESIS_THRESHOLD
  );
}

/** Hyperversal harmonization streak after omniversal synthesis is sustained. */
export function advanceCoalitionHyperversalHarmonizationStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!hyperversalHarmonizationEligible(state)) {
    if ((state.coalitionHyperversalHarmonizationStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionHyperversalHarmonizationStreakDays: 0 };
  }
  return {
    ...state,
    coalitionHyperversalHarmonizationStreakDays:
      (state.coalitionHyperversalHarmonizationStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionHyperversalHarmonizationStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionHyperversalHarmonizationStreakDays: 0 };
}

export function applyHyperversalHarmonizationMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isHyperversalCoalitionHarmonization(state)) return state;

  const bonusTotal = daysAdvanced * HYPERVERSAL_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
