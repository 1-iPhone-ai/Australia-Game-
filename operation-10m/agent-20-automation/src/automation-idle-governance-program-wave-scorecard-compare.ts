import type { O10IdleGovernanceProgramWaveScorecardResult } from './automation-idle-governance-program-wave-scorecard.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveScorecardCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-scorecard-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareScorecardFields(
  baseline: O10IdleGovernanceProgramWaveScorecardResult,
  candidate: O10IdleGovernanceProgramWaveScorecardResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.scorecardBand !== candidate.scorecardBand) {
    mismatches.push(`band ${baseline.scorecardBand} vs ${candidate.scorecardBand}`);
  }
  if (baseline.assemblyReady !== candidate.assemblyReady) {
    mismatches.push(`assembly_ready ${baseline.assemblyReady} vs ${candidate.assemblyReady}`);
  }
  if (baseline.waveRecommendation !== candidate.waveRecommendation) {
    mismatches.push(`rec ${baseline.waveRecommendation} vs ${candidate.waveRecommendation}`);
  }
  if (baseline.clearance !== candidate.clearance) {
    mismatches.push(`clearance ${baseline.clearance} vs ${candidate.clearance}`);
  }
  const scoreDelta = Math.abs(baseline.meanComplianceScore - candidate.meanComplianceScore);
  if (scoreDelta > 0.001) {
    mismatches.push(`mean_score_delta ${scoreDelta.toFixed(4)}`);
  }
  return mismatches;
}

/** Round-19 scorecard compare across twin assembly gate runs. */
export function compareIdleGovernanceProgramWaveScorecards(
  baseline: O10IdleGovernanceProgramWaveScorecardResult,
  candidate: O10IdleGovernanceProgramWaveScorecardResult
): O10IdleGovernanceProgramWaveScorecardCompareResult {
  const mismatches = compareScorecardFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_scorecard_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-scorecard-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveScorecardCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveScorecardResult => ({
    schema: '10m.agent20.idle-governance-program-wave-scorecard.v1',
    waveRound: 19,
    clearance: 'cleared',
    waveRecommendation: 'advance_scale_wave',
    meanComplianceScore: 81,
    scorecardBand: 'green',
    assemblyReady: true,
    scorecardMarkdown: 'md',
    summaryLine: 'sc',
  });

  const ok = compareIdleGovernanceProgramWaveScorecards(twin(), twin());
  push('gov_prog_sc_cmp_parity', 'identical scorecards report parity', ok.parityOk === true);

  const drift = compareIdleGovernanceProgramWaveScorecards(twin(), { ...twin(), assemblyReady: false });
  push(
    'gov_prog_sc_cmp_drift',
    'assembly readiness drift surfaces mismatch',
    drift.parityOk === false && drift.mismatches.some(m => m.startsWith('assembly_ready'))
  );

  push(
    'gov_prog_sc_cmp_schema',
    'scorecard compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-scorecard-compare.v1'
  );

  return results;
}
