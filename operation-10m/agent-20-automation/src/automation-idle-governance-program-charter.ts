import type { O10IdleGovernanceAssuranceRollupResult } from './automation-idle-governance-assurance-rollup.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramCharter {
  schema: '10m.agent20.idle-governance-program-charter.v1';
  maxAutonomyTier: number;
  maxSustainedCycles: number;
  requireHumanCommit: boolean;
  stewardModeCap: 'autonomous_idle' | 'recommend' | 'watch_only';
  policyLine: string;
}

/** Translate assurance rollup into enforceable program charter caps. */
export function deriveIdleGovernanceProgramCharter(
  rollup: O10IdleGovernanceAssuranceRollupResult
): O10IdleGovernanceProgramCharter {
  switch (rollup.recommendation) {
    case 'escalate_to_human_takeover':
      return {
        schema: '10m.agent20.idle-governance-program-charter.v1',
        maxAutonomyTier: 0,
        maxSustainedCycles: 1,
        requireHumanCommit: true,
        stewardModeCap: 'watch_only',
        policyLine: 'charter hard_pause human_commit_required',
      };
    case 'tighten_watch_cadence':
      return {
        schema: '10m.agent20.idle-governance-program-charter.v1',
        maxAutonomyTier: 1,
        maxSustainedCycles: 3,
        requireHumanCommit: rollup.highUrgencyCount > 0,
        stewardModeCap: 'recommend',
        policyLine: 'charter tighten_watch recommend_cap',
      };
    case 'relax_watch_cadence':
      return {
        schema: '10m.agent20.idle-governance-program-charter.v1',
        maxAutonomyTier: 2,
        maxSustainedCycles: 8,
        requireHumanCommit: false,
        stewardModeCap: 'autonomous_idle',
        policyLine: 'charter relax_watch autonomous_cap',
      };
    case 'run_initial_assurance_pass':
      return {
        schema: '10m.agent20.idle-governance-program-charter.v1',
        maxAutonomyTier: 1,
        maxSustainedCycles: 2,
        requireHumanCommit: false,
        stewardModeCap: 'recommend',
        policyLine: 'charter bootstrap_assurance',
      };
    default:
      return {
        schema: '10m.agent20.idle-governance-program-charter.v1',
        maxAutonomyTier: 2,
        maxSustainedCycles: 5,
        requireHumanCommit: false,
        stewardModeCap: 'autonomous_idle',
        policyLine: 'charter continue_scheduled_watch',
      };
  }
}

export function charterPermitsSustainedWatchCycles(
  charter: O10IdleGovernanceProgramCharter,
  requestedCycles: number
): { permitted: boolean; effectiveCycles: number; reason: string } {
  const effective = Math.min(requestedCycles, charter.maxSustainedCycles);
  if (requestedCycles > charter.maxSustainedCycles) {
    return {
      permitted: effective > 0,
      effectiveCycles: effective,
      reason: 'charter_cycle_cap',
    };
  }
  return { permitted: true, effectiveCycles: effective, reason: 'charter_ok' };
}

export function runO10Agent20IdleGovernanceProgramCharterSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const escalate = deriveIdleGovernanceProgramCharter({
    schema: '10m.agent20.idle-governance-assurance-rollup.v1',
    entryCount: 2,
    validRatio: 0,
    highUrgencyCount: 2,
    dominantTrend: 'degrading',
    recommendation: 'escalate_to_human_takeover',
    summaryLine: 'bad',
  });
  push('gov_charter_escalate', 'escalate caps watch_only and human commit', escalate.stewardModeCap === 'watch_only' && escalate.requireHumanCommit);

  const relax = deriveIdleGovernanceProgramCharter({
    schema: '10m.agent20.idle-governance-assurance-rollup.v1',
    entryCount: 3,
    validRatio: 1,
    highUrgencyCount: 0,
    dominantTrend: 'improving',
    recommendation: 'relax_watch_cadence',
    summaryLine: 'good',
  });
  const permit = charterPermitsSustainedWatchCycles(relax, 10);
  push('gov_charter_cap', 'relax charter caps sustained cycles', permit.effectiveCycles === 8 && permit.reason === 'charter_cycle_cap');

  push('gov_charter_schema', 'charter schema marker', relax.schema === '10m.agent20.idle-governance-program-charter.v1');

  push('gov_charter_bootstrap', 'initial pass uses bootstrap policy', deriveIdleGovernanceProgramCharter({
    schema: '10m.agent20.idle-governance-assurance-rollup.v1',
    entryCount: 0,
    validRatio: 0,
    highUrgencyCount: 0,
    dominantTrend: 'none',
    recommendation: 'run_initial_assurance_pass',
    summaryLine: 'empty',
  }).policyLine.includes('bootstrap'));

  return results;
}
