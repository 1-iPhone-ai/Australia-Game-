import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { auditLegacyNavTargets } from './legacy-nav-audit-coach.js';

export interface LegacyNavMissingPatchDayCoach {
  missingPatchCount: number;
  coachCopy: string | null;
}

export function buildLegacyNavMissingPatchDayCoach(input: {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  nextGameDay: number;
}): LegacyNavMissingPatchDayCoach {
  const entries = auditLegacyNavTargets(input.signals, input.policy);
  const missing = entries.filter(e => !e.hasPatch);
  if (!missing.length) {
    return { missingPatchCount: 0, coachCopy: null };
  }
  return {
    missingPatchCount: missing.length,
    coachCopy: `Day ${input.nextGameDay}: ${missing.length} legacy nav targets lack UI patches — deep links may noop.`,
  };
}
