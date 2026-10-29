import type { MandateProgress, PriorityMandateTrack } from '../types/coalition-mandate.ts';
import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import {
  CIVILIZATIONAL_COALITION_ENDURANCE_THRESHOLD,
  isCivilizationalCoalitionEndurance,
} from './coalition-civilizational-endurance.ts';

export const TRANSCENDENT_COALITION_LEGACY_THRESHOLD = 4;
const TRANSCENDENT_MANDATE_BONUS_PER_DAY = 1;

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

export function isTranscendentCoalitionLegacy(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionTranscendentLegacyStreakDays ?? 0) >= TRANSCENDENT_COALITION_LEGACY_THRESHOLD
  );
}

function transcendentLegacyEligible(state: StrategicGameplayState): boolean {
  if (classifyCoalitionCrisisLevel(state) !== 'stable') return false;
  if ((state.coalitionVolatilityEvents ?? 0) > 0) return false;
  const endurance = state.coalitionCivilizationalEnduranceStreakDays ?? 0;
  return (
    isCivilizationalCoalitionEndurance(state) ||
    endurance >= CIVILIZATIONAL_COALITION_ENDURANCE_THRESHOLD
  );
}

/** Transcendent legacy streak after civilizational endurance is sustained. */
export function advanceCoalitionTranscendentLegacyStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (!transcendentLegacyEligible(state)) {
    if ((state.coalitionTranscendentLegacyStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionTranscendentLegacyStreakDays: 0 };
  }
  return {
    ...state,
    coalitionTranscendentLegacyStreakDays:
      (state.coalitionTranscendentLegacyStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionTranscendentLegacyStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionTranscendentLegacyStreakDays: 0 };
}

export function applyTranscendentLegacyMandateBonus(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0 || !isTranscendentCoalitionLegacy(state)) return state;

  const bonusTotal = daysAdvanced * TRANSCENDENT_MANDATE_BONUS_PER_DAY;
  const progress: MandateProgress = { ...(state.mandateProgress ?? {}) };
  for (const [priorityId, track] of Object.entries(progress)) {
    if (!track) continue;
    progress[priorityId as keyof MandateProgress] = boostTrack(track, bonusTotal);
  }

  return { ...state, mandateProgress: progress };
}
