import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  isSustainedIntegratedCoalitionStewardship,
  SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD,
} from './coalition-stewardship.ts';

export const ANCHORED_COALITION_GOVERNANCE_THRESHOLD = 4;
const ANCHORED_MANDATE_BONUS_PER_DAY = 1;

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

export function isAnchoredCoalitionGovernance(state: StrategicGameplayState): boolean {
  return (state.coalitionAnchoredGovernanceStreakDays ?? 0) >= ANCHORED_COALITION_GOVERNANCE_THRESHOLD;
}

function anchoredGovernanceEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const stewardship = state.coalitionStewardshipStreakDays ?? 0;
  return (
    isSustainedIntegratedCoalitionStewardship(state) ||
    stewardship >= SUSTAINED_INTEGRATED_STEWARDSHIP_THRESHOLD
  );
}

/** Governance anchor streak after integrated stewardship is sustained. */
export function advanceCoalitionAnchoredGovernanceStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!anchoredGovernanceEligible(state)) {
    if ((state.coalitionAnchoredGovernanceStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionAnchoredGovernanceStreakDays: 0 };
  }
  return {
    ...state,
    coalitionAnchoredGovernanceStreakDays:
      (state.coalitionAnchoredGovernanceStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionAnchoredGovernanceStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionAnchoredGovernanceStreakDays: 0 };
}

export function applyAnchoredGovernanceMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isAnchoredCoalitionGovernance(state)) return state;

  const bonusTotal = daysAdvanced * ANCHORED_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
