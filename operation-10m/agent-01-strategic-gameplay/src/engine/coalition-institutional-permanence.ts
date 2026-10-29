import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  ANCHORED_COALITION_GOVERNANCE_THRESHOLD,
  isAnchoredCoalitionGovernance,
} from './coalition-anchored-governance.ts';

export const INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD = 4;
const PERMANENCE_MANDATE_BONUS_PER_DAY = 1;

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

export function isInstitutionalCoalitionPermanence(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionInstitutionalPermanenceStreakDays ?? 0) >=
    INSTITUTIONAL_COALITION_PERMANENCE_THRESHOLD
  );
}

function institutionalPermanenceEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const anchored = state.coalitionAnchoredGovernanceStreakDays ?? 0;
  return (
    isAnchoredCoalitionGovernance(state) ||
    anchored >= ANCHORED_COALITION_GOVERNANCE_THRESHOLD
  );
}

/** Institutional permanence streak after anchored governance is sustained. */
export function advanceCoalitionInstitutionalPermanenceStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!institutionalPermanenceEligible(state)) {
    if ((state.coalitionInstitutionalPermanenceStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionInstitutionalPermanenceStreakDays: 0 };
  }
  return {
    ...state,
    coalitionInstitutionalPermanenceStreakDays:
      (state.coalitionInstitutionalPermanenceStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionInstitutionalPermanenceStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionInstitutionalPermanenceStreakDays: 0 };
}

export function applyInstitutionalPermanenceMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isInstitutionalCoalitionPermanence(state)) return state;

  const bonusTotal = daysAdvanced * PERMANENCE_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
