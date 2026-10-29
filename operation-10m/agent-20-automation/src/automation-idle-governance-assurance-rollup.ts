import type { O10IdleGovernanceAssuranceJournal } from './automation-idle-governance-assurance-journal.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceAssuranceRollupResult {
  schema: '10m.agent20.idle-governance-assurance-rollup.v1';
  entryCount: number;
  validRatio: number;
  highUrgencyCount: number;
  dominantTrend: string;
  recommendation: string;
  summaryLine: string;
}

/** Roll up assurance journal entries for executive / replay dashboards. */
export function rollupIdleGovernanceAssuranceJournal(
  journal: O10IdleGovernanceAssuranceJournal
): O10IdleGovernanceAssuranceRollupResult {
  const entries = journal.entries;
  if (entries.length === 0) {
    return {
      schema: '10m.agent20.idle-governance-assurance-rollup.v1',
      entryCount: 0,
      validRatio: 0,
      highUrgencyCount: 0,
      dominantTrend: 'none',
      recommendation: 'run_initial_assurance_pass',
      summaryLine: 'gov_assurance_rollup entries=0',
    };
  }

  const validRatio = entries.filter(e => e.attestValid).length / entries.length;
  const highUrgencyCount = entries.filter(e => e.watchUrgency === 'high').length;

  const trendCounts = new Map<string, number>();
  for (const e of entries) {
    trendCounts.set(e.trendDirection, (trendCounts.get(e.trendDirection) ?? 0) + 1);
  }
  let dominantTrend = 'stable';
  let max = 0;
  for (const [trend, count] of trendCounts) {
    if (count > max) {
      max = count;
      dominantTrend = trend;
    }
  }

  let recommendation = 'continue_scheduled_watch';
  if (validRatio < 0.5 || highUrgencyCount >= Math.ceil(entries.length / 2)) {
    recommendation = 'escalate_to_human_takeover';
  } else if (dominantTrend === 'degrading') {
    recommendation = 'tighten_watch_cadence';
  } else if (validRatio >= 0.9 && dominantTrend === 'improving') {
    recommendation = 'relax_watch_cadence';
  }

  const summaryLine = [
    'gov_assurance_rollup',
    `entries=${entries.length}`,
    `valid_ratio=${validRatio.toFixed(2)}`,
    `high_urgency=${highUrgencyCount}`,
    `trend=${dominantTrend}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-assurance-rollup.v1',
    entryCount: entries.length,
    validRatio,
    highUrgencyCount,
    dominantTrend,
    recommendation,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceAssuranceRollupSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const empty = rollupIdleGovernanceAssuranceJournal({
    schema: '10m.agent20.idle-governance-assurance-journal.v1',
    entries: [],
  });
  push('gov_rollup_empty', 'empty journal recommends initial pass', empty.recommendation === 'run_initial_assurance_pass');

  const mk = (trend: string, urgency: string, valid: boolean, turn: number) => ({
    schema: '10m.agent20.idle-governance-assurance-journal-entry.v1' as const,
    turn,
    attestationFingerprint: `f${turn}`,
    reconcileStatus: 'aligned',
    trendDirection: trend,
    watchUrgency: urgency,
    attestValid: valid,
  });

  const healthy = rollupIdleGovernanceAssuranceJournal({
    schema: '10m.agent20.idle-governance-assurance-journal.v1',
    entries: [mk('improving', 'low', true, 1), mk('improving', 'low', true, 2)],
  });
  push('gov_rollup_relax', 'healthy journal may relax cadence', healthy.recommendation === 'relax_watch_cadence');

  const stressed = rollupIdleGovernanceAssuranceJournal({
    schema: '10m.agent20.idle-governance-assurance-journal.v1',
    entries: [mk('degrading', 'high', false, 1), mk('degrading', 'high', false, 2)],
  });
  push('gov_rollup_escalate', 'stressed journal escalates takeover', stressed.recommendation === 'escalate_to_human_takeover');

  push('gov_rollup_schema', 'rollup schema marker', stressed.schema === '10m.agent20.idle-governance-assurance-rollup.v1');

  return results;
}
