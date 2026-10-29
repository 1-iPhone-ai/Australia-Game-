import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  GALACTIC_COALITION_INFINITY_THRESHOLD,
  isGalacticCoalitionInfinity,
} from './coalition-galactic-infinity.ts';

export const STELLAR_COALITION_TRANSCENDENCE_THRESHOLD = 4;
const STELLAR_MANDATE_BONUS_PER_DAY = 1;

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

export function isStellarCoalitionTranscendence(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionStellarTranscendenceStreakDays ?? 0) >= STELLAR_COALITION_TRANSCENDENCE_THRESHOLD
  );
}

function stellarTranscendenceEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const galactic = state.coalitionGalacticInfinityStreakDays ?? 0;
  return (
    isGalacticCoalitionInfinity(state) || galactic >= GALACTIC_COALITION_INFINITY_THRESHOLD
  );
}

/** Stellar transcendence streak after galactic infinity is sustained. */
export function advanceCoalitionStellarTranscendenceStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!stellarTranscendenceEligible(state)) {
    if ((state.coalitionStellarTranscendenceStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionStellarTranscendenceStreakDays: 0 };
  }
  return {
    ...state,
    coalitionStellarTranscendenceStreakDays:
      (state.coalitionStellarTranscendenceStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionStellarTranscendenceStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionStellarTranscendenceStreakDays: 0 };
}

export function applyStellarTranscendenceMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isStellarCoalitionTranscendence(state)) return state;

  const bonusTotal = daysAdvanced * STELLAR_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
