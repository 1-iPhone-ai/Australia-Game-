import { evaluateDayAdvanceCalmRecoveryHint } from './day-advance-calm-recovery-hint.js';
import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';

export interface DayAdvanceCalmRecoveryDayCoach {
  suggestCalmRecovery: boolean;
  alreadyActive: boolean;
  coachCopy: string | null;
}

export function buildDayAdvanceCalmRecoveryDayCoach(input: {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  persisted: EvolvingUiPersistedState;
  newlyUnlockedPanelCount: number;
  deferredAnnouncementCount: number;
  nextGameDay: number;
}): DayAdvanceCalmRecoveryDayCoach {
  const hint = evaluateDayAdvanceCalmRecoveryHint({
    signals: input.signals,
    policy: input.policy,
    persisted: input.persisted,
    newlyUnlockedPanelCount: input.newlyUnlockedPanelCount,
    deferredAnnouncementCount: input.deferredAnnouncementCount,
  });
  const coachCopy = hint.coachCopy ? `Day ${input.nextGameDay}: ${hint.coachCopy}` : null;
  return {
    suggestCalmRecovery: hint.suggestCalmRecovery,
    alreadyActive: hint.alreadyActive,
    coachCopy,
  };
}
