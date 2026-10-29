import { createDefaultIdleDeescalationState } from './automation-idle-deescalation.js';
import {
  buildBackpressureTelemetryDigest,
  type O10BackpressureTelemetrySlice,
} from './automation-backpressure-telemetry.js';
import type { O10IdleEscalationTier } from './automation-idle-escalation.js';
import {
  runIdleAutomationOpsTurn,
  type O10IdleOpsTurnResult,
} from './automation-idle-ops-pipeline.js';
import { createEmptyAutomationIntentQueue } from './automation-intent-queue.js';
import type { O10AutomationIntentQueue, O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleOpsWindowSpec {
  startTurn: number;
  startDay: number;
  turnCount: number;
  /** 0 = never; N = human commit every N turns (starting when turn % N === 0). */
  humanCommittedEvery: number;
  idleMsStart: number;
  idleMsStep: number;
  consecutiveIdleStart: number;
}

export interface O10IdleOpsWindowSummary {
  schema: '10m.agent20.idle-ops-window.v1';
  turnsRun: number;
  humanCommitCount: number;
  peakEffectiveTier: O10IdleEscalationTier;
  finalScheduleAction: string;
  digestSummary: string;
}

export interface O10IdleOpsWindowResult {
  queue: O10AutomationIntentQueue;
  deescalationState: ReturnType<typeof createDefaultIdleDeescalationState>;
  telemetry: O10BackpressureTelemetrySlice[];
  summary: O10IdleOpsWindowSummary;
  lastTurn: O10IdleOpsTurnResult;
}

function sampleWindowRule(overrides: Partial<PortableHumanAutomationRule> = {}): PortableHumanAutomationRule {
  return {
    id: 'win1',
    name: 'Window sample',
    enabled: true,
    authorityDisabled: false,
    priority: 6,
    activeFromDay: 0,
    activeUntilDay: 99,
    trigger: { type: 'turn_start' },
    conditions: null,
    limits: { maxRunsPerDay: 20, maxRunsTotal: null, cooldownTurns: 0 },
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

/** Run a multi-turn idle ops window with ramping idle telemetry and optional human commit cadence. */
export function runIdleAutomationOpsWindow(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  initialQueue = createEmptyAutomationIntentQueue(8)
): O10IdleOpsWindowResult {
  let queue = initialQueue;
  let deescalationState = createDefaultIdleDeescalationState();
  let telemetry: O10BackpressureTelemetrySlice[] = [];
  let humanCommitCount = 0;
  let peakEffectiveTier: O10IdleEscalationTier = 0;
  let lastTurn!: O10IdleOpsTurnResult;

  const turnsRun = Math.max(0, spec.turnCount);
  for (let i = 0; i < turnsRun; i++) {
    const turn = spec.startTurn + i;
    const humanCommittedThisTurn =
      spec.humanCommittedEvery > 0 && turn % spec.humanCommittedEvery === 0;
    if (humanCommittedThisTurn) humanCommitCount += 1;

    const idleMs = spec.idleMsStart + spec.idleMsStep * i;
    const consecutiveIdleTurns = spec.consecutiveIdleStart + i;

    lastTurn = runIdleAutomationOpsTurn({
      queue,
      rule,
      turn,
      day: spec.startDay,
      deescalationState,
      telemetry,
      humanCommittedThisTurn,
      escalationInput: {
        idleMs,
        consecutiveIdleTurns,
        queuedIntentCount: queue.items.filter(x => x.status === 'queued' || x.status === 'running').length,
      },
    });

    queue = lastTurn.queue;
    deescalationState = lastTurn.deescalationState;
    telemetry = lastTurn.telemetry;
    if (lastTurn.effectiveTier > peakEffectiveTier) {
      peakEffectiveTier = lastTurn.effectiveTier as O10IdleEscalationTier;
    }
  }

  const digest = buildBackpressureTelemetryDigest(telemetry);
  const summary: O10IdleOpsWindowSummary = {
    schema: '10m.agent20.idle-ops-window.v1',
    turnsRun,
    humanCommitCount,
    peakEffectiveTier,
    finalScheduleAction: lastTurn?.scheduleAction ?? 'none',
    digestSummary: digest.summaryLine,
  };

  return {
    queue,
    deescalationState,
    telemetry,
    summary,
    lastTurn: lastTurn ?? {
      queue,
      deescalationState,
      telemetry,
      effectiveTier: 0,
      scheduleAction: 'none',
      digestSummary: digest.summaryLine,
    },
  };
}

export function formatIdleOpsWindowSummaryLine(summary: O10IdleOpsWindowSummary): string {
  return `ops_window turns=${summary.turnsRun} human=${summary.humanCommitCount} peak=t${summary.peakEffectiveTier} last=${summary.finalScheduleAction}`;
}

export function runO10Agent20IdleOpsWindowSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const ramp = runIdleAutomationOpsWindow(
    {
      startTurn: 1,
      startDay: 1,
      turnCount: 5,
      humanCommittedEvery: 0,
      idleMsStart: 100_000,
      idleMsStep: 80_000,
      consecutiveIdleStart: 2,
    },
    sampleWindowRule()
  );
  push(
    'ops_win_ramp',
    'window runs all turns and records telemetry slices',
    ramp.summary.turnsRun === 5 && ramp.telemetry.length === 5 && ramp.summary.peakEffectiveTier >= 1
  );

  const reset = runIdleAutomationOpsWindow(
    {
      startTurn: 1,
      startDay: 1,
      turnCount: 3,
      humanCommittedEvery: 1,
      idleMsStart: 900_000,
      idleMsStep: 0,
      consecutiveIdleStart: 12,
    },
    sampleWindowRule()
  );
  push(
    'ops_win_human',
    'human each turn keeps peak tier at 0',
    reset.summary.humanCommitCount === 3 && reset.summary.peakEffectiveTier === 0
  );

  push(
    'ops_win_schema',
    'window summary schema marker',
    ramp.summary.schema === '10m.agent20.idle-ops-window.v1' &&
      formatIdleOpsWindowSummaryLine(ramp.summary).includes('peak=t')
  );

  const empty = runIdleAutomationOpsWindow(
    {
      startTurn: 1,
      startDay: 1,
      turnCount: 0,
      humanCommittedEvery: 0,
      idleMsStart: 0,
      idleMsStep: 0,
      consecutiveIdleStart: 0,
    },
    sampleWindowRule()
  );
  push('ops_win_zero', 'zero-turn window is stable', empty.summary.turnsRun === 0 && empty.telemetry.length === 0);

  return results;
}
