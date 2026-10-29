import type { O10IdleGovernanceComplianceCycleResult } from './automation-idle-governance-reconciliation.js';
import { buildIdleGovernanceCopilotBriefFromCycle } from './automation-idle-governance-copilot-brief.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceCycleAttestation {
  schema: '10m.agent20.idle-governance-cycle-attestation.v1';
  turn: number;
  reconcileStatus: string;
  stabilizationWave: string;
  auditDigest: string;
  briefHeadline: string;
  fingerprint: string;
  valid: boolean;
}

function foldFingerprint(parts: string[]): string {
  let h = 2166136261;
  const text = parts.join('\n');
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `fnv1a_${(h >>> 0).toString(16)}`;
}

/** Produce a deterministic attestation blob for replay / history modules. */
export function attestIdleGovernanceComplianceCycle(
  cycle: O10IdleGovernanceComplianceCycleResult,
  turn: number
): O10IdleGovernanceCycleAttestation {
  const brief = buildIdleGovernanceCopilotBriefFromCycle(cycle);
  const fingerprint = foldFingerprint([
    cycle.governance.summaryLine,
    cycle.reconciliation.summaryLine,
    cycle.auditDigest,
    brief.headline,
    String(turn),
  ]);

  const valid =
    cycle.reconciliation.auditMatchesPass &&
    (cycle.reconciliation.status !== 'drift' || cycle.governance.alertLevel === 'none');

  return {
    schema: '10m.agent20.idle-governance-cycle-attestation.v1',
    turn,
    reconcileStatus: cycle.reconciliation.status,
    stabilizationWave: cycle.pass.stabilization.wave,
    auditDigest: cycle.auditDigest,
    briefHeadline: brief.headline,
    fingerprint,
    valid,
  };
}

export function verifyIdleGovernanceCycleAttestation(
  cycle: O10IdleGovernanceComplianceCycleResult,
  attestation: O10IdleGovernanceCycleAttestation
): boolean {
  const rerun = attestIdleGovernanceComplianceCycle(cycle, attestation.turn);
  return (
    rerun.fingerprint === attestation.fingerprint &&
    rerun.reconcileStatus === attestation.reconcileStatus &&
    rerun.stabilizationWave === attestation.stabilizationWave
  );
}

export function runO10Agent20IdleGovernanceCycleAttestationSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockCycle: O10IdleGovernanceComplianceCycleResult = {
    schema: '10m.agent20.idle-governance-compliance-cycle.v1',
    auditDigest: 'idle_gov_audit entries=1 last_alert=none peak=t0',
    governance: {
      schema: '10m.agent20.idle-ops-governance.v1',
      alertLevel: 'none',
      remediationStepCount: 1,
      summaryLine: 'calm window',
      steward: { persisted: {} as never, throttled: false, reason: 'tier_nominal' },
      window: {
        queue: { maxDepth: 8, items: [] },
        deescalationState: {} as never,
        telemetry: [],
        summary: {
          schema: '10m.agent20.idle-ops-window.v1',
          turnsRun: 1,
          humanCommitCount: 1,
          peakEffectiveTier: 0,
          finalScheduleAction: 'execute_now',
          digestSummary: 'ok',
        },
        lastTurn: {} as never,
      },
    },
    pass: {
      schema: '10m.agent20.idle-governance-stabilization-pass.v1',
      governance: {} as never,
      remediationRun: {} as never,
      auditTrail: {
        schema: '10m.agent20.idle-governance-audit-trail.v1',
        entries: [
          {
            schema: '10m.agent20.idle-governance-audit.v1',
            turn: 2,
            alertLevel: 'none',
            peakTier: 0,
            appliedStepCount: 0,
            pendingHumanCommit: false,
            fingerprint: 'calm',
          },
        ],
      },
      stabilization: {
        schema: '10m.agent20.idle-governance-stabilization.v1',
        wave: 'idle_governance_calm',
        stabilized: true,
        auditDigest: 'idle_gov_audit entries=1',
        reportHeadline: 'ok',
        summaryLine: 'gov_stabilization wave=idle_governance_calm stabilized=true',
      },
    },
    reconciliation: {
      schema: '10m.agent20.idle-governance-reconciliation.v1',
      status: 'aligned',
      priorAlertLevel: null,
      deltaPeakTier: 0,
      auditMatchesPass: true,
      summaryLine: 'gov_reconcile status=aligned audit_ok=true delta_peak=0',
    },
  };
  mockCycle.pass.governance = mockCycle.governance;
  mockCycle.pass.remediationRun = {
    schema: '10m.agent20.governance-remediation-run.v1',
    plan: { schema: '10m.agent20.backpressure-remediation.v1', alertLevel: 'none', steps: [] },
    queue: { maxDepth: 8, items: [] },
    appliedKinds: ['none'],
    appliedStepCount: 0,
    pendingHumanCommit: false,
    summaryLine: 'run calm',
  };

  const att = attestIdleGovernanceComplianceCycle(mockCycle, 2);
  push('gov_att_valid', 'aligned calm cycle attestation valid', att.valid && att.fingerprint.startsWith('fnv1a_'));
  push('gov_att_verify', 'verify matches rerun fingerprint', verifyIdleGovernanceCycleAttestation(mockCycle, att));

  const drift = {
    ...mockCycle,
    reconciliation: { ...mockCycle.reconciliation, status: 'drift' as const, auditMatchesPass: false },
    governance: { ...mockCycle.governance, alertLevel: 'warn' },
  };
  const attDrift = attestIdleGovernanceComplianceCycle(drift, 3);
  push('gov_att_drift', 'drift with warn fails valid flag', attDrift.valid === false);

  push('gov_att_schema', 'attestation schema marker', att.schema === '10m.agent20.idle-governance-cycle-attestation.v1');

  return results;
}
