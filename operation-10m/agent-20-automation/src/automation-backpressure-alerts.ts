import {
  buildBackpressureTelemetryDigest,
  type O10BackpressureTelemetryDigest,
  type O10BackpressureTelemetrySlice,
} from './automation-backpressure-telemetry.js';
import type { O10IdleEscalationTier } from './automation-idle-escalation.js';
import type { O10SelfTestResult } from './types.js';

export type O10BackpressureAlertLevel = 'none' | 'warn' | 'critical';

export interface O10BackpressureAlertThresholds {
  warnDeferRatio: number;
  criticalDeferRatio: number;
  warnTotalDropped: number;
  criticalTotalDropped: number;
  criticalPeakTier: O10IdleEscalationTier;
}

export const DEFAULT_BACKPRESSURE_ALERT_THRESHOLDS: O10BackpressureAlertThresholds = {
  warnDeferRatio: 0.45,
  criticalDeferRatio: 0.8,
  warnTotalDropped: 2,
  criticalTotalDropped: 6,
  criticalPeakTier: 3,
};

export interface O10BackpressureAlert {
  schema: '10m.agent20.backpressure-alert.v1';
  level: O10BackpressureAlertLevel;
  deferRatio: number;
  reasons: string[];
  digest: O10BackpressureTelemetryDigest;
}

function deferRatio(digest: O10BackpressureTelemetryDigest): number {
  if (digest.sliceCount <= 0) return 0;
  return digest.deferCount / digest.sliceCount;
}

/** Classify backpressure telemetry digest into none / warn / critical alert levels. */
export function evaluateBackpressureAlerts(
  digest: O10BackpressureTelemetryDigest,
  thresholds: O10BackpressureAlertThresholds = DEFAULT_BACKPRESSURE_ALERT_THRESHOLDS
): O10BackpressureAlert {
  const ratio = deferRatio(digest);
  const reasons: string[] = [];
  let level: O10BackpressureAlertLevel = 'none';

  const critical =
    digest.peakTier >= thresholds.criticalPeakTier ||
    ratio >= thresholds.criticalDeferRatio ||
    digest.totalDropped >= thresholds.criticalTotalDropped;

  if (critical) {
    level = 'critical';
    if (digest.peakTier >= thresholds.criticalPeakTier) reasons.push('peak_tier');
    if (ratio >= thresholds.criticalDeferRatio) reasons.push('defer_ratio');
    if (digest.totalDropped >= thresholds.criticalTotalDropped) reasons.push('drops');
  } else {
    const warn =
      ratio >= thresholds.warnDeferRatio ||
      digest.totalDropped >= thresholds.warnTotalDropped ||
      digest.peakTier >= 2;
    if (warn) {
      level = 'warn';
      if (ratio >= thresholds.warnDeferRatio) reasons.push('defer_ratio');
      if (digest.totalDropped >= thresholds.warnTotalDropped) reasons.push('drops');
      if (digest.peakTier >= 2) reasons.push('elevated_tier');
    }
  }

  return {
    schema: '10m.agent20.backpressure-alert.v1',
    level,
    deferRatio: ratio,
    reasons,
    digest,
  };
}

export function evaluateBackpressureAlertsFromSlices(
  slices: O10BackpressureTelemetrySlice[],
  thresholds?: O10BackpressureAlertThresholds
): O10BackpressureAlert {
  return evaluateBackpressureAlerts(buildBackpressureTelemetryDigest(slices), thresholds);
}

export function formatBackpressureAlertLine(alert: O10BackpressureAlert): string {
  const r = alert.reasons.length ? alert.reasons.join(',') : 'ok';
  return `bp_alert level=${alert.level} defer=${alert.deferRatio.toFixed(2)} reasons=${r}`;
}

export function runO10Agent20BackpressureAlertsSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const calm = evaluateBackpressureAlerts(
    buildBackpressureTelemetryDigest([
      {
        turn: 1,
        day: 1,
        tier: 0,
        effectiveMaxDepth: 8,
        deferLowPriorityBelow: 0,
        decision: 'execute_now',
        droppedLowPriority: 0,
      },
    ])
  );
  push('bp_alert_calm', 'healthy telemetry is none', calm.level === 'none');

  const warn = evaluateBackpressureAlerts(
    buildBackpressureTelemetryDigest([
      {
        turn: 1,
        day: 1,
        tier: 2,
        effectiveMaxDepth: 6,
        deferLowPriorityBelow: 4,
        decision: 'defer',
        droppedLowPriority: 0,
      },
      {
        turn: 2,
        day: 1,
        tier: 2,
        effectiveMaxDepth: 6,
        deferLowPriorityBelow: 4,
        decision: 'execute_now',
        droppedLowPriority: 0,
      },
    ])
  );
  push('bp_alert_warn', 'elevated tier triggers warn', warn.level === 'warn' && warn.reasons.includes('elevated_tier'));

  const critical = evaluateBackpressureAlerts(
    buildBackpressureTelemetryDigest([
      {
        turn: 1,
        day: 1,
        tier: 3,
        effectiveMaxDepth: 5,
        deferLowPriorityBelow: 4,
        decision: 'defer',
        droppedLowPriority: 3,
      },
      {
        turn: 2,
        day: 1,
        tier: 3,
        effectiveMaxDepth: 5,
        deferLowPriorityBelow: 4,
        decision: 'defer',
        droppedLowPriority: 4,
      },
    ])
  );
  push(
    'bp_alert_critical',
    'peak tier and drops escalate to critical',
    critical.level === 'critical' && critical.reasons.includes('peak_tier')
  );

  push(
    'bp_alert_line',
    'alert line formatter includes level',
    formatBackpressureAlertLine(critical).includes('level=critical')
  );

  return results;
}
