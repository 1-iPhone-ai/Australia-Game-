import type { O10IdleGovernanceProgramWaveCloseoutResult } from './automation-idle-governance-program-wave-closeout.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveCloseoutCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-closeout-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareCloseoutFields(
  baseline: O10IdleGovernanceProgramWaveCloseoutResult,
  candidate: O10IdleGovernanceProgramWaveCloseoutResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.subject.clearance !== candidate.subject.clearance) {
    mismatches.push(
      `clearance ${baseline.subject.clearance} vs ${candidate.subject.clearance}`
    );
  }
  if (baseline.scaleWaveRollup.waveRecommendation !== candidate.scaleWaveRollup.waveRecommendation) {
    mismatches.push(
      `rec ${baseline.scaleWaveRollup.waveRecommendation} vs ${candidate.scaleWaveRollup.waveRecommendation}`
    );
  }
  const scoreDelta = Math.abs(
    baseline.scaleWaveRollup.meanComplianceScore - candidate.scaleWaveRollup.meanComplianceScore
  );
  if (scoreDelta > 0.001) {
    mismatches.push(`mean_score_delta ${scoreDelta.toFixed(4)}`);
  }
  if (baseline.scaleWaveRollup.subjectPassCount !== candidate.scaleWaveRollup.subjectPassCount) {
    mismatches.push('subject_pass_count');
  }
  return mismatches;
}

/** Round-18 twin closeout regression compare for deterministic wave exports. */
export function compareIdleGovernanceProgramWaveCloseouts(
  baseline: O10IdleGovernanceProgramWaveCloseoutResult,
  candidate: O10IdleGovernanceProgramWaveCloseoutResult
): O10IdleGovernanceProgramWaveCloseoutCompareResult {
  const mismatches = compareCloseoutFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_closeout_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-closeout-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveCloseoutCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveCloseoutResult => ({
    schema: '10m.agent20.idle-governance-program-wave-closeout.v1',
    waveRound: 18,
    closeoutMarkdown: 'md',
    summaryLine: 'sum',
    subject: {
      schema: '10m.agent20.idle-governance-program-subject-pass.v1',
      clearance: 'cleared',
      subjectMarkdown: 's',
      summaryLine: 's',
      executive: {} as O10IdleGovernanceProgramWaveCloseoutResult['subject']['executive'],
    },
    scaleWaveRollup: {
      schema: '10m.agent20.idle-governance-program-scale-wave-rollup.v1',
      waveRound: 18,
      subjectPassCount: 1,
      clearedCount: 1,
      conditionalCount: 0,
      blockedCount: 0,
      meanComplianceScore: 84.5,
      waveRecommendation: 'advance_scale_wave',
      summaryLine: 'r',
    },
  });

  const a = twin();
  const b = twin();
  const ok = compareIdleGovernanceProgramWaveCloseouts(a, b);
  push('gov_prog_closeout_cmp_parity', 'identical closeouts report parity', ok.parityOk === true);

  const c = { ...twin(), subject: { ...twin().subject, clearance: 'blocked' as const } };
  const bad = compareIdleGovernanceProgramWaveCloseouts(a, c);
  push(
    'gov_prog_closeout_cmp_mismatch',
    'clearance drift surfaces mismatches',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('clearance'))
  );

  push(
    'gov_prog_closeout_cmp_schema',
    'closeout compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-closeout-compare.v1'
  );

  return results;
}
