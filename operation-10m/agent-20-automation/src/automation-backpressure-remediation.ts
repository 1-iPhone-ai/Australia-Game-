import type { O10BackpressureAlert, O10BackpressureAlertLevel } from './automation-backpressure-alerts.js';
import type { O10SelfTestResult } from './types.js';

export type O10BackpressureRemediationKind =
  | 'none'
  | 'surface_warn_banner'
  | 'defer_low_priority_intents'
  | 'request_human_commit'
  | 'shrink_intent_queue'
  | 'steward_watch_only';

export interface O10BackpressureRemediationStep {
  kind: O10BackpressureRemediationKind;
  priority: number;
  detail: string;
}

export interface O10BackpressureRemediationPlan {
  schema: '10m.agent20.backpressure-remediation.v1';
  alertLevel: O10BackpressureAlertLevel;
  steps: O10BackpressureRemediationStep[];
}

/** Map a backpressure alert into ordered remediation steps for idle ops UI / steward hooks. */
export function planBackpressureRemediation(alert: O10BackpressureAlert): O10BackpressureRemediationPlan {
  const steps: O10BackpressureRemediationStep[] = [];

  if (alert.level === 'none') {
    steps.push({ kind: 'none', priority: 0, detail: 'telemetry_nominal' });
    return { schema: '10m.agent20.backpressure-remediation.v1', alertLevel: alert.level, steps };
  }

  if (alert.level === 'warn') {
    steps.push({
      kind: 'surface_warn_banner',
      priority: 10,
      detail: `defer_ratio=${alert.deferRatio.toFixed(2)}`,
    });
    steps.push({
      kind: 'defer_low_priority_intents',
      priority: 20,
      detail: 'elevated_tier_or_defer',
    });
  }

  if (alert.level === 'critical') {
    steps.push({
      kind: 'request_human_commit',
      priority: 5,
      detail: alert.reasons.join(',') || 'critical_backpressure',
    });
    steps.push({
      kind: 'shrink_intent_queue',
      priority: 15,
      detail: `drops=${alert.digest.totalDropped}`,
    });
    steps.push({
      kind: 'steward_watch_only',
      priority: 25,
      detail: `peak_t${alert.digest.peakTier}`,
    });
  }

  steps.sort((a, b) => a.priority - b.priority);
  return { schema: '10m.agent20.backpressure-remediation.v1', alertLevel: alert.level, steps };
}

export function formatBackpressureRemediationLine(plan: O10BackpressureRemediationPlan): string {
  const head = plan.steps[0]?.kind ?? 'none';
  return `bp_remediation level=${plan.alertLevel} first=${head} steps=${plan.steps.length}`;
}

export function runO10Agent20BackpressureRemediationSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const calm = planBackpressureRemediation({
    schema: '10m.agent20.backpressure-alert.v1',
    level: 'none',
    deferRatio: 0,
    reasons: [],
    digest: {
      schema: '10m.agent20.backpressure-telemetry.v1',
      sliceCount: 2,
      deferCount: 0,
      executeCount: 2,
      totalDropped: 0,
      peakTier: 0,
      summaryLine: 'ok',
    },
  });
  push('bp_remed_calm', 'none alert yields single none step', calm.steps.length === 1 && calm.steps[0].kind === 'none');

  const warn = planBackpressureRemediation({
    schema: '10m.agent20.backpressure-alert.v1',
    level: 'warn',
    deferRatio: 0.5,
    reasons: ['defer_ratio'],
    digest: {
      schema: '10m.agent20.backpressure-telemetry.v1',
      sliceCount: 4,
      deferCount: 2,
      executeCount: 2,
      totalDropped: 1,
      peakTier: 2,
      summaryLine: 'warn',
    },
  });
  push(
    'bp_remed_warn',
    'warn includes banner and defer steps',
    warn.steps.some(s => s.kind === 'surface_warn_banner') &&
      warn.steps.some(s => s.kind === 'defer_low_priority_intents')
  );

  const critical = planBackpressureRemediation({
    schema: '10m.agent20.backpressure-alert.v1',
    level: 'critical',
    deferRatio: 0.9,
    reasons: ['peak_tier', 'drops'],
    digest: {
      schema: '10m.agent20.backpressure-telemetry.v1',
      sliceCount: 3,
      deferCount: 3,
      executeCount: 0,
      totalDropped: 8,
      peakTier: 3,
      summaryLine: 'critical',
    },
  });
  push(
    'bp_remed_critical',
    'critical requests human and steward watch',
    critical.steps.some(s => s.kind === 'request_human_commit') &&
      critical.steps.some(s => s.kind === 'steward_watch_only')
  );

  push(
    'bp_remed_order',
    'steps sorted by priority',
    critical.steps.every((s, i) => i === 0 || s.priority >= critical.steps[i - 1].priority)
  );

  return results;
}
