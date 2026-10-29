import { ADVISORY_OPS_POLICY } from './policy.js';
import {
  assertAdvisoryRecommendationOnly,
  buildGroundingForRule,
  enrichDetailWithGrounding,
  verifyStateVerifiedWarning,
} from './grounding.js';
import { ADVISORY_MONITOR_RULES, type AdvisoryMonitorRule } from './monitor-rules.js';
import { stripExecutionFromCoPilotCandidate } from './suggestion-gate.js';
import type {
  AdvisoryRecommendation,
  BuildMonitorSnapshotInput,
  CoPilotCandidateEvaluationResult,
  GuardianCoPilotAdvisoryCycleResult,
  GuardianCoPilotMonitorSnapshot,
} from './types.js';
import { enrichSnapshotGuardianDepth } from './guardian-depth.js';
import { buildGuardianCoPilotMonitorSnapshot } from './snapshot.js';

const ADVISORY_SEVERITY_RANK: Record<AdvisoryRecommendation['severity'], number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  info: 1,
};

export function createAdvisoryOpsFixtureSnapshot(
  overrides: Partial<GuardianCoPilotMonitorSnapshot> = {}
): GuardianCoPilotMonitorSnapshot {
  const snap: GuardianCoPilotMonitorSnapshot = {
    turn: 4,
    day: 4,
    actorId: 'player_1',
    cash: 1200,
    debt: 0,
    apRemaining: 2,
    apPerDay: 3,
    actionsUsedThisTurn: 1,
    region: 'NSW',
    guardianEnabled: true,
    guardianProtectionLevel: 'major_mistakes',
    guardianResponseMode: 'confirm_risky',
    copilotEnabled: true,
    copilotAuthorityMode: 'assist',
    copilotHoldsControl: false,
    copilotAutonomousActive: false,
    takeoverSessionActive: false,
    takeoverSessionAgeTurns: 0,
    minCashReserve: 250,
    maxSpendPerAction: 2500,
    blockedContinueCount: 0,
    guardianReplayCount: 2,
    activeContractCount: 1,
    expiringContractCount: 0,
    teamPlanPending: false,
    objectiveRegion: null,
    objectiveActive: false,
    objectivePrimaryLabel: null,
    objectiveTargetRegion: null,
    objectiveProgressPct: null,
    objectiveTurnsRemaining: null,
    playerInObjectiveRegion: true,
    rivalVictoryProgressPct: null,
    victoryThresholdPct: 80,
    guardianRequiresConfirmation: false,
    guardianProtectionMaximum: false,
    guardianAutomationLikelyBlocked: false,
    guardianConfirmationLikelyRequired: false,
    guardianRiskScore: 0,
    guardianRiskBand: 'low',
    copilotSpendingHeadroom: 950,
    objectiveBehindSchedule: false,
    liquidityStressIndex: 0,
    copilotTrustGapScore: 0,
    objectivePacePct: null,
    compositePressureIndex: 0,
    automationReadinessScore: 100,
    actionBurnPressure: 0,
    advisorySaturationIndex: 0,
    escalationLatchScore: 0,
    governanceCoherenceScore: 100,
    ...overrides,
  };
  if (snap.objectiveTargetRegion && !snap.objectiveRegion) {
    snap.objectiveRegion = snap.objectiveTargetRegion;
  }
  return enrichSnapshotGuardianDepth(snap);
}

function materializeAdvisoryFromRule(
  rule: AdvisoryMonitorRule,
  snapshot: GuardianCoPilotMonitorSnapshot
): AdvisoryRecommendation | null {
  const grounding = buildGroundingForRule(rule, snapshot);
  const draft: AdvisoryRecommendation = {
    id: `adv_${rule.id}_t${snapshot.turn}`,
    kind: rule.kind,
    severity: rule.defaultSeverity,
    category: rule.category,
    title: rule.title,
    detail: enrichDetailWithGrounding(rule.detailTemplate, grounding),
    recommendationOnly: true,
    mayExecute: false,
    grounding,
    stateVerified: false,
    suggestedFollowUp: rule.followUp,
    deepLink: rule.deepLink || (rule.category === 'guardian' ? { tab: 'aiTeams', section: 'aiTeams.coPilot' } : undefined),
    dedupeKey: `${rule.id}:${snapshot.actorId}`,
    turn: snapshot.turn,
    day: snapshot.day,
    actorId: snapshot.actorId,
    ruleId: rule.id,
  };
  if (!verifyStateVerifiedWarning(draft, snapshot, rule)) return null;
  return { ...draft, stateVerified: true };
}

export function materializeAdvisoryAlerts(items: AdvisoryRecommendation[]): AdvisoryRecommendation[] {
  const seen = new Set<string>();
  const out: AdvisoryRecommendation[] = [];
  const sorted = [...items].sort(
    (a, b) =>
      ADVISORY_SEVERITY_RANK[b.severity] - ADVISORY_SEVERITY_RANK[a.severity] || a.id.localeCompare(b.id)
  );
  for (const item of sorted) {
    if (!item.stateVerified || !assertAdvisoryRecommendationOnly(item)) continue;
    if (seen.has(item.dedupeKey)) continue;
    seen.add(item.dedupeKey);
    out.push(item);
  }
  return out;
}

export function runGuardianCoPilotAdvisoryCycle(input: BuildMonitorSnapshotInput): GuardianCoPilotAdvisoryCycleResult {
  const snapshot = buildGuardianCoPilotMonitorSnapshot(input);
  const recommendations: AdvisoryRecommendation[] = [];
  for (const rule of ADVISORY_MONITOR_RULES) {
    try {
      if (!rule.evaluate(snapshot)) continue;
      const rec = materializeAdvisoryFromRule(rule, snapshot);
      if (rec) recommendations.push(rec);
    } catch {
      /* fail-safe: skip rule */
    }
  }
  const alerts = recommendations.filter(r => r.kind === 'alert');
  const advice = recommendations.filter(r => r.kind === 'advice');
  const monitors = recommendations.filter(r => r.kind === 'monitor');
  return {
    snapshot,
    recommendations: materializeAdvisoryAlerts(recommendations),
    alerts: materializeAdvisoryAlerts(alerts),
    advice: materializeAdvisoryAlerts(advice),
    monitors: materializeAdvisoryAlerts(monitors),
    generatedAtTurn: snapshot.turn,
    policy: ADVISORY_OPS_POLICY,
  };
}

export function advisoryRecommendationsFromCoPilotEvaluation(
  evalResult: CoPilotCandidateEvaluationResult,
  snapshot: GuardianCoPilotMonitorSnapshot
): AdvisoryRecommendation[] {
  const top = evalResult.topRecommendation || evalResult.candidates?.[0];
  if (!top) return [];
  const stripped = stripExecutionFromCoPilotCandidate(top as Record<string, unknown> & { execute?: unknown });
  const label =
    (stripped as Record<string, unknown>).title ||
    (stripped as Record<string, unknown>).label ||
    stripped.actionType ||
    'Action';
  const grounding: AdvisoryRecommendation['grounding'] = [
    { field: 'turn', label: 'Turn', value: snapshot.turn },
    { field: 'copilotEnabled', label: 'Co-Pilot enabled', value: snapshot.copilotEnabled },
  ];
  const rec: AdvisoryRecommendation = {
    id: `adv_copilot_candidate_t${snapshot.turn}`,
    kind: 'advice',
    severity: 'medium',
    category: 'copilot',
    title: 'Co-Pilot suggested action (approval required)',
    detail: `${label} — review in Co-Pilot; nothing runs without your confirmation.`,
    recommendationOnly: true,
    mayExecute: false,
    grounding,
    stateVerified: true,
    suggestedFollowUp: 'Open Co-Pilot panel to approve or dismiss.',
    deepLink: { tab: 'aiTeams', section: 'aiTeams.coPilot' },
    dedupeKey: `copilot_top:${snapshot.turn}:${(stripped as Record<string, unknown>).id || stripped.actionType}`,
    turn: snapshot.turn,
    day: snapshot.day,
    actorId: snapshot.actorId,
    ruleId: 'copilot_suggested_candidate',
  };
  return materializeAdvisoryAlerts([rec]);
}

export function evaluateAdvisoryScenario(descriptor: {
  snapshot: Partial<GuardianCoPilotMonitorSnapshot>;
}): { fired: string[]; recommendations: AdvisoryRecommendation[] } {
  const snap = createAdvisoryOpsFixtureSnapshot(descriptor.snapshot);
  const fired: string[] = [];
  const recommendations: AdvisoryRecommendation[] = [];
  for (const rule of ADVISORY_MONITOR_RULES) {
    if (!rule.evaluate(snap)) continue;
    fired.push(rule.id);
    const rec = materializeAdvisoryFromRule(rule, snap);
    if (rec) recommendations.push(rec);
  }
  return { fired, recommendations: materializeAdvisoryAlerts(recommendations) };
}
