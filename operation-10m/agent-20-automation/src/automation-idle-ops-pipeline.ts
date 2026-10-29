import {
  buildBackpressureTelemetryDigest,
  recordBackpressureTelemetrySlice,
  sliceFromBackpressureTurn,
  type O10BackpressureTelemetrySlice,
} from './automation-backpressure-telemetry.js';
import {
  evaluateIdleEscalationWithDeescalation,
  type O10IdleDeescalationState,
} from './automation-idle-deescalation.js';
import { scheduleWithIdleBackpressure } from './automation-intent-backpressure.js';
import { createEmptyAutomationIntentQueue } from './automation-intent-queue.js';
import type { O10AutomationIntentQueue, O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleOpsTurnInput {
  queue: O10AutomationIntentQueue;
  rule: PortableHumanAutomationRule;
  turn: number;
  day: number;
  deescalationState: O10IdleDeescalationState;
  telemetry: O10BackpressureTelemetrySlice[];
  humanCommittedThisTurn: boolean;
  escalationInput: Parameters<typeof scheduleWithIdleBackpressure>[4];
}

export interface O10IdleOpsTurnResult {
  queue: O10AutomationIntentQueue;
  deescalationState: O10IdleDeescalationState;
  telemetry: O10BackpressureTelemetrySlice[];
  effectiveTier: number;
  scheduleAction: string;
  digestSummary: string;
}

function countActiveQueued(queue: O10AutomationIntentQueue): number {
  return queue.items.filter(i => i.status === 'queued' || i.status === 'running').length;
}

/** One automation ops turn: de-escalation latch, backpressure schedule, telemetry ring. */
export function runIdleAutomationOpsTurn(input: O10IdleOpsTurnInput): O10IdleOpsTurnResult {
  const before = countActiveQueued(input.queue);
  const { state, effectiveTier } = evaluateIdleEscalationWithDeescalation(
    input.escalationInput,
    input.deescalationState,
    input.humanCommittedThisTurn
  );

  const mergedEscalation = {
    ...input.escalationInput,
    blockedEndTurnStreak: Math.max(input.escalationInput.blockedEndTurnStreak ?? 0, effectiveTier >= 3 ? 2 : 0),
  };

  const { queue, schedule, policy } = scheduleWithIdleBackpressure(
    input.queue,
    input.rule,
    input.turn,
    input.day,
    mergedEscalation,
    `ops${input.turn}`
  );

  const after = countActiveQueued(queue);
  const droppedLowPriority = Math.max(0, before - after - (schedule.decision.action === 'execute_now' ? 1 : 0));

  const slice = sliceFromBackpressureTurn(input.turn, input.day, policy, schedule.decision, droppedLowPriority);
  const telemetry = recordBackpressureTelemetrySlice(input.telemetry, slice);
  const digest = buildBackpressureTelemetryDigest(telemetry);

  return {
    queue,
    deescalationState: state,
    telemetry,
    effectiveTier,
    scheduleAction: schedule.decision.action,
    digestSummary: digest.summaryLine,
  };
}

export function buildIdleOpsPipelineReportMarkdown(telemetry: O10BackpressureTelemetrySlice[]): string {
  const digest = buildBackpressureTelemetryDigest(telemetry);
  return ['## Agent 20 idle ops pipeline', digest.summaryLine, ''].join('\n');
}

function sampleOpsRule(overrides: Partial<PortableHumanAutomationRule> = {}): PortableHumanAutomationRule {
  return {
    id: 'ops1',
    name: 'Ops sample',
    enabled: true,
    authorityDisabled: false,
    priority: 6,
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

export function runO10Agent20IdleOpsPipelineSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const turn1 = runIdleAutomationOpsTurn({
    queue: createEmptyAutomationIntentQueue(8),
    rule: sampleOpsRule(),
    turn: 1,
    day: 1,
    deescalationState: { latchedTier: 0, turnsAtTier: 0 },
    telemetry: [],
    humanCommittedThisTurn: false,
    escalationInput: { idleMs: 500, consecutiveIdleTurns: 0 },
  });
  push('ops_exec_nominal', 'nominal turn schedules execute_now', turn1.scheduleAction === 'execute_now');

  const turn2 = runIdleAutomationOpsTurn({
    queue: turn1.queue,
    rule: sampleOpsRule({ priority: 1 }),
    turn: 2,
    day: 1,
    deescalationState: turn1.deescalationState,
    telemetry: turn1.telemetry,
    humanCommittedThisTurn: false,
    escalationInput: { idleMs: 500_000, consecutiveIdleTurns: 5, queuedIntentCount: 3 },
  });
  push('ops_defer_pressure', 'pressure defers low priority rule', turn2.scheduleAction === 'defer');

  const turn3 = runIdleAutomationOpsTurn({
    queue: turn2.queue,
    rule: sampleOpsRule(),
    turn: 3,
    day: 1,
    deescalationState: { latchedTier: 3, turnsAtTier: 2 },
    telemetry: turn2.telemetry,
    humanCommittedThisTurn: true,
    escalationInput: { idleMs: 900_000, consecutiveIdleTurns: 12 },
  });
  push('ops_human_reset', 'human commit resets effective tier', turn3.effectiveTier === 0);

  const md = buildIdleOpsPipelineReportMarkdown(turn3.telemetry);
  push('ops_report_md', 'pipeline report markdown header', md.includes('idle ops pipeline') && md.includes('slices='));

  return results;
}
