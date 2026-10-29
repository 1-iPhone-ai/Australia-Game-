import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import { assessCognitiveLoad } from './cognitive-load-governor.js';
import { buildCalmRecoveryPatch, isCalmRecoveryActive } from './ui-calm-recovery-policy.js';

export interface DayAdvanceCalmRecoveryHint {
  suggestCalmRecovery: boolean;
  alreadyActive: boolean;
  coachCopy: string | null;
  patch: ReturnType<typeof buildCalmRecoveryPatch> | null;
}

export function evaluateDayAdvanceCalmRecoveryHint(input: {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  persisted: EvolvingUiPersistedState;
  newlyUnlockedPanelCount: number;
  deferredAnnouncementCount: number;
}): DayAdvanceCalmRecoveryHint {
  const alreadyActive = isCalmRecoveryActive(input.persisted, input.signals.gameDay);
  if (alreadyActive) {
    return {
      suggestCalmRecovery: false,
      alreadyActive: true,
      coachCopy: 'Calm recovery remains active from a prior session.',
      patch: null,
    };
  }

  const load = assessCognitiveLoad({
    signals: input.signals,
    policy: input.policy,
    pendingCoachAnnouncements: input.deferredAnnouncementCount,
  });

  const stressful =
    load.band === 'heavy' ||
    (input.newlyUnlockedPanelCount >= 3 && input.deferredAnnouncementCount >= 2);

  const patch = buildCalmRecoveryPatch(load, input.signals.gameDay);
  const suggestCalmRecovery = stressful && patch != null;

  let coachCopy: string | null = null;
  if (suggestCalmRecovery) {
    coachCopy = 'Busy unlock day — calm recovery can snooze coaches and widen spacing.';
  }

  return {
    suggestCalmRecovery,
    alreadyActive: false,
    coachCopy,
    patch,
  };
}
