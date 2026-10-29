import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  QUANTUM_COALITION_OMNIPRESENCE_THRESHOLD,
  isQuantumCoalitionOmnipresence,
} from './coalition-quantum-omnipresence.ts';

export const MULTIVERSAL_COALITION_PERSISTENCE_THRESHOLD = 4;
const MULTIVERSAL_MANDATE_BONUS_PER_DAY = 1;

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

export function isMultiversalCoalitionPersistence(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionMultiversalPersistenceStreakDays ?? 0) >=
    MULTIVERSAL_COALITION_PERSISTENCE_THRESHOLD
  );
}

function multiversalPersistenceEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const quantum = state.coalitionQuantumOmnipresenceStreakDays ?? 0;
  return (
    isQuantumCoalitionOmnipresence(state) || quantum >= QUANTUM_COALITION_OMNIPRESENCE_THRESHOLD
  );
}

/** Multiversal persistence streak after quantum omnipresence is sustained. */
export function advanceCoalitionMultiversalPersistenceStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!multiversalPersistenceEligible(state)) {
    if ((state.coalitionMultiversalPersistenceStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionMultiversalPersistenceStreakDays: 0 };
  }
  return {
    ...state,
    coalitionMultiversalPersistenceStreakDays:
      (state.coalitionMultiversalPersistenceStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionMultiversalPersistenceStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionMultiversalPersistenceStreakDays: 0 };
}

export function applyMultiversalPersistenceMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isMultiversalCoalitionPersistence(state)) return state;

  const bonusTotal = daysAdvanced * MULTIVERSAL_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
