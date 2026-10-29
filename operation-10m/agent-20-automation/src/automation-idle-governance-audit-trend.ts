import type { O10IdleGovernanceAuditTrail } from './automation-idle-governance-audit-trail.js';
import type { O10SelfTestResult } from './types.js';

export type O10IdleGovernanceAuditTrendDirection = 'improving' | 'stable' | 'degrading' | 'insufficient';

export interface O10IdleGovernanceAuditTrendResult {
  schema: '10m.agent20.idle-governance-audit-trend.v1';
  direction: O10IdleGovernanceAuditTrendDirection;
  sampleSize: number;
  peakTierSlope: number;
  blockedEntryRatio: number;
  summaryLine: string;
}

const ALERT_RANK: Record<string, number> = { none: 0, warn: 1, critical: 2 };

function alertRank(level: string): number {
  return ALERT_RANK[level] ?? 1;
}

/** Summarize recent audit trail movement for co-pilot trend badges. */
export function analyzeIdleGovernanceAuditTrend(
  trail: O10IdleGovernanceAuditTrail,
  windowSize = 5
): O10IdleGovernanceAuditTrendResult {
  const entries = trail.entries.slice(-Math.max(1, windowSize));
  if (entries.length < 2) {
    return {
      schema: '10m.agent20.idle-governance-audit-trend.v1',
      direction: 'insufficient',
      sampleSize: entries.length,
      peakTierSlope: 0,
      blockedEntryRatio: 0,
      summaryLine: 'gov_audit_trend direction=insufficient sample=1',
    };
  }

  const first = entries[0];
  const last = entries[entries.length - 1];
  const peakTierSlope = last.peakTier - first.peakTier;
  const alertDelta = alertRank(last.alertLevel) - alertRank(first.alertLevel);
  const blockedEntryRatio =
    entries.filter(e => e.pendingHumanCommit && e.alertLevel !== 'none').length / entries.length;

  let direction: O10IdleGovernanceAuditTrendDirection = 'stable';
  if (alertDelta < 0 || peakTierSlope < 0) direction = 'improving';
  else if (alertDelta > 0 || peakTierSlope > 0 || blockedEntryRatio >= 0.6) direction = 'degrading';

  const summaryLine = [
    'gov_audit_trend',
    `direction=${direction}`,
    `slope_peak=${peakTierSlope}`,
    `blocked_ratio=${blockedEntryRatio.toFixed(2)}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-audit-trend.v1',
    direction,
    sampleSize: entries.length,
    peakTierSlope,
    blockedEntryRatio,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceAuditTrendSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mk = (
    turn: number,
    alert: string,
    peak: number,
    pending: boolean
  ) => ({
    schema: '10m.agent20.idle-governance-audit.v1' as const,
    turn,
    alertLevel: alert,
    peakTier: peak as 0 | 1 | 2 | 3,
    appliedStepCount: 1,
    pendingHumanCommit: pending,
    fingerprint: `${turn}-${alert}`,
  });

  const improving = analyzeIdleGovernanceAuditTrend({
    schema: '10m.agent20.idle-governance-audit-trail.v1',
    entries: [mk(1, 'critical', 3, true), mk(2, 'warn', 2, false), mk(3, 'none', 0, false)],
  });
  push('gov_trend_improving', 'peak and alert easing marks improving', improving.direction === 'improving');

  const degrading = analyzeIdleGovernanceAuditTrend({
    schema: '10m.agent20.idle-governance-audit-trail.v1',
    entries: [mk(1, 'none', 0, false), mk(2, 'warn', 2, true), mk(3, 'critical', 3, true)],
  });
  push('gov_trend_degrading', 'rising tier marks degrading', degrading.direction === 'degrading');

  const one = analyzeIdleGovernanceAuditTrend({
    schema: '10m.agent20.idle-governance-audit-trail.v1',
    entries: [mk(1, 'warn', 1, false)],
  });
  push('gov_trend_insufficient', 'single entry is insufficient', one.direction === 'insufficient');

  push(
    'gov_trend_schema',
    'audit trend schema marker',
    degrading.schema === '10m.agent20.idle-governance-audit-trend.v1' && degrading.summaryLine.includes('direction=degrading')
  );

  return results;
}
