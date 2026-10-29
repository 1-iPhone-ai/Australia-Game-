import type { O10IdleGovernanceComplianceCycleResult } from './automation-idle-governance-reconciliation.js';
import {
  evaluateIdleGovernanceEscalationLadder,
  type O10IdleGovernanceEscalationLadderResult,
} from './automation-idle-governance-escalation-ladder.js';
import { buildIdleGovernanceReport } from './automation-idle-governance-report.js';
import type { O10IdleGovernanceReconciliationResult } from './automation-idle-governance-reconciliation.js';
import type { O10IdleGovernanceStabilizationPassResult } from './automation-idle-governance-stabilization.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceCopilotBrief {
  schema: '10m.agent20.idle-governance-copilot-brief.v1';
  headline: string;
  markdown: string;
  escalationLevel: number;
}

export function buildIdleGovernanceCopilotBrief(
  pass: O10IdleGovernanceStabilizationPassResult,
  reconciliation: O10IdleGovernanceReconciliationResult,
  ladder: O10IdleGovernanceEscalationLadderResult
): O10IdleGovernanceCopilotBrief {
  const report = buildIdleGovernanceReport(pass.governance);
  const headline = [
    'idle_gov_brief',
    `wave=${pass.stabilization.wave}`,
    `reconcile=${reconciliation.status}`,
    `escalation=L${ladder.level}`,
  ].join(' ');

  const lines = [
    '## Agent 20 idle governance co-pilot brief',
    '',
    `- ${pass.stabilization.summaryLine}`,
    `- ${reconciliation.summaryLine}`,
    `- ${ladder.summaryLine} action=${ladder.recommendedAction}`,
    '',
    report.markdown,
    '',
    pass.remediationRun.summaryLine,
  ];

  return {
    schema: '10m.agent20.idle-governance-copilot-brief.v1',
    headline,
    markdown: lines.join('\n'),
    escalationLevel: ladder.level,
  };
}

/** Build brief from a full compliance cycle (round-10 dashboard hook). */
export function buildIdleGovernanceCopilotBriefFromCycle(
  cycle: O10IdleGovernanceComplianceCycleResult
): O10IdleGovernanceCopilotBrief {
  const ladder = evaluateIdleGovernanceEscalationLadder(cycle.pass.auditTrail);
  return buildIdleGovernanceCopilotBrief(cycle.pass, cycle.reconciliation, ladder);
}

export function runO10Agent20IdleGovernanceCopilotBriefSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockPass: O10IdleGovernanceStabilizationPassResult = {
    schema: '10m.agent20.idle-governance-stabilization-pass.v1',
    governance: {
      schema: '10m.agent20.idle-ops-governance.v1',
      alertLevel: 'warn',
      remediationStepCount: 2,
      summaryLine: 'mock gov',
      steward: { persisted: {} as never, throttled: true, reason: 'idle_ops_tier2_throttle_autonomy' },
      window: {
        queue: { maxDepth: 6, items: [] },
        deescalationState: {} as never,
        telemetry: [],
        summary: {
          schema: '10m.agent20.idle-ops-window.v1',
          turnsRun: 2,
          humanCommitCount: 0,
          peakEffectiveTier: 2,
          finalScheduleAction: 'defer',
          digestSummary: 'defer=1/2',
        },
        lastTurn: {} as never,
      },
    },
    remediationRun: {
      schema: '10m.agent20.governance-remediation-run.v1',
      plan: { schema: '10m.agent20.backpressure-remediation.v1', alertLevel: 'warn', steps: [] },
      queue: { maxDepth: 6, items: [] },
      appliedKinds: ['surface_warn_banner'],
      appliedStepCount: 1,
      pendingHumanCommit: false,
      summaryLine: 'gov_remediation_run level=warn applied=1',
    },
    auditTrail: {
      schema: '10m.agent20.idle-governance-audit-trail.v1',
      entries: [
        {
          schema: '10m.agent20.idle-governance-audit.v1',
          turn: 1,
          alertLevel: 'warn',
          peakTier: 2,
          appliedStepCount: 1,
          pendingHumanCommit: false,
          fingerprint: 'w1',
        },
      ],
    },
    stabilization: {
      schema: '10m.agent20.idle-governance-stabilization.v1',
      wave: 'idle_governance_remediating',
      stabilized: false,
      auditDigest: 'idle_gov_audit entries=1',
      reportHeadline: 'idle_governance alert=warn peak=t2',
      summaryLine: 'gov_stabilization wave=idle_governance_remediating stabilized=false',
    },
  };

  const reconciliation: O10IdleGovernanceReconciliationResult = {
    schema: '10m.agent20.idle-governance-reconciliation.v1',
    status: 'aligned',
    priorAlertLevel: null,
    deltaPeakTier: 0,
    auditMatchesPass: true,
    summaryLine: 'gov_reconcile status=aligned audit_ok=true delta_peak=0',
  };

  const ladder = evaluateIdleGovernanceEscalationLadder(mockPass.auditTrail);
  const brief = buildIdleGovernanceCopilotBrief(mockPass, reconciliation, ladder);

  push('gov_brief_md', 'brief markdown includes co-pilot header', brief.markdown.includes('## Agent 20 idle governance co-pilot brief'));
  push(
    'gov_brief_headline',
    'headline encodes wave and reconcile',
    brief.headline.includes('wave=idle_governance_remediating') && brief.headline.includes('reconcile=aligned')
  );
  push('gov_brief_schema', 'copilot brief schema marker', brief.schema === '10m.agent20.idle-governance-copilot-brief.v1');
  push('gov_brief_escalation', 'brief carries escalation level', brief.escalationLevel === ladder.level);

  return results;
}
