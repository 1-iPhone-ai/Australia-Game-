import {
  appendIdleGovernanceAuditEntry,
  createEmptyIdleGovernanceAuditTrail,
  formatIdleGovernanceAuditDigest,
  type O10IdleGovernanceAuditTrail,
} from './automation-idle-governance-audit-trail.js';
import {
  runGovernanceRemediationPlaybook,
  type O10GovernanceRemediationRunResult,
} from './automation-governance-remediation-runner.js';
import { buildIdleGovernanceReport } from './automation-idle-governance-report.js';
import type { O10IdleOpsGovernanceResult } from './automation-idle-ops-governance.js';
import type { O10SelfTestResult } from './types.js';

export type O10IdleGovernanceStabilizationWave = 'idle_governance_calm' | 'idle_governance_remediating' | 'idle_governance_blocked';

export interface O10IdleGovernanceStabilizationResult {
  schema: '10m.agent20.idle-governance-stabilization.v1';
  wave: O10IdleGovernanceStabilizationWave;
  stabilized: boolean;
  auditDigest: string;
  reportHeadline: string;
  summaryLine: string;
}

export interface O10IdleGovernanceStabilizationPassResult {
  schema: '10m.agent20.idle-governance-stabilization-pass.v1';
  governance: O10IdleOpsGovernanceResult;
  remediationRun: O10GovernanceRemediationRunResult;
  auditTrail: O10IdleGovernanceAuditTrail;
  stabilization: O10IdleGovernanceStabilizationResult;
}

export function evaluateIdleGovernanceStabilization(
  governance: O10IdleOpsGovernanceResult,
  run: O10GovernanceRemediationRunResult,
  auditDigest: string
): O10IdleGovernanceStabilizationResult {
  const calm = governance.alertLevel === 'none';
  const humanRelief =
    governance.window.summary.humanCommitCount > 0 && governance.window.summary.peakEffectiveTier <= 1;
  const remediated =
    run.appliedStepCount > 0 && !run.pendingHumanCommit && governance.window.summary.peakEffectiveTier <= 2;

  let wave: O10IdleGovernanceStabilizationWave = 'idle_governance_remediating';
  if (calm || humanRelief) wave = 'idle_governance_calm';
  else if (run.pendingHumanCommit && governance.window.summary.humanCommitCount === 0) {
    wave = 'idle_governance_blocked';
  }

  const stabilized = wave === 'idle_governance_calm' || (remediated && humanRelief);
  const report = buildIdleGovernanceReport(governance);

  const summaryLine = [
    `gov_stabilization wave=${wave}`,
    `stabilized=${stabilized}`,
    auditDigest,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-stabilization.v1',
    wave,
    stabilized,
    auditDigest,
    reportHeadline: report.headline,
    summaryLine,
  };
}

/** Full round-9 pass: remediation playbook, audit trail, stabilization wave classification. */
export function runIdleGovernanceStabilizationPass(
  governance: O10IdleOpsGovernanceResult,
  turn: number,
  priorTrail: O10IdleGovernanceAuditTrail = createEmptyIdleGovernanceAuditTrail()
): O10IdleGovernanceStabilizationPassResult {
  const remediationRun = runGovernanceRemediationPlaybook(governance);
  const auditTrail = appendIdleGovernanceAuditEntry(priorTrail, governance, remediationRun, turn);
  const auditDigest = formatIdleGovernanceAuditDigest(auditTrail);
  const stabilization = evaluateIdleGovernanceStabilization(governance, remediationRun, auditDigest);

  return {
    schema: '10m.agent20.idle-governance-stabilization-pass.v1',
    governance,
    remediationRun,
    auditTrail,
    stabilization,
  };
}

export function runO10Agent20IdleGovernanceStabilizationSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const calmGov: O10IdleOpsGovernanceResult = {
    schema: '10m.agent20.idle-ops-governance.v1',
    alertLevel: 'none',
    remediationStepCount: 1,
    summaryLine: 'calm',
    steward: { persisted: {} as never, throttled: false, reason: 'tier_nominal' },
    window: {
      queue: { maxDepth: 8, items: [] },
      deescalationState: {} as never,
      telemetry: [
        {
          turn: 1,
          day: 1,
          tier: 0,
          effectiveMaxDepth: 8,
          deferLowPriorityBelow: 4,
          decision: 'execute_now',
          droppedLowPriority: 0,
        },
      ],
      summary: {
        schema: '10m.agent20.idle-ops-window.v1',
        turnsRun: 2,
        humanCommitCount: 1,
        peakEffectiveTier: 0,
        finalScheduleAction: 'execute_now',
        digestSummary: 'ok',
      },
      lastTurn: {} as never,
    },
  };

  const calmPass = runIdleGovernanceStabilizationPass(calmGov, 3);
  push(
    'gov_stab_calm',
    'calm governance stabilizes on calm wave',
    calmPass.stabilization.wave === 'idle_governance_calm' && calmPass.stabilization.stabilized
  );

  const blockedGov: O10IdleOpsGovernanceResult = {
    ...calmGov,
    alertLevel: 'critical',
    window: {
      ...calmGov.window,
      summary: {
        ...calmGov.window.summary,
        humanCommitCount: 0,
        peakEffectiveTier: 3,
      },
      telemetry: [
        {
          turn: 1,
          day: 1,
          tier: 3,
          effectiveMaxDepth: 5,
          deferLowPriorityBelow: 4,
          decision: 'defer',
          droppedLowPriority: 6,
        },
      ],
    },
  };

  const blockedPass = runIdleGovernanceStabilizationPass(blockedGov, 4);
  push(
    'gov_stab_blocked',
    'critical without human commit stays blocked',
    blockedPass.stabilization.wave === 'idle_governance_blocked' && blockedPass.stabilization.stabilized === false
  );

  push(
    'gov_stab_audit',
    'pass appends audit trail',
    blockedPass.auditTrail.entries.length === 1 && blockedPass.stabilization.auditDigest.includes('entries=1')
  );

  push(
    'gov_stab_schema',
    'stabilization pass schema marker',
    blockedPass.schema === '10m.agent20.idle-governance-stabilization-pass.v1' &&
      blockedPass.stabilization.schema === '10m.agent20.idle-governance-stabilization.v1'
  );

  return results;
}
