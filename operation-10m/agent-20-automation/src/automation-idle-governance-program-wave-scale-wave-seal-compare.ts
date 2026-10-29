import type { O10IdleGovernanceProgramWaveScaleWaveSealResult } from './automation-idle-governance-program-wave-scale-wave-seal.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveScaleWaveSealCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-scale-wave-seal-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareSealFields(
  baseline: O10IdleGovernanceProgramWaveScaleWaveSealResult,
  candidate: O10IdleGovernanceProgramWaveScaleWaveSealResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.sealVerdict !== candidate.sealVerdict) {
    mismatches.push(`seal_verdict ${baseline.sealVerdict} vs ${candidate.sealVerdict}`);
  }
  if (baseline.landingCompare.parityOk !== candidate.landingCompare.parityOk) {
    mismatches.push('landing_compare_parity');
  }
  if (baseline.primaryLanding.landingOpen !== candidate.primaryLanding.landingOpen) {
    mismatches.push('primary_landing_open');
  }
  if (baseline.landingBundle.payload.projectedLocHint !== candidate.landingBundle.payload.projectedLocHint) {
    mismatches.push('projected_loc_hint');
  }
  return mismatches;
}

/** Round-25 twin scale-wave seal regression compare. */
export function compareIdleGovernanceProgramWaveScaleWaveSeals(
  baseline: O10IdleGovernanceProgramWaveScaleWaveSealResult,
  candidate: O10IdleGovernanceProgramWaveScaleWaveSealResult
): O10IdleGovernanceProgramWaveScaleWaveSealCompareResult {
  const mismatches = compareSealFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_scale_wave_seal_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-scale-wave-seal-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveScaleWaveSealCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveScaleWaveSealResult => ({
    schema: '10m.agent20.idle-governance-program-wave-scale-wave-seal.v1',
    waveRound: 25,
    sealVerdict: 'sealed',
    sealMarkdown: 'md',
    summaryLine: 'seal',
    primaryLanding: { landingOpen: true } as O10IdleGovernanceProgramWaveScaleWaveSealResult['primaryLanding'],
    twinLanding: {} as O10IdleGovernanceProgramWaveScaleWaveSealResult['twinLanding'],
    landingCompare: { parityOk: true } as O10IdleGovernanceProgramWaveScaleWaveSealResult['landingCompare'],
    landingBundle: {
      payload: { projectedLocHint: 1_525_288 },
    } as O10IdleGovernanceProgramWaveScaleWaveSealResult['landingBundle'],
  });

  const ok = compareIdleGovernanceProgramWaveScaleWaveSeals(twin(), twin());
  push('gov_prog_seal_cmp_parity', 'identical seals report parity', ok.parityOk === true);

  const bad = compareIdleGovernanceProgramWaveScaleWaveSeals(twin(), {
    ...twin(),
    sealVerdict: 'hold',
  });
  push(
    'gov_prog_seal_cmp_verdict',
    'seal verdict drift surfaces mismatch',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('seal_verdict'))
  );

  push(
    'gov_prog_seal_cmp_schema',
    'scale-wave seal compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-scale-wave-seal-compare.v1'
  );

  return results;
}
