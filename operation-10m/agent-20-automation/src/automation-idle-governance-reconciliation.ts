import {
  formatIdleGovernanceAuditDigest,
  type O10IdleGovernanceAuditTrail,
} from './automation-idle-governance-audit-trail.js';
import {
  runIdleGovernanceStabilizationPass,
  type O10IdleGovernanceStabilizationPassResult,
} from './automation-idle-governance-stabilization.js';
import {
  runIdleAutomationOpsGovernance,
  type O10IdleOpsGovernanceResult,
} from './automation-idle-ops-governance.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import { createDefaultAutonomousIdleNationalPersisted } from './national-steward.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export type O10IdleGovernanceReconciliationStatus = 'aligned' | 'improved' | 'drift' | 'blocked';

export interface O10IdleGovernanceReconciliationResult {
  schema: '10m.agent20.idle-governance-reconciliation.v1';
  status: O10IdleGovernanceReconciliationStatus;
  priorAlertLevel: string | null;
  deltaPeakTier: number;
  auditMatchesPass: boolean;
  summaryLine: string;
}

function lastAuditAlert(trail: O10IdleGovernanceAuditTrail): string | null {
  if (trail.entries.length === 0) return null;
  return trail.entries[trail.entries.length - 1].alertLevel;
}

/** Compare stabilization pass outcomes against prior audit state and in-pass audit entry. */
export function reconcileIdleGovernancePass(
  pass: O10IdleGovernanceStabilizationPassResult,
  priorTrail: O10IdleGovernanceAuditTrail
): O10IdleGovernanceReconciliationResult {
  const priorAlert = lastAuditAlert(priorTrail);
  const latest = pass.auditTrail.entries[pass.auditTrail.entries.length - 1];
  const auditMatchesPass =
    !!latest &&
    latest.alertLevel === pass.governance.alertLevel &&
    latest.peakTier === pass.governance.window.summary.peakEffectiveTier &&
    latest.appliedStepCount === pass.remediationRun.appliedStepCount;

  const priorPeak =
    priorTrail.entries.length > 0 ? priorTrail.entries[priorTrail.entries.length - 1].peakTier : null;
  const deltaPeakTier =
    priorPeak === null ? 0 : pass.governance.window.summary.peakEffectiveTier - priorPeak;

  let status: O10IdleGovernanceReconciliationStatus = 'aligned';
  if (!auditMatchesPass) status = 'drift';
  else if (pass.stabilization.wave === 'idle_governance_blocked') status = 'blocked';
  else if (
    priorAlert &&
    priorAlert !== 'none' &&
    pass.governance.alertLevel === 'none'
  ) {
    status = 'improved';
  } else if (deltaPeakTier < 0) status = 'improved';

  const summaryLine = [
    `gov_reconcile status=${status}`,
    `audit_ok=${auditMatchesPass}`,
    `delta_peak=${deltaPeakTier}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-reconciliation.v1',
    status,
    priorAlertLevel: priorAlert,
    deltaPeakTier,
    auditMatchesPass,
    summaryLine,
  };
}

export interface O10IdleGovernanceComplianceCycleResult {
  schema: '10m.agent20.idle-governance-compliance-cycle.v1';
  governance: O10IdleOpsGovernanceResult;
  pass: O10IdleGovernanceStabilizationPassResult;
  reconciliation: O10IdleGovernanceReconciliationResult;
  auditDigest: string;
}

/** End-to-end governance compliance cycle for round-10 integration hooks. */
export function runIdleGovernanceComplianceCycle(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  turn: number,
  priorTrail: O10IdleGovernanceAuditTrail
): O10IdleGovernanceComplianceCycleResult {
  const governance = runIdleAutomationOpsGovernance(
    spec,
    rule,
    createDefaultAutonomousIdleNationalPersisted()
  );
  const pass = runIdleGovernanceStabilizationPass(governance, turn, priorTrail);
  const reconciliation = reconcileIdleGovernancePass(pass, priorTrail);
  return {
    schema: '10m.agent20.idle-governance-compliance-cycle.v1',
    governance,
    pass,
    reconciliation,
    auditDigest: formatIdleGovernanceAuditDigest(pass.auditTrail),
  };
}

export function runO10Agent20IdleGovernanceReconciliationSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'rec1',
    name: 'Reconcile sample',
    enabled: true,
    authorityDisabled: false,
    priority: 5,
    activeFromDay: 0,
    activeUntilDay: 99,
    trigger: { type: 'turn_start' },
    conditions: null,
    limits: { maxRunsPerDay: 10, maxRunsTotal: null, cooldownTurns: 0 },
    safety: { maxCostPerRun: null, minCashRemainingAfterRun: null, stopIfNoStateChangeCount: 5 },
    stats: {
      totalRuns: 0,
      totalSuccesses: 0,
      totalSkipped: 0,
      totalFailed: 0,
      lastRunDay: null,
      lastRunTurn: null,
      runsToday: 0,
      runsTodayDay: -1,
      consecutiveNoChangeCount: 0,
      lastResultSummary: '',
    },
    actionType: 'wait',
    resolvedCost: 0,
    spendableCash: 100,
  };

  const calmSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 2,
    humanCommittedEvery: 1,
    idleMsStart: 0,
    idleMsStep: 0,
    consecutiveIdleStart: 0,
  };

  const cycle = runIdleGovernanceComplianceCycle(calmSpec, sampleRule, 2, {
    schema: '10m.agent20.idle-governance-audit-trail.v1',
    entries: [],
  });
  push(
    'gov_reconcile_calm',
    'calm cycle reconciles aligned',
    cycle.reconciliation.status === 'aligned' && cycle.reconciliation.auditMatchesPass
  );

  const stressedSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 6,
    humanCommittedEvery: 0,
    idleMsStart: 200_000,
    idleMsStep: 150_000,
    consecutiveIdleStart: 8,
  };
  const stressCycle = runIdleGovernanceComplianceCycle(stressedSpec, sampleRule, 5, cycle.pass.auditTrail);
  push(
    'gov_reconcile_stress',
    'stressed cycle may block or drift with elevated tier',
    stressCycle.reconciliation.auditMatchesPass &&
      (stressCycle.reconciliation.status === 'blocked' || stressCycle.governance.alertLevel !== 'none')
  );

  push(
    'gov_reconcile_schema',
    'reconciliation schema marker',
    cycle.reconciliation.schema === '10m.agent20.idle-governance-reconciliation.v1' &&
      cycle.schema === '10m.agent20.idle-governance-compliance-cycle.v1'
  );

  push(
    'gov_reconcile_digest',
    'compliance cycle exposes audit digest',
    cycle.auditDigest.includes('entries=1') && stressCycle.auditDigest.includes('entries=')
  );

  return results;
}
