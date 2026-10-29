import { evaluateBackpressureAlertsFromSlices } from './automation-backpressure-alerts.js';
import {
  planBackpressureRemediation,
  type O10BackpressureRemediationKind,
  type O10BackpressureRemediationPlan,
} from './automation-backpressure-remediation.js';
import type { O10IdleOpsGovernanceResult } from './automation-idle-ops-governance.js';
import type { O10AutomationIntentQueue, O10SelfTestResult } from './types.js';

export interface O10GovernanceRemediationRunResult {
  schema: '10m.agent20.governance-remediation-run.v1';
  plan: O10BackpressureRemediationPlan;
  queue: O10AutomationIntentQueue;
  appliedKinds: O10BackpressureRemediationKind[];
  appliedStepCount: number;
  pendingHumanCommit: boolean;
  summaryLine: string;
}

const LOW_PRIORITY_CUTOFF = 4;

function shrinkQueueForRemediation(queue: O10AutomationIntentQueue): O10AutomationIntentQueue {
  const nextMax = Math.max(1, queue.maxDepth - 2);
  const items = queue.items.map(item => {
    if (item.status !== 'queued') return item;
    if (item.priority < LOW_PRIORITY_CUTOFF) {
      return { ...item, status: 'cancelled' as const, reason: 'bp_remediation_shrink' };
    }
    return item;
  });
  return { maxDepth: nextMax, items };
}

function deferLowPriorityIntents(queue: O10AutomationIntentQueue): O10AutomationIntentQueue {
  const items = queue.items.map(item => {
    if (item.status !== 'queued') return item;
    if (item.priority < LOW_PRIORITY_CUTOFF) {
      return { ...item, status: 'blocked' as const, reason: 'bp_remediation_defer' };
    }
    return item;
  });
  return { ...queue, items };
}

/** Apply ordered remediation steps from a governance pass onto the live intent queue. */
export function runGovernanceRemediationPlaybook(
  governance: O10IdleOpsGovernanceResult
): O10GovernanceRemediationRunResult {
  const alert = evaluateBackpressureAlertsFromSlices(governance.window.telemetry);
  const plan = planBackpressureRemediation(alert);
  let queue = governance.window.queue;
  const appliedKinds: O10BackpressureRemediationKind[] = [];
  let pendingHumanCommit = false;

  for (const step of plan.steps) {
    switch (step.kind) {
      case 'none':
      case 'surface_warn_banner':
        appliedKinds.push(step.kind);
        break;
      case 'defer_low_priority_intents':
        queue = deferLowPriorityIntents(queue);
        appliedKinds.push(step.kind);
        break;
      case 'shrink_intent_queue':
        queue = shrinkQueueForRemediation(queue);
        appliedKinds.push(step.kind);
        break;
      case 'request_human_commit':
        pendingHumanCommit = true;
        appliedKinds.push(step.kind);
        break;
      case 'steward_watch_only':
        appliedKinds.push(step.kind);
        break;
      default:
        break;
    }
  }

  const summaryLine = [
    `gov_remediation_run level=${plan.alertLevel}`,
    `applied=${appliedKinds.length}`,
    `pending_human=${pendingHumanCommit}`,
    `queue_depth=${queue.maxDepth}`,
  ].join(' ');

  return {
    schema: '10m.agent20.governance-remediation-run.v1',
    plan,
    queue,
    appliedKinds,
    appliedStepCount: appliedKinds.filter(k => k !== 'none').length,
    pendingHumanCommit,
    summaryLine,
  };
}

export function runO10Agent20GovernanceRemediationRunnerSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const calmGovernance: O10IdleOpsGovernanceResult = {
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
        turnsRun: 1,
        humanCommitCount: 1,
        peakEffectiveTier: 0,
        finalScheduleAction: 'execute_now',
        digestSummary: 'ok',
      },
      lastTurn: {} as never,
    },
  };

  const calmRun = runGovernanceRemediationPlaybook(calmGovernance);
  push(
    'gov_remed_run_calm',
    'calm governance applies nominal none step',
    calmRun.appliedKinds.includes('none') && calmRun.pendingHumanCommit === false
  );

  const stressed = {
    ...calmGovernance,
    alertLevel: 'critical',
    remediationStepCount: 3,
    window: {
      ...calmGovernance.window,
      queue: {
        maxDepth: 8,
        items: [
          {
            id: 'i1',
            ruleId: 'r1',
            actionType: 'wait',
            priority: 2,
            enqueuedTurn: 1,
            enqueuedDay: 1,
            resolvedCost: 0,
            status: 'queued' as const,
          },
          {
            id: 'i2',
            ruleId: 'r2',
            actionType: 'wait',
            priority: 8,
            enqueuedTurn: 1,
            enqueuedDay: 1,
            resolvedCost: 0,
            status: 'queued' as const,
          },
        ],
      },
      telemetry: [
        {
          turn: 1,
          day: 1,
          tier: 3,
          effectiveMaxDepth: 5,
          deferLowPriorityBelow: 4,
          decision: 'defer',
          droppedLowPriority: 4,
        },
        {
          turn: 2,
          day: 1,
          tier: 3,
          effectiveMaxDepth: 5,
          deferLowPriorityBelow: 4,
          decision: 'defer',
          droppedLowPriority: 2,
        },
      ],
      summary: {
        ...calmGovernance.window.summary,
        peakEffectiveTier: 3,
        humanCommitCount: 0,
      },
    },
  };

  const stressRun = runGovernanceRemediationPlaybook(stressed as O10IdleOpsGovernanceResult);
  push(
    'gov_remed_run_critical',
    'critical plan shrinks queue and requests human',
    stressRun.pendingHumanCommit &&
      stressRun.queue.maxDepth < 8 &&
      stressRun.appliedKinds.includes('shrink_intent_queue')
  );

  push(
    'gov_remed_run_schema',
    'remediation run schema marker',
    stressRun.schema === '10m.agent20.governance-remediation-run.v1' && stressRun.summaryLine.includes('gov_remediation_run')
  );

  push(
    'gov_remed_run_low_priority',
    'low priority intents cancelled or blocked under stress',
    stressRun.queue.items.some(i => i.id === 'i1' && (i.status === 'cancelled' || i.status === 'blocked')) &&
      stressRun.queue.items.some(i => i.id === 'i2' && i.status === 'queued')
  );

  return results;
}
