import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import type { CognitiveLoadAssessment } from './cognitive-load-governor.js';
import { snoozeCognitiveLoadCoachUntilDay } from './cognitive-load-governor.js';
import { snoozeFocusSessionUntilDay } from './focus-session-policy.js';

export interface CalmRecoveryPatch {
  calmRecoveryUntilDay: number;
  cognitiveLoadCoachSnoozedUntilDay: number;
  focusSessionSnoozedUntilDay: number;
  preferredDensity: 'spacious';
}

export function isCalmRecoveryActive(
  persisted: Pick<EvolvingUiPersistedState, 'calmRecoveryUntilDay'>,
  gameDay: number
): boolean {
  return persisted.calmRecoveryUntilDay != null && gameDay < persisted.calmRecoveryUntilDay;
}

export function buildCalmRecoveryPatch(
  assessment: CognitiveLoadAssessment,
  gameDay: number,
  calmDays = 2
): CalmRecoveryPatch | null {
  if (assessment.band !== 'heavy') return null;
  const untilDay = Math.max(gameDay + calmDays, gameDay + 1);
  return {
    calmRecoveryUntilDay: untilDay,
    cognitiveLoadCoachSnoozedUntilDay: snoozeCognitiveLoadCoachUntilDay(gameDay, calmDays),
    focusSessionSnoozedUntilDay: snoozeFocusSessionUntilDay(gameDay, calmDays),
    preferredDensity: 'spacious',
  };
}

export function mergeCalmRecoveryIntoPersisted(
  persisted: EvolvingUiPersistedState,
  patch: CalmRecoveryPatch
): EvolvingUiPersistedState {
  return {
    ...persisted,
    calmRecoveryUntilDay: patch.calmRecoveryUntilDay,
    cognitiveLoadCoachSnoozedUntilDay: Math.max(
      persisted.cognitiveLoadCoachSnoozedUntilDay ?? 0,
      patch.cognitiveLoadCoachSnoozedUntilDay
    ),
    focusSessionSnoozedUntilDay: Math.max(
      persisted.focusSessionSnoozedUntilDay ?? 0,
      patch.focusSessionSnoozedUntilDay
    ),
    preferredDensity: patch.preferredDensity,
  };
}

export function calmRecoveryCoachCopy(active: boolean): string {
  return active
    ? 'Calm recovery is active — coaching and focus prompts stay tucked away.'
    : 'Interface feels crowded? Calm recovery snoozes coaching and widens spacing for a few days.';
}
