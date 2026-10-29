import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import type { DayAdvanceCalmRecoveryHint } from './day-advance-calm-recovery-hint.js';
import {
  isCalmRecoveryActive,
  mergeCalmRecoveryIntoPersisted,
} from './ui-calm-recovery-policy.js';

export interface CalmRecoveryAutoApplyResult {
  applied: boolean;
  persisted: EvolvingUiPersistedState;
  coachCopy: string | null;
}

/** Merges calm-recovery patch from a day-advance hint when the host opts into auto-apply. */
export function applyCalmRecoveryFromDayAdvanceHint(
  persisted: EvolvingUiPersistedState,
  hint: DayAdvanceCalmRecoveryHint,
  gameDay: number,
  options?: { autoApply?: boolean }
): CalmRecoveryAutoApplyResult {
  const autoApply = options?.autoApply !== false;

  if (hint.alreadyActive) {
    return {
      applied: false,
      persisted,
      coachCopy: hint.coachCopy,
    };
  }

  if (!autoApply || !hint.suggestCalmRecovery || !hint.patch) {
    return {
      applied: false,
      persisted,
      coachCopy: hint.coachCopy,
    };
  }

  const merged = mergeCalmRecoveryIntoPersisted(persisted, hint.patch);
  const active = isCalmRecoveryActive(merged, gameDay);

  return {
    applied: true,
    persisted: merged,
    coachCopy: active
      ? 'Calm recovery applied for this busy unlock day — coaches snooze and spacing widens.'
      : hint.coachCopy,
  };
}
