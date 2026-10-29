import type { AdvisoryRecommendation, GuardianCoPilotMonitorSnapshot } from './types.js';
import type { AdvisoryMonitorRule } from './types.js';
import { ADVISORY_OPS_POLICY } from './policy.js';

const FIELD_LABELS: Partial<Record<keyof GuardianCoPilotMonitorSnapshot, string>> = {
  cash: 'Cash on hand',
  debt: 'Outstanding debt',
  apRemaining: 'Action points remaining',
  minCashReserve: 'Co-Pilot minimum cash reserve',
  maxSpendPerAction: 'Co-Pilot max spend per action',
  copilotHoldsControl: 'Co-Pilot holds control',
  blockedContinueCount: 'Co-Pilot blocked continue count',
  guardianEnabled: 'Guardian AI enabled',
  guardianResponseMode: 'Guardian response mode',
  guardianReplayCount: 'Guardian replay events',
  expiringContractCount: 'Contracts expiring within 2 turns',
  teamPlanPending: 'Team plan pending approval',
  objectiveRegion: 'Objective region',
  region: 'Current region',
  objectiveActive: 'Primary objective active',
  objectivePrimaryLabel: 'Primary objective label',
  objectiveTargetRegion: 'Objective target region',
  objectiveProgressPct: 'Objective progress %',
  objectiveTurnsRemaining: 'Objective turns remaining',
  playerInObjectiveRegion: 'Player in objective region',
  rivalVictoryProgressPct: 'Rival victory progress %',
  victoryThresholdPct: 'Victory threshold %',
  guardianRequiresConfirmation: 'Guardian requires confirmation',
  guardianProtectionMaximum: 'Guardian maximum protection',
  guardianProtectionLevel: 'Guardian protection level',
  guardianAutomationLikelyBlocked: 'Guardian may block automation',
  guardianConfirmationLikelyRequired: 'Guardian confirmation likely',
};

export function formatSnapshotValue(value: unknown): string | number | boolean | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
  return String(value);
}

export function buildGroundingForRule(
  rule: AdvisoryMonitorRule,
  snapshot: GuardianCoPilotMonitorSnapshot
): AdvisoryRecommendation['grounding'] {
  return rule.evidenceFields.map(field => ({
    field,
    label: FIELD_LABELS[field] || field,
    value: formatSnapshotValue(snapshot[field]),
  }));
}

export function enrichDetailWithGrounding(
  template: string,
  grounding: AdvisoryRecommendation['grounding']
): string {
  if (!grounding.length) return template;
  const facts = grounding
    .slice(0, 4)
    .map(g => `${g.label}: ${g.value === null ? '—' : g.value}`)
    .join(' · ');
  return `${template} (${facts})`;
}

/** Re-run rule predicate — warnings must still match live snapshot fields. */
export function verifyStateVerifiedWarning(
  rec: AdvisoryRecommendation,
  snapshot: GuardianCoPilotMonitorSnapshot,
  rule: AdvisoryMonitorRule
): boolean {
  try {
    return rule.evaluate(snapshot);
  } catch {
    return false;
  }
}

export function verifyAdvisoryGrounding(
  rec: AdvisoryRecommendation,
  snapshot: GuardianCoPilotMonitorSnapshot
): boolean {
  if (!rec.grounding.length) return false;
  return rec.grounding.every(g => {
    const live = snapshot[g.field];
    const formatted = formatSnapshotValue(live);
    return formatted === g.value || String(formatted) === String(g.value);
  });
}

export function assertAdvisoryRecommendationOnly(rec: AdvisoryRecommendation): boolean {
  return (
    rec.recommendationOnly === true &&
    rec.mayExecute === false &&
    ADVISORY_OPS_POLICY.mayExecuteActions === false &&
    rec.stateVerified === true &&
    rec.grounding.length > 0
  );
}
