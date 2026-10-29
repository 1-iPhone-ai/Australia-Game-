import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayRestorePlan } from './replay-restore-plan.ts';
import type { Agent24RestoreCommitRecord } from './restore-commit-record.ts';
import type { Agent24RestoreExecutionGateReport } from './restore-execution-gate.ts';

export interface Agent24RestoreCommitAuditFinding {
  kind: 'anchor_drift' | 'commit_without_execution' | 'step_count_mismatch';
  detail: string;
  fingerprint: string;
}

export interface Agent24RestoreCommitAuditReport {
  reportId: string;
  matchId: string;
  auditPassed: boolean;
  findingCount: number;
  findings: Agent24RestoreCommitAuditFinding[];
  auditScore: number;
  deterministicFingerprint: string;
}

export interface Agent24RestoreCommitAuditInput {
  matchId: string;
  restoreCommitRecord: Agent24RestoreCommitRecord;
  replayRestorePlan: Agent24ReplayRestorePlan;
  restoreExecutionGate: Agent24RestoreExecutionGateReport;
}

export function buildAgent24RestoreCommitAuditReport(
  input: Agent24RestoreCommitAuditInput,
): Agent24RestoreCommitAuditReport {
  const findings: Agent24RestoreCommitAuditFinding[] = [];

  if (
    input.restoreCommitRecord.anchorTurn !== null &&
    input.replayRestorePlan.anchorTurn !== null &&
    input.restoreCommitRecord.anchorTurn !== input.replayRestorePlan.anchorTurn
  ) {
    findings.push({
      kind: 'anchor_drift',
      detail: `Commit anchor ${input.restoreCommitRecord.anchorTurn} vs plan ${input.replayRestorePlan.anchorTurn}`,
      fingerprint: o6kAgent24Fingerprint('rca_anchor', {
        commit: input.restoreCommitRecord.anchorTurn,
        plan: input.replayRestorePlan.anchorTurn,
      }),
    });
  }

  if (input.restoreCommitRecord.commitAllowed && !input.restoreExecutionGate.executionAllowed) {
    findings.push({
      kind: 'commit_without_execution',
      detail: 'Commit record allowed but execution gate closed',
      fingerprint: o6kAgent24Fingerprint('rca_exec', { commit: true, exec: false }),
    });
  }

  if (input.restoreCommitRecord.committedStepCount > input.replayRestorePlan.stepCount) {
    findings.push({
      kind: 'step_count_mismatch',
      detail: `Committed steps ${input.restoreCommitRecord.committedStepCount} exceed plan ${input.replayRestorePlan.stepCount}`,
      fingerprint: o6kAgent24Fingerprint('rca_steps', {
        committed: input.restoreCommitRecord.committedStepCount,
        plan: input.replayRestorePlan.stepCount,
      }),
    });
  }

  findings.sort((a, b) => a.fingerprint.localeCompare(b.fingerprint));

  let auditScore = 100;
  auditScore -= findings.length * 22;
  auditScore = Math.max(0, Math.min(100, auditScore));

  const auditPassed = findings.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('restore_commit_audit', { matchId: input.matchId }),
    matchId: input.matchId,
    auditPassed,
    findingCount: findings.length,
    findings,
    auditScore,
    deterministicFingerprint: o6kAgent24Fingerprint('restore_commit_audit_body', {
      findings: findings.map(f => f.fingerprint),
      auditPassed,
      auditScore,
    }),
  };
}

export function runAgent24RestoreCommitAuditSelfTests(): Array<{ name: string; passed: boolean }> {
  const plan = {
    planId: 'p',
    matchId: 'self',
    restoreAllowed: true,
    anchorTurn: 10,
    stepCount: 3,
    requiredStepCount: 2,
    steps: [],
    restorePlanScore: 90,
    deterministicFingerprint: o6kAgent24Fingerprint('rp_rca', { v: 1 }),
  };
  const gate = {
    reportId: 'g',
    matchId: 'self',
    executionAllowed: true,
    anchorTurn: 10,
    requiredStepCount: 2,
    satisfiedRequiredSteps: 2,
    blockerCount: 0,
    blockers: [],
    executionScore: 92,
    deterministicFingerprint: o6kAgent24Fingerprint('eg_rca', { v: 1 }),
  };
  const commit = {
    recordId: 'c',
    matchId: 'self',
    currentTurn: 14,
    commitAllowed: true,
    anchorTurn: 10,
    committedStepCount: 2,
    steps: [],
    commitScore: 94,
    deterministicFingerprint: o6kAgent24Fingerprint('rc_rca', { v: 1 }),
  };

  const audit = buildAgent24RestoreCommitAuditReport({
    matchId: 'self',
    restoreCommitRecord: commit,
    replayRestorePlan: plan,
    restoreExecutionGate: gate,
  });

  return [
    { name: 'audit_passes_when_aligned', passed: audit.auditPassed && audit.findingCount === 0 },
    {
      name: 'deterministic_fingerprint',
      passed:
        audit.deterministicFingerprint ===
        buildAgent24RestoreCommitAuditReport({
          matchId: 'self',
          restoreCommitRecord: commit,
          replayRestorePlan: plan,
          restoreExecutionGate: gate,
        }).deterministicFingerprint,
    },
  ];
}
