import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  APEX_COALITION_TRANSCENDENCE_THRESHOLD,
  isApexCoalitionTranscendence,
} from './coalition-apex-transcendence.ts';

export const ZENITH_COALITION_PERPETUITY_THRESHOLD = 4;
const ZENITH_PERPETUITY_MANDATE_BONUS_PER_DAY = 1;

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

export function isZenithCoalitionPerpetuity(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionZenithPerpetuityStreakDays ?? 0) >= ZENITH_COALITION_PERPETUITY_THRESHOLD
  );
}

function zenithPerpetuityEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const apex = state.coalitionApexTranscendenceStreakDays ?? 0;
  return (
    isApexCoalitionTranscendence(state) || apex >= APEX_COALITION_TRANSCENDENCE_THRESHOLD
  );
}

/** Zenith perpetuity streak after apex transcendence is sustained. */
export function advanceCoalitionZenithPerpetuityStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!zenithPerpetuityEligible(state)) {
    if ((state.coalitionZenithPerpetuityStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionZenithPerpetuityStreakDays: 0 };
  }
  return {
    ...state,
    coalitionZenithPerpetuityStreakDays:
      (state.coalitionZenithPerpetuityStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionZenithPerpetuityStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionZenithPerpetuityStreakDays: 0 };
}

export function applyZenithPerpetuityMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isZenithCoalitionPerpetuity(state)) return state;

  const bonusTotal = daysAdvanced * ZENITH_PERPETUITY_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
