import { evaluateHumanAutomationExecutionEligibility } from './limits.js';
import {
  completeAutomationIntent,
  createEmptyAutomationIntentQueue,
  dequeueHighestPriorityIntent,
  enqueueAutomationIntent,
  intentFromSelectedRule,
} from './automation-intent-queue.js';
import type {
  O10AutomationIntentQueue,
  O10SelfTestResult,
  PortableHumanAutomationRule,
} from './types.js';

export interface O10IntentScheduleDecision {
  action: 'execute_now' | 'defer' | 'drop';
  reason: string;
  intentId?: string;
}

export interface O10IntentScheduleResult {
  queue: O10AutomationIntentQueue;
  decision: O10IntentScheduleDecision;
}

/** Gate intent dequeue against rule limits; defer when cooldown or caps block execution. */
export function coordinateAutomationIntentSchedule(
  queue: O10AutomationIntentQueue,
  rule: PortableHumanAutomationRule,
  turn: number,
  day: number
): O10IntentScheduleResult {
  const elig = evaluateHumanAutomationExecutionEligibility(
    rule.enabled,
    rule.authorityDisabled,
    rule.activeFromDay,
    rule.activeUntilDay,
    rule.limits,
    rule.safety,
    rule.stats,
    day,
    turn
  );
  if (!elig.eligible) {
    return {
      queue,
      decision: { action: 'defer', reason: elig.reason },
    };
  }
  const { queue: q2, intent } = dequeueHighestPriorityIntent(queue, turn);
  if (!intent || intent.ruleId !== rule.id) {
    return {
      queue,
      decision: { action: 'drop', reason: intent ? 'Head intent rule mismatch.' : 'No queued intent.' },
    };
  }
  return {
    queue: completeAutomationIntent(q2, intent.id, 'completed'),
    decision: { action: 'execute_now', reason: '', intentId: intent.id },
  };
}

/** Enqueue selected rule when eligible; otherwise surface defer reason without mutating queue. */
export function scheduleAutomationIntentFromRule(
  queue: O10AutomationIntentQueue,
  rule: PortableHumanAutomationRule,
  turn: number,
  day: number,
  label = 'sched'
): O10IntentScheduleResult {
  const elig = evaluateHumanAutomationExecutionEligibility(
    rule.enabled,
    rule.authorityDisabled,
    rule.activeFromDay,
    rule.activeUntilDay,
    rule.limits,
    rule.safety,
    rule.stats,
    day,
    turn
  );
  if (!elig.eligible) {
    return { queue, decision: { action: 'defer', reason: elig.reason } };
  }
  const enq = enqueueAutomationIntent(queue, intentFromSelectedRule(rule, turn, day, label));
  if (!enq.accepted) {
    return { queue, decision: { action: 'drop', reason: enq.reason || 'Enqueue rejected.' } };
  }
  return {
    queue: enq.queue,
    decision: { action: 'execute_now', reason: 'Intent enqueued for immediate dequeue.' },
  };
}

function sampleRule(overrides: Partial<PortableHumanAutomationRule> = {}): PortableHumanAutomationRule {
  return {
    id: 'r1',
    name: 'Sample',
    enabled: true,
    authorityDisabled: false,
    priority: 5,
    activeFromDay: 0,
    activeUntilDay: 99,
    trigger: { type: 'turn_start' },
    conditions: null,
    limits: { maxRunsPerDay: 2, maxRunsTotal: null, cooldownTurns: 2 },
    safety: { maxCostPerRun: null, minCashRemainingAfterRun: null, stopIfNoStateChangeCount: 5 },
    stats: {
      totalRuns: 0,
      totalSuccesses: 0,
      totalSkipped: 0,
      totalFailed: 0,
      lastRunDay: 1,
      lastRunTurn: 5,
      runsToday: 0,
      runsTodayDay: 1,
      consecutiveNoChangeCount: 0,
      lastResultSummary: '',
    },
    actionType: 'wait',
    resolvedCost: 0,
    spendableCash: 100,
    ...overrides,
  };
}

export function runO10Agent20IntentScheduleSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const rule = sampleRule({ stats: { ...sampleRule().stats, lastRunTurn: null, lastRunDay: null } });
  let q = createEmptyAutomationIntentQueue(4);
  const sched = scheduleAutomationIntentFromRule(q, rule, 6, 1);
  q = sched.queue;
  push('sched_enqueue', 'eligible rule enqueues intent', sched.decision.action === 'execute_now' && q.items.length === 1);

  const cooldownRule = sampleRule({
    stats: {
      ...sampleRule().stats,
      lastRunTurn: 8,
      runsToday: 0,
    },
  });
  const defer = scheduleAutomationIntentFromRule(q, cooldownRule, 9, 1);
  push('sched_defer_cooldown', 'cooldown defers scheduling', defer.decision.action === 'defer');

  q = enqueueAutomationIntent(q, intentFromSelectedRule(rule, 10, 1, 'x')).queue;
  const exec = coordinateAutomationIntentSchedule(q, rule, 10, 1);
  push(
    'sched_execute',
    'coordinate completes head intent when eligible',
    exec.decision.action === 'execute_now' &&
      exec.queue.items.find(i => i.id === exec.decision.intentId)?.status === 'completed'
  );

  const capRule = sampleRule({
    limits: { maxRunsPerDay: 1, maxRunsTotal: null, cooldownTurns: 0 },
    stats: { ...sampleRule().stats, runsToday: 1, runsTodayDay: 2 },
  });
  const cap = coordinateAutomationIntentSchedule(
    enqueueAutomationIntent(createEmptyAutomationIntentQueue(), intentFromSelectedRule(capRule, 3, 2)).queue,
    capRule,
    3,
    2
  );
  push('sched_cap_defer', 'daily cap defers execution', cap.decision.action === 'defer');

  return results;
}
