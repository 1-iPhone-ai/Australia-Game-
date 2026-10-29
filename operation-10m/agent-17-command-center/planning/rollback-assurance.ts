import type {
  Acc17CommandCenterOpsState,
  Agent17GovernanceAuditSnapshot,
  Agent17PlanHealthBand,
  Agent17RollbackAssuranceSnapshot,
} from '../types/command-center-types.ts';

const MAX_VERIFICATION_LOG = 64;

export function buildAgent17RollbackAssurance(
  ops: Acc17CommandCenterOpsState,
  planHealth: Agent17PlanHealthBand,
  governanceAudit: Agent17GovernanceAuditSnapshot
): Agent17RollbackAssuranceSnapshot {
  const checks: Agent17RollbackAssuranceSnapshot['checks'] = [];

  const hasPlan = !!ops.activePlan;
  checks.push({
    id: 'active_plan',
    label: 'Active plan checkpoint anchor',
    passed: hasPlan,
    weight: 15,
  });

  const logOk = ops.verificationLog.length <= MAX_VERIFICATION_LOG;
  checks.push({
    id: 'verify_log',
    label: 'Verification log bounded',
    passed: logOk,
    weight: 15,
  });

  const failedSteps = ops.activePlan?.steps.filter(s => s.status === 'failed').length ?? 0;
  checks.push({
    id: 'plan_integrity',
    label: 'No failed plan steps',
    passed: failedSteps === 0,
    weight: 20,
  });

  const replanOk = (ops.activePlan?.replanCount ?? 0) <= 3;
  checks.push({
    id: 'replan_budget',
    label: 'Replan count within budget',
    passed: replanOk,
    weight: 15,
  });

  const govOk = governanceAudit.band !== 'breach' && governanceAudit.openCriticalCount === 0;
  checks.push({
    id: 'governance_clear',
    label: 'Governance not in breach',
    passed: govOk,
    weight: 20,
  });

  const healthOk = planHealth.band !== 'critical';
  checks.push({
    id: 'plan_health',
    label: 'Plan health not critical',
    passed: healthOk,
    weight: 15,
  });

  const earned = checks.filter(c => c.passed).reduce((n, c) => n + c.weight, 0);
  const totalWeight = checks.reduce((n, c) => n + c.weight, 0);
  const assuranceScore = Math.round((earned / Math.max(1, totalWeight)) * 100);

  const band: Agent17RollbackAssuranceSnapshot['band'] =
    assuranceScore >= 80 && govOk ? 'protected' : assuranceScore >= 45 ? 'at_risk' : 'exposed';

  const restoreRecommended =
    band === 'exposed' || failedSteps > 0 || governanceAudit.band === 'breach';

  return {
    assuranceScore,
    band,
    checks,
    restoreRecommended,
    headline: `Rollback ${band} (${assuranceScore}/100) · ${checks.filter(c => c.passed).length}/${checks.length} checks`,
  };
}

export function rollbackAssuranceNeedsRestore(snapshot: Agent17RollbackAssuranceSnapshot): boolean {
  return snapshot.restoreRecommended || snapshot.band === 'exposed';
}
