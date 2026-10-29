import {
  evaluateIdleAutomationEscalation,
  type O10IdleEscalationResult,
  type O10IdleEscalationTier,
} from './automation-idle-escalation.js';
import {
  coordinateAutomationIntentSchedule,
  scheduleAutomationIntentFromRule,
  type O10IntentScheduleResult,
} from './intent-schedule-coordinator.js';
import {
  createEmptyAutomationIntentQueue,
} from './automation-intent-queue.js';
import type { O10AutomationIntentQueue, O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IntentBackpressurePolicy {
  tier: O10IdleEscalationTier;
  effectiveMaxDepth: number;
  deferLowPriorityBelow: number;
}

export function resolveIntentBackpressurePolicy(
  escalation: O10IdleEscalationResult,
  baseMaxDepth: number
): O10IntentBackpressurePolicy {
  const shrink = escalation.tier >= 3 ? 3 : escalation.tier >= 2 ? 2 : escalation.tier >= 1 ? 1 : 0;
  const effectiveMaxDepth = Math.max(1, baseMaxDepth - shrink);
  const deferLowPriorityBelow = escalation.tier >= 2 ? 4 : escalation.tier >= 1 ? 2 : 0;
  return { tier: escalation.tier, effectiveMaxDepth, deferLowPriorityBelow };
}

export function applyQueueDepthBackpressure(
  queue: O10AutomationIntentQueue,
  policy: O10IntentBackpressurePolicy
): O10AutomationIntentQueue {
  const active = queue.items.filter(i => i.status === 'queued' || i.status === 'running');
  if (active.length <= policy.effectiveMaxDepth) return queue;
  const overflow = active.length - policy.effectiveMaxDepth;
  let dropped = 0;
  const items = [...queue.items].reverse().map((item) => {
    if (dropped >= overflow) return item;
    if (item.status !== 'queued' || item.priority >= 8) return item;
    dropped += 1;
    return { ...item, status: 'cancelled' as const, reason: 'backpressure_drop' };
  });
  return { ...queue, maxDepth: policy.effectiveMaxDepth, items: items.reverse() };
}

/** Schedule or coordinate intents under idle escalation backpressure. */
export function scheduleWithIdleBackpressure(
  queue: O10AutomationIntentQueue,
  rule: PortableHumanAutomationRule,
  turn: number,
  day: number,
  escalationInput: Parameters<typeof evaluateIdleAutomationEscalation>[0],
  label = 'bp'
): { queue: O10AutomationIntentQueue; schedule: O10IntentScheduleResult; policy: O10IntentBackpressurePolicy } {
  const escalation = evaluateIdleAutomationEscalation(escalationInput);
  const policy = resolveIntentBackpressurePolicy(escalation, queue.maxDepth);
  let q = applyQueueDepthBackpressure({ ...queue, maxDepth: policy.effectiveMaxDepth }, policy);

  if (escalation.blockNewIntents) {
    return {
      queue: q,
      policy,
      schedule: { queue: q, decision: { action: 'defer', reason: 'Idle escalation blocks new intents.' } },
    };
  }

  if (policy.deferLowPriorityBelow > 0 && rule.priority < policy.deferLowPriorityBelow) {
    return {
      queue: q,
      policy,
      schedule: { queue: q, decision: { action: 'defer', reason: 'Low priority deferred under backpressure.' } },
    };
  }

  const schedule = scheduleAutomationIntentFromRule(q, rule, turn, day, label);
  q = schedule.queue;
  return { queue: q, schedule, policy };
}

export function coordinateWithIdleBackpressure(
  queue: O10AutomationIntentQueue,
  rule: PortableHumanAutomationRule,
  turn: number,
  day: number,
  escalationInput: Parameters<typeof evaluateIdleAutomationEscalation>[0]
): { queue: O10AutomationIntentQueue; schedule: O10IntentScheduleResult; policy: O10IntentBackpressurePolicy } {
  const escalation = evaluateIdleAutomationEscalation(escalationInput);
  const policy = resolveIntentBackpressurePolicy(escalation, queue.maxDepth);
  let q = applyQueueDepthBackpressure({ ...queue, maxDepth: policy.effectiveMaxDepth }, policy);
  if (escalation.throttleHumanAutomation && rule.priority < 5) {
    return {
      queue: q,
      policy,
      schedule: { queue: q, decision: { action: 'defer', reason: 'Throttled under idle escalation.' } },
    };
  }
  const schedule = coordinateAutomationIntentSchedule(q, rule, turn, day);
  return { queue: schedule.queue, schedule, policy };
}

function sampleRule(overrides: Partial<PortableHumanAutomationRule> = {}): PortableHumanAutomationRule {
  return {
    id: 'bp1',
    name: 'Backpressure sample',
    enabled: true,
    authorityDisabled: false,
    priority: 3,
    activeFromDay: 0,
    activeUntilDay: 99,
    trigger: { type: 'turn_start' },
    conditions: null,
    limits: { maxRunsPerDay: 5, maxRunsTotal: null, cooldownTurns: 0 },
    safety: { maxCostPerRun: null, minCashRemainingAfterRun: null, stopIfNoStateChangeCount: 5 },
    stats: {
      totalRuns: 0,
      totalSuccesses: 0,
      totalSkipped: 0,
      totalFailed: 0,
      lastRunDay: null,
      lastRunTurn: null,
      runsToday: 0,
      runsTodayDay: -1,
      consecutiveNoChangeCount: 0,
      lastResultSummary: '',
    },
    actionType: 'wait',
    resolvedCost: 0,
    spendableCash: 100,
    ...overrides,
  };
}

export function runO10Agent20IntentBackpressureSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const rule = sampleRule({ priority: 6, stats: { ...sampleRule().stats } });
  const nominal = scheduleWithIdleBackpressure(
    createEmptyAutomationIntentQueue(8),
    rule,
    2,
    1,
    { idleMs: 500, consecutiveIdleTurns: 0 }
  );
  push('bp_schedule_nominal', 'nominal tier schedules intent', nominal.schedule.decision.action === 'execute_now');

  const lowPri = scheduleWithIdleBackpressure(
    createEmptyAutomationIntentQueue(8),
    sampleRule({ priority: 1 }),
    3,
    1,
    { idleMs: 400_000, consecutiveIdleTurns: 4, queuedIntentCount: 2 }
  );
  push('bp_defer_low', 'tier 2 defers low priority enqueue', lowPri.schedule.decision.action === 'defer');

  const saturated = scheduleWithIdleBackpressure(
    createEmptyAutomationIntentQueue(8),
    sampleRule({ priority: 9 }),
    4,
    1,
    { idleMs: 900_000, consecutiveIdleTurns: 10, queuedIntentCount: 6 }
  );
  push(
    'bp_block_saturated',
    'tier 3 saturation blocks new intents',
    saturated.schedule.decision.action === 'defer' && saturated.policy.effectiveMaxDepth <= 5
  );

  const policy = resolveIntentBackpressurePolicy(
    evaluateIdleAutomationEscalation({ idleMs: 600_000, consecutiveIdleTurns: 6 }),
    8
  );
  push('bp_policy_shrink', 'steward band shrinks effective depth', policy.effectiveMaxDepth === 5 && policy.tier === 3);

  return results;
}
