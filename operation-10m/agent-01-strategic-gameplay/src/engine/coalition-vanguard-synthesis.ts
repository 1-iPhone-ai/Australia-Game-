import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  CUSTODIAL_COALITION_ETERNITY_THRESHOLD,
  isCustodialCoalitionEternity,
} from './coalition-custodial-eternity.ts';

export const VANGUARD_COALITION_SYNTHESIS_THRESHOLD = 4;
const VANGUARD_SYNTHESIS_MANDATE_BONUS_PER_DAY = 1;

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

export function isVanguardCoalitionSynthesis(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionVanguardSynthesisStreakDays ?? 0) >= VANGUARD_COALITION_SYNTHESIS_THRESHOLD
  );
}

function vanguardSynthesisEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const custodial = state.coalitionCustodialEternityStreakDays ?? 0;
  return (
    isCustodialCoalitionEternity(state) || custodial >= CUSTODIAL_COALITION_ETERNITY_THRESHOLD
  );
}

/** Vanguard synthesis streak after custodial eternity is sustained. */
export function advanceCoalitionVanguardSynthesisStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!vanguardSynthesisEligible(state)) {
    if ((state.coalitionVanguardSynthesisStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionVanguardSynthesisStreakDays: 0 };
  }
  return {
    ...state,
    coalitionVanguardSynthesisStreakDays:
      (state.coalitionVanguardSynthesisStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionVanguardSynthesisStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionVanguardSynthesisStreakDays: 0 };
}

export function applyVanguardSynthesisMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isVanguardCoalitionSynthesis(state)) return state;

  const bonusTotal = daysAdvanced * VANGUARD_SYNTHESIS_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
