import type {
  Acc17CommandCenterOpsState,
  Agent17GovernanceAuditSnapshot,
  Agent17SettingsSlice,
  Agent17VerificationPolicySnapshot,
} from '../types/command-center-types.ts';

const MAX_VERIFICATION_LOG = 64;

export function buildAgent17GovernanceAudit(
  ops: Acc17CommandCenterOpsState,
  settings: Agent17SettingsSlice,
  verificationPolicy: Agent17VerificationPolicySnapshot
): Agent17GovernanceAuditSnapshot {
  const findings: Agent17GovernanceAuditSnapshot['findings'] = [];
  const enabled = settings.commandCenterSettings?.enabled !== false && ops.enabled;

  findings.push({
    id: 'cc_enabled',
    category: 'policy',
    severity: 'info',
    passed: enabled,
    detail: enabled ? 'Command center enabled' : 'Command center disabled',
  });

  const verifyOk =
    verificationPolicy.allowVerification || verificationPolicy.blockingRuleIds.length === 0;
  findings.push({
    id: 'verify_policy',
    category: 'verification',
    severity: verifyOk ? 'info' : 'warn',
    passed: verifyOk,
    detail: verifyOk
      ? 'Verification policy allows progress'
      : `Blocked rules: ${verificationPolicy.blockingRuleIds.join(',')}`,
  });

  const logLen = ops.verificationLog.length;
  const logBounded = logLen <= MAX_VERIFICATION_LOG;
  findings.push({
    id: 'verify_log_bound',
    category: 'verification',
    severity: logBounded ? 'info' : 'warn',
    passed: logBounded,
    detail: `Verification log entries: ${logLen}`,
  });

  const staleDelegations = ops.delegatedProjects.filter(
    p => p.status === 'active' && !p.lastVerifiedFingerprint
  ).length;
  findings.push({
    id: 'delegation_fingerprint',
    category: 'delegation',
    severity: staleDelegations > 2 ? 'critical' : staleDelegations > 0 ? 'warn' : 'info',
    passed: staleDelegations === 0,
    detail: `Active delegations missing fingerprint: ${staleDelegations}`,
  });

  const authorityBreaches = ops.delegatedProjects.filter(
    p =>
      p.status === 'active' &&
      settings.aiCommunicationAutonomyLevel === 'advisory' &&
      p.authorityCeiling === 'delegated'
  ).length;
  findings.push({
    id: 'authority_ceiling',
    category: 'delegation',
    severity: authorityBreaches > 0 ? 'critical' : 'info',
    passed: authorityBreaches === 0,
    detail: `Delegated ceiling breaches under advisory autonomy: ${authorityBreaches}`,
  });

  const failedSteps = ops.activePlan?.steps.filter(s => s.status === 'failed').length ?? 0;
  findings.push({
    id: 'plan_integrity',
    category: 'rollback',
    severity: failedSteps > 0 ? 'warn' : 'info',
    passed: failedSteps === 0,
    detail: `Failed plan steps: ${failedSteps}`,
  });

  const passedWeight = findings.filter(f => f.passed).reduce((n, f) => {
    const w = f.severity === 'critical' ? 25 : f.severity === 'warn' ? 15 : 10;
    return n + w;
  }, 0);
  const totalWeight = findings.reduce((n, f) => {
    const w = f.severity === 'critical' ? 25 : f.severity === 'warn' ? 15 : 10;
    return n + w;
  }, 0);
  const auditScore = Math.round((passedWeight / Math.max(1, totalWeight)) * 100);

  const openCriticalCount = findings.filter(f => !f.passed && f.severity === 'critical').length;
  const band: Agent17GovernanceAuditSnapshot['band'] =
    openCriticalCount > 0 ? 'breach' : auditScore >= 80 ? 'compliant' : 'review';

  return {
    auditScore,
    band,
    findings,
    openCriticalCount,
    headline: `Governance ${band} (${auditScore}/100) · ${findings.length} findings`,
  };
}

export function governanceAuditBlocksAutomation(snapshot: Agent17GovernanceAuditSnapshot): boolean {
  return snapshot.band === 'breach' || snapshot.openCriticalCount > 0;
}
