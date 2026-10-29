import type { O10IdleGovernanceProgramAttestation } from './automation-idle-governance-program-attestation.js';
import type { O10IdleGovernanceProgramRegistryRollupResult } from './automation-idle-governance-program-registry-rollup.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramComplianceScore {
  schema: '10m.agent20.idle-governance-program-compliance-score.v1';
  score: number;
  band: 'red' | 'amber' | 'green';
  factors: string[];
  summaryLine: string;
}

/** Compute 0–100 compliance score from registry rollup + latest attestation. */
export function scoreIdleGovernanceProgramCompliance(
  rollup: O10IdleGovernanceProgramRegistryRollupResult,
  latestAttestation: O10IdleGovernanceProgramAttestation | null
): O10IdleGovernanceProgramComplianceScore {
  const factors: string[] = [];
  let score = 50;

  if (rollup.entryCount === 0) {
    return {
      schema: '10m.agent20.idle-governance-program-compliance-score.v1',
      score: 40,
      band: 'amber',
      factors: ['no_registry_history'],
      summaryLine: 'gov_program_compliance score=40 band=amber',
    };
  }

  score += Math.round(rollup.attestOkRatio * 35);
  factors.push(`ok_ratio=${rollup.attestOkRatio.toFixed(2)}`);

  score -= rollup.escalationCount * 12;
  if (rollup.escalationCount > 0) factors.push(`escalations=${rollup.escalationCount}`);

  if (latestAttestation) {
    if (latestAttestation.ok) score += 10;
    else score -= 15;
    if (latestAttestation.replayDeterministic) score += 5;
    else {
      score -= 10;
      factors.push('replay_nondeterministic');
    }
    factors.push(`latest_attest_ok=${latestAttestation.ok}`);
  }

  score = Math.max(0, Math.min(100, score));

  let band: O10IdleGovernanceProgramComplianceScore['band'] = 'amber';
  if (score >= 75) band = 'green';
  else if (score < 45) band = 'red';

  return {
    schema: '10m.agent20.idle-governance-program-compliance-score.v1',
    score,
    band,
    factors,
    summaryLine: `gov_program_compliance score=${score} band=${band}`,
  };
}

export function runO10Agent20IdleGovernanceProgramComplianceScoreSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const emptyScore = scoreIdleGovernanceProgramCompliance(
    {
      schema: '10m.agent20.idle-governance-program-registry-rollup.v1',
      entryCount: 0,
      attestOkRatio: 0,
      escalationCount: 0,
      dominantRollup: 'none',
      recommendation: 'run_program_operations',
      summaryLine: 'empty',
    },
    null
  );
  push('gov_prog_score_empty', 'empty rollup yields amber baseline', emptyScore.band === 'amber' && emptyScore.score === 40);

  const healthyRollup = {
    schema: '10m.agent20.idle-governance-program-registry-rollup.v1' as const,
    entryCount: 3,
    attestOkRatio: 1,
    escalationCount: 0,
    dominantRollup: 'continue_scheduled_watch',
    recommendation: 'director_certify_program',
    summaryLine: 'ok',
  };
  const healthyScore = scoreIdleGovernanceProgramCompliance(healthyRollup, {
    schema: '10m.agent20.idle-governance-program-attestation.v1',
    replayFrameCount: 2,
    effectiveCycles: 2,
    replayDeterministic: true,
    charterPolicyLine: 'charter',
    rollupRecommendation: 'continue_scheduled_watch',
    digestChain: 'o10govprog_1',
    ok: true,
    notes: [],
  });
  push('gov_prog_score_green', 'healthy path reaches green band', healthyScore.band === 'green' && healthyScore.score >= 75);

  const badScore = scoreIdleGovernanceProgramCompliance(
    { ...healthyRollup, attestOkRatio: 0.2, escalationCount: 3 },
    {
      schema: '10m.agent20.idle-governance-program-attestation.v1',
      replayFrameCount: 1,
      effectiveCycles: 1,
      replayDeterministic: false,
      charterPolicyLine: 'charter',
      rollupRecommendation: 'escalate_to_human_takeover',
      digestChain: 'x',
      ok: false,
      notes: ['bad'],
    }
  );
  push('gov_prog_score_red', 'stress pulls score to red', badScore.band === 'red');

  push('gov_prog_score_schema', 'compliance score schema marker', badScore.schema === '10m.agent20.idle-governance-program-compliance-score.v1');

  return results;
}
