import type { O10GovernanceRemediationRunResult } from './automation-governance-remediation-runner.js';
import type { O10IdleOpsGovernanceResult } from './automation-idle-ops-governance.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceAuditEntry {
  schema: '10m.agent20.idle-governance-audit.v1';
  turn: number;
  alertLevel: string;
  peakTier: number;
  appliedStepCount: number;
  pendingHumanCommit: boolean;
  fingerprint: string;
}

export interface O10IdleGovernanceAuditTrail {
  schema: '10m.agent20.idle-governance-audit-trail.v1';
  entries: O10IdleGovernanceAuditEntry[];
}

export function createEmptyIdleGovernanceAuditTrail(): O10IdleGovernanceAuditTrail {
  return { schema: '10m.agent20.idle-governance-audit-trail.v1', entries: [] };
}

function fingerprintGovernancePass(
  governance: O10IdleOpsGovernanceResult,
  run: O10GovernanceRemediationRunResult
): string {
  return [
    governance.alertLevel,
    governance.window.summary.peakEffectiveTier,
    run.appliedStepCount,
    run.pendingHumanCommit ? 1 : 0,
    governance.summaryLine.slice(0, 48),
  ].join('|');
}

/** Append one governance + remediation cycle to the audit trail (cap 64). */
export function appendIdleGovernanceAuditEntry(
  trail: O10IdleGovernanceAuditTrail,
  governance: O10IdleOpsGovernanceResult,
  run: O10GovernanceRemediationRunResult,
  turn: number
): O10IdleGovernanceAuditTrail {
  const entry: O10IdleGovernanceAuditEntry = {
    schema: '10m.agent20.idle-governance-audit.v1',
    turn,
    alertLevel: governance.alertLevel,
    peakTier: governance.window.summary.peakEffectiveTier,
    appliedStepCount: run.appliedStepCount,
    pendingHumanCommit: run.pendingHumanCommit,
    fingerprint: fingerprintGovernancePass(governance, run),
  };
  const entries = [...trail.entries, entry].slice(-64);
  return { schema: trail.schema, entries };
}

export function formatIdleGovernanceAuditDigest(trail: O10IdleGovernanceAuditTrail): string {
  if (trail.entries.length === 0) return 'idle_gov_audit entries=0';
  const last = trail.entries[trail.entries.length - 1];
  return `idle_gov_audit entries=${trail.entries.length} last_alert=${last.alertLevel} peak=t${last.peakTier}`;
}

export function runO10Agent20IdleGovernanceAuditTrailSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockGovernance = {
    schema: '10m.agent20.idle-ops-governance.v1' as const,
    alertLevel: 'warn',
    remediationStepCount: 2,
    summaryLine: 'ops_window turns=2 alert=warn',
    steward: { persisted: {} as never, throttled: true, reason: 'idle_ops_tier2_throttle_autonomy' },
    window: {
      queue: { maxDepth: 6, items: [] },
      deescalationState: {} as never,
      telemetry: [],
      summary: {
        schema: '10m.agent20.idle-ops-window.v1' as const,
        turnsRun: 2,
        humanCommitCount: 0,
        peakEffectiveTier: 2 as const,
        finalScheduleAction: 'defer',
        digestSummary: 'defer=1/2',
      },
      lastTurn: {} as never,
    },
  };

  const mockRun: O10GovernanceRemediationRunResult = {
    schema: '10m.agent20.governance-remediation-run.v1',
    plan: { schema: '10m.agent20.backpressure-remediation.v1', alertLevel: 'warn', steps: [] },
    queue: { maxDepth: 6, items: [] },
    appliedKinds: ['surface_warn_banner', 'defer_low_priority_intents'],
    appliedStepCount: 2,
    pendingHumanCommit: false,
    summaryLine: 'gov_remediation_run level=warn applied=2',
  };

  let trail = createEmptyIdleGovernanceAuditTrail();
  push('gov_audit_empty', 'empty trail digest', formatIdleGovernanceAuditDigest(trail) === 'idle_gov_audit entries=0');

  trail = appendIdleGovernanceAuditEntry(trail, mockGovernance, mockRun, 5);
  push(
    'gov_audit_append',
    'append records alert and peak tier',
    trail.entries.length === 1 &&
      trail.entries[0].alertLevel === 'warn' &&
      trail.entries[0].peakTier === 2 &&
      trail.entries[0].fingerprint.includes('warn')
  );

  trail = appendIdleGovernanceAuditEntry(trail, { ...mockGovernance, alertLevel: 'none' }, { ...mockRun, appliedStepCount: 0 }, 6);
  push('gov_audit_cap', 'trail retains latest entries', trail.entries.length === 2);

  push(
    'gov_audit_digest',
    'digest summarizes last entry',
    formatIdleGovernanceAuditDigest(trail).includes('last_alert=none') && formatIdleGovernanceAuditDigest(trail).includes('entries=2')
  );

  return results;
}
