import type { O10IdleEscalationTier } from './automation-idle-escalation.js';
import type { O10IntentBackpressurePolicy } from './automation-intent-backpressure.js';
import type { O10IntentScheduleDecision } from './intent-schedule-coordinator.js';
import type { O10SelfTestResult } from './types.js';

export interface O10BackpressureTelemetrySlice {
  turn: number;
  day: number;
  tier: O10IdleEscalationTier;
  effectiveMaxDepth: number;
  deferLowPriorityBelow: number;
  decision: O10IntentScheduleDecision['action'];
  droppedLowPriority: number;
}

export interface O10BackpressureTelemetryDigest {
  schema: '10m.agent20.backpressure-telemetry.v1';
  sliceCount: number;
  deferCount: number;
  executeCount: number;
  totalDropped: number;
  peakTier: O10IdleEscalationTier;
  summaryLine: string;
}

export function recordBackpressureTelemetrySlice(
  slices: O10BackpressureTelemetrySlice[],
  slice: O10BackpressureTelemetrySlice
): O10BackpressureTelemetrySlice[] {
  const next = [...slices, slice];
  if (next.length > 64) return next.slice(next.length - 64);
  return next;
}

export function buildBackpressureTelemetryDigest(
  slices: O10BackpressureTelemetrySlice[]
): O10BackpressureTelemetryDigest {
  let deferCount = 0;
  let executeCount = 0;
  let totalDropped = 0;
  let peakTier: O10IdleEscalationTier = 0;
  for (const s of slices) {
    if (s.decision === 'defer') deferCount += 1;
    if (s.decision === 'execute_now') executeCount += 1;
    totalDropped += s.droppedLowPriority;
    if (s.tier > peakTier) peakTier = s.tier;
  }
  const summaryLine = `bp telo slices=${slices.length} defer=${deferCount} exec=${executeCount} drop=${totalDropped} peak=t${peakTier}`;
  return {
    schema: '10m.agent20.backpressure-telemetry.v1',
    sliceCount: slices.length,
    deferCount,
    executeCount,
    totalDropped,
    peakTier,
    summaryLine,
  };
}

export function sliceFromBackpressureTurn(
  turn: number,
  day: number,
  policy: O10IntentBackpressurePolicy,
  decision: O10IntentScheduleDecision,
  droppedLowPriority: number
): O10BackpressureTelemetrySlice {
  return {
    turn,
    day,
    tier: policy.tier,
    effectiveMaxDepth: policy.effectiveMaxDepth,
    deferLowPriorityBelow: policy.deferLowPriorityBelow,
    decision: decision.action,
    droppedLowPriority,
  };
}

export function runO10Agent20BackpressureTelemetrySelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  let slices: O10BackpressureTelemetrySlice[] = [];
  slices = recordBackpressureTelemetrySlice(slices, {
    turn: 1,
    day: 1,
    tier: 2,
    effectiveMaxDepth: 6,
    deferLowPriorityBelow: 4,
    decision: 'defer',
    droppedLowPriority: 0,
  });
  slices = recordBackpressureTelemetrySlice(slices, {
    turn: 2,
    day: 1,
    tier: 0,
    effectiveMaxDepth: 8,
    deferLowPriorityBelow: 0,
    decision: 'execute_now',
    droppedLowPriority: 1,
  });
  const digest = buildBackpressureTelemetryDigest(slices);
  push(
    'bp_telo_digest',
    'digest aggregates defer/exec/drops',
    digest.deferCount === 1 && digest.executeCount === 1 && digest.totalDropped === 1 && digest.peakTier === 2
  );

  let ring: O10BackpressureTelemetrySlice[] = [];
  for (let i = 0; i < 70; i++) {
    ring = recordBackpressureTelemetrySlice(
      ring,
      sliceFromBackpressureTurn(
        i,
        1,
        { tier: 1, effectiveMaxDepth: 7, deferLowPriorityBelow: 2 },
        { action: 'defer', reason: 'x' },
        0
      )
    );
  }
  push('bp_telo_cap', 'ring retains last 64 slices', ring.length === 64);

  push(
    'bp_telo_schema',
    'schema marker present',
    digest.schema === '10m.agent20.backpressure-telemetry.v1' && digest.summaryLine.includes('peak=t2')
  );

  return results;
}
