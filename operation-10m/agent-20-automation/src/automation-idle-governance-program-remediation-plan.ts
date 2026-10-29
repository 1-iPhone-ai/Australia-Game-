import type { O10IdleGovernanceProgramComplianceScore } from './automation-idle-governance-program-compliance-score.js';
import type { O10IdleGovernanceProgramRegistryRollupResult } from './automation-idle-governance-program-registry-rollup.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramRemediationItem {
  priority: number;
  actionKey: string;
  rationale: string;
}

export interface O10IdleGovernanceProgramRemediationPlan {
  schema: '10m.agent20.idle-governance-program-remediation-plan.v1';
  items: O10IdleGovernanceProgramRemediationItem[];
  summaryLine: string;
  planMarkdown: string;
}

function buildRemediationPlanMarkdown(items: O10IdleGovernanceProgramRemediationItem[]): string {
  const lines = ['## Agent 20 idle governance remediation plan', ''];
  for (const item of items) {
    lines.push(`- [p${item.priority}] \`${item.actionKey}\` — ${item.rationale}`);
  }
  lines.push('');
  return lines.join('\n');
}

/** Round-16 remediation backlog from compliance band + registry rollup recommendation. */
export function buildIdleGovernanceProgramRemediationPlan(
  compliance: O10IdleGovernanceProgramComplianceScore,
  rollup: O10IdleGovernanceProgramRegistryRollupResult
): O10IdleGovernanceProgramRemediationPlan {
  const items: O10IdleGovernanceProgramRemediationItem[] = [];

  if (compliance.band === 'red') {
    items.push({
      priority: 1,
      actionKey: 'pause_autonomous_idle_steward',
      rationale: 'Compliance band red — latch manual override until attestation recovers.',
    });
    items.push({
      priority: 2,
      actionKey: 'run_program_attestation_audit',
      rationale: 'Reconcile failed attestations against replay tape frames.',
    });
  } else if (compliance.band === 'amber') {
    items.push({
      priority: 1,
      actionKey: 'tighten_watch_cadence',
      rationale: 'Amber band — increase sustained watch frequency for one ops window.',
    });
    items.push({
      priority: 2,
      actionKey: 'refresh_program_charter',
      rationale: 'Re-read charter policy line before next program pass.',
    });
  } else {
    items.push({
      priority: 1,
      actionKey: 'maintain_program_cadence',
      rationale: 'Green band — continue scheduled program operations.',
    });
  }

  if (rollup.recommendation === 'director_escalate_takeover') {
    items.push({
      priority: 0,
      actionKey: 'escalate_human_takeover',
      rationale: 'Registry rollup recommends director escalation to human takeover.',
    });
  } else if (rollup.recommendation === 'director_audit_program_attestations') {
    items.push({
      priority: 1,
      actionKey: 'audit_program_attestations',
      rationale: 'Registry rollup flagged low attest ok ratio.',
    });
  }

  items.sort((a, b) => a.priority - b.priority);

  const summaryLine = [
    'gov_program_remediation',
    `band=${compliance.band}`,
    `items=${items.length}`,
    `rollup=${rollup.recommendation}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-remediation-plan.v1',
    items,
    summaryLine,
    planMarkdown: buildRemediationPlanMarkdown(items),
  };
}

export function runO10Agent20IdleGovernanceProgramRemediationPlanSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const rollupBase: O10IdleGovernanceProgramRegistryRollupResult = {
    schema: '10m.agent20.idle-governance-program-registry-rollup.v1',
    entryCount: 2,
    attestOkRatio: 0.5,
    escalationCount: 0,
    dominantRollup: 'continue_scheduled_watch',
    recommendation: 'director_audit_program_attestations',
    summaryLine: 'rollup',
  };

  const amberPlan = buildIdleGovernanceProgramRemediationPlan(
    {
      schema: '10m.agent20.idle-governance-program-compliance-score.v1',
      score: 55,
      band: 'amber',
      factors: [],
      summaryLine: 'amber',
    },
    rollupBase
  );
  push(
    'gov_prog_remed_amber',
    'amber plan includes watch + audit actions',
    amberPlan.items.some(i => i.actionKey === 'tighten_watch_cadence') &&
      amberPlan.items.some(i => i.actionKey === 'audit_program_attestations')
  );

  const redPlan = buildIdleGovernanceProgramRemediationPlan(
    {
      schema: '10m.agent20.idle-governance-program-compliance-score.v1',
      score: 30,
      band: 'red',
      factors: ['stress'],
      summaryLine: 'red',
    },
    { ...rollupBase, recommendation: 'director_escalate_takeover', escalationCount: 2 }
  );
  push(
    'gov_prog_remed_red',
    'red plan prioritizes pause and takeover',
    redPlan.items[0]?.actionKey === 'escalate_human_takeover' &&
      redPlan.items.some(i => i.actionKey === 'pause_autonomous_idle_steward')
  );

  push(
    'gov_prog_remed_schema',
    'remediation plan schema marker',
    amberPlan.schema === '10m.agent20.idle-governance-program-remediation-plan.v1'
  );
  push(
    'gov_prog_remed_markdown',
    'plan markdown header present',
    amberPlan.planMarkdown.includes('remediation plan')
  );

  return results;
}
