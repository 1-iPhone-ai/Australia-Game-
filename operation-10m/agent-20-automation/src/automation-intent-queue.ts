import type {
  O10AutomationIntent,
  O10AutomationIntentQueue,
  O10SelfTestResult,
  PortableHumanAutomationRule,
} from './types.js';

export const O10_DEFAULT_INTENT_QUEUE_DEPTH = 8;

export function createEmptyAutomationIntentQueue(
  maxDepth = O10_DEFAULT_INTENT_QUEUE_DEPTH
): O10AutomationIntentQueue {
  return { maxDepth, items: [] };
}

export function enqueueAutomationIntent(
  queue: O10AutomationIntentQueue,
  intent: O10AutomationIntent
): { queue: O10AutomationIntentQueue; accepted: boolean; reason?: string } {
  if (queue.items.some(i => i.ruleId === intent.ruleId && i.status === 'queued')) {
    return { queue, accepted: false, reason: 'Duplicate rule already queued.' };
  }
  if (queue.items.filter(i => i.status === 'queued' || i.status === 'running').length >= queue.maxDepth) {
    return { queue, accepted: false, reason: 'Intent queue at capacity.' };
  }
  return { queue: { ...queue, items: [...queue.items, intent] }, accepted: true };
}

export function intentFromSelectedRule(
  rule: PortableHumanAutomationRule,
  turn: number,
  day: number,
  idSuffix = '0'
): O10AutomationIntent {
  return {
    id: `intent_${rule.id}_${turn}_${idSuffix}`,
    ruleId: rule.id,
    actionType: rule.actionType,
    priority: rule.priority,
    enqueuedTurn: turn,
    enqueuedDay: day,
    resolvedCost: rule.resolvedCost,
    status: 'queued',
  };
}

export function dequeueHighestPriorityIntent(
  queue: O10AutomationIntentQueue,
  turn: number
): { queue: O10AutomationIntentQueue; intent: O10AutomationIntent | null } {
  const queued = queue.items.filter(i => i.status === 'queued' && i.enqueuedTurn <= turn);
  if (queued.length === 0) return { queue, intent: null };
  const pick = [...queued].sort((a, b) => b.priority - a.priority)[0];
  const items = queue.items.map(i =>
    i.id === pick.id ? { ...i, status: 'running' as const } : i
  );
  return { queue: { ...queue, items }, intent: { ...pick, status: 'running' } };
}

export function completeAutomationIntent(
  queue: O10AutomationIntentQueue,
  intentId: string,
  status: 'completed' | 'cancelled' | 'blocked',
  reason?: string
): O10AutomationIntentQueue {
  return {
    ...queue,
    items: queue.items.map(i =>
      i.id === intentId ? { ...i, status, reason: reason || i.reason } : i
    ),
  };
}

export function pruneAutomationIntentHistory(
  queue: O10AutomationIntentQueue,
  keep = 32
): O10AutomationIntentQueue {
  return { ...queue, items: queue.items.slice(-keep) };
}

export function runO10Agent20IntentQueueSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  let q = createEmptyAutomationIntentQueue(2);
  const a = intentFromSelectedRule(
    {
      id: 'r1',
      name: 'A',
      enabled: true,
      authorityDisabled: false,
      priority: 5,
      activeFromDay: 0,
      activeUntilDay: 9,
      trigger: { type: 'turn_start' },
      conditions: null,
      limits: { maxRunsPerDay: 1, maxRunsTotal: null, cooldownTurns: 0 },
      safety: { maxCostPerRun: null, minCashRemainingAfterRun: null, stopIfNoStateChangeCount: 3 },
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
      actionType: 'sell',
      resolvedCost: 0,
      spendableCash: 100,
    },
    1,
    1
  );
  const e1 = enqueueAutomationIntent(q, a);
  q = e1.queue;
  push('enqueue_ok', 'accepts first intent', e1.accepted === true);
  const dup = enqueueAutomationIntent(q, { ...a, id: 'intent_dup' });
  push('enqueue_dup', 'rejects duplicate rule', dup.accepted === false);
  const e2 = enqueueAutomationIntent(q, { ...a, id: 'i2', ruleId: 'r2', priority: 9 });
  q = e2.queue;
  const e3 = enqueueAutomationIntent(q, { ...a, id: 'i3', ruleId: 'r3' });
  push('enqueue_cap', 'respects max depth', e3.accepted === false);
  const { queue: q2, intent } = dequeueHighestPriorityIntent(q, 1);
  push('dequeue_prio', 'dequeues highest priority', intent?.ruleId === 'r2' && intent.status === 'running');
  const q3 = completeAutomationIntent(q2, intent!.id, 'completed');
  push('complete', 'marks intent completed', q3.items.find(i => i.id === intent!.id)?.status === 'completed');

  return results;
}
