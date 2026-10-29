import type { O10IdleGovernanceProgramRegistry } from './automation-idle-governance-program-registry.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramRegistryRollupResult {
  schema: '10m.agent20.idle-governance-program-registry-rollup.v1';
  entryCount: number;
  attestOkRatio: number;
  escalationCount: number;
  dominantRollup: string;
  recommendation: string;
  summaryLine: string;
}

/** Roll up program registry history for director-level dashboards. */
export function rollupIdleGovernanceProgramRegistry(
  registry: O10IdleGovernanceProgramRegistry
): O10IdleGovernanceProgramRegistryRollupResult {
  const entries = registry.entries;
  if (entries.length === 0) {
    return {
      schema: '10m.agent20.idle-governance-program-registry-rollup.v1',
      entryCount: 0,
      attestOkRatio: 0,
      escalationCount: 0,
      dominantRollup: 'none',
      recommendation: 'run_program_operations',
      summaryLine: 'gov_program_registry_rollup entries=0',
    };
  }

  const attestOkRatio = entries.filter(e => e.attestOk).length / entries.length;
  const escalationCount = entries.filter(e => e.rollupRecommendation === 'escalate_to_human_takeover').length;

  const counts = new Map<string, number>();
  for (const e of entries) {
    counts.set(e.rollupRecommendation, (counts.get(e.rollupRecommendation) ?? 0) + 1);
  }
  let dominantRollup = 'continue_scheduled_watch';
  let max = 0;
  for (const [key, count] of counts) {
    if (count > max) {
      max = count;
      dominantRollup = key;
    }
  }

  let recommendation = 'maintain_program_cadence';
  if (escalationCount >= Math.ceil(entries.length / 2)) {
    recommendation = 'director_escalate_takeover';
  } else if (attestOkRatio < 0.6) {
    recommendation = 'director_audit_program_attestations';
  } else if (attestOkRatio >= 0.9 && escalationCount === 0) {
    recommendation = 'director_certify_program';
  }

  const summaryLine = [
    'gov_program_registry_rollup',
    `entries=${entries.length}`,
    `ok_ratio=${attestOkRatio.toFixed(2)}`,
    `escalations=${escalationCount}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-registry-rollup.v1',
    entryCount: entries.length,
    attestOkRatio,
    escalationCount,
    dominantRollup,
    recommendation,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramRegistryRollupSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const empty = rollupIdleGovernanceProgramRegistry({
    schema: '10m.agent20.idle-governance-program-registry.v1',
    entries: [],
  });
  push('gov_prog_reg_roll_empty', 'empty registry rollup', empty.recommendation === 'run_program_operations');

  const mk = (ok: boolean, rollup: string, turn: number) => ({
    schema: '10m.agent20.idle-governance-program-registry-entry.v1' as const,
    turn,
    digestChain: `c${turn}`,
    charterPolicyLine: 'charter',
    rollupRecommendation: rollup,
    attestOk: ok,
  });

  const healthy = rollupIdleGovernanceProgramRegistry({
    schema: '10m.agent20.idle-governance-program-registry.v1',
    entries: [mk(true, 'continue_scheduled_watch', 1), mk(true, 'relax_watch_cadence', 2)],
  });
  push('gov_prog_reg_roll_certify', 'healthy registry certifies', healthy.recommendation === 'director_certify_program');

  const bad = rollupIdleGovernanceProgramRegistry({
    schema: '10m.agent20.idle-governance-program-registry.v1',
    entries: [mk(false, 'escalate_to_human_takeover', 1), mk(false, 'escalate_to_human_takeover', 2)],
  });
  push('gov_prog_reg_roll_escalate', 'failed escalations trigger director takeover', bad.recommendation === 'director_escalate_takeover');

  push('gov_prog_reg_roll_schema', 'registry rollup schema marker', bad.schema === '10m.agent20.idle-governance-program-registry-rollup.v1');

  return results;
}
