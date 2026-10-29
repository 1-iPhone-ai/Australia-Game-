import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import {
  auditLegacyNavTargets,
  countLegacyNavPatchCoverage,
  legacyNavAuditCoachCopy,
} from './legacy-nav-audit-coach.js';

export interface LegacyNavAuditDayCoach {
  patchCoverageCount: number;
  auditIssueCount: number;
  coachCopy: string | null;
}

export function buildLegacyNavAuditDayCoach(input: {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  nextGameDay: number;
}): LegacyNavAuditDayCoach {
  const entries = auditLegacyNavTargets(input.signals, input.policy);
  const patchCoverageCount = countLegacyNavPatchCoverage(entries);
  const base = legacyNavAuditCoachCopy(entries);
  const auditIssueCount = entries.filter(e => !e.hasPatch || e.progressionWouldHide).length;
  const coachCopy = base ? `Day ${input.nextGameDay}: ${base}` : null;

  return {
    patchCoverageCount,
    auditIssueCount,
    coachCopy,
  };
}
