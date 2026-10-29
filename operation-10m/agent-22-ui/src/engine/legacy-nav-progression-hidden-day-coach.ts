import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { auditLegacyNavTargets } from './legacy-nav-audit-coach.js';

export interface LegacyNavProgressionHiddenDayCoach {
  hiddenTargetCount: number;
  coachCopy: string | null;
}

export function buildLegacyNavProgressionHiddenDayCoach(input: {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  nextGameDay: number;
}): LegacyNavProgressionHiddenDayCoach {
  const entries = auditLegacyNavTargets(input.signals, input.policy);
  const hidden = entries.filter(e => e.hasPatch && e.progressionWouldHide);
  if (!hidden.length) {
    return { hiddenTargetCount: 0, coachCopy: null };
  }
  const sample = hidden[0].target;
  const extra = hidden.length > 1 ? ` (+${hidden.length - 1} more)` : '';
  return {
    hiddenTargetCount: hidden.length,
    coachCopy: `Day ${input.nextGameDay}: Legacy nav "${sample}"${extra} resolves but panels stay hidden by progression.`,
  };
}
