import type { O10IdleGovernanceProgramWaveEpochCloseoutResult } from './automation-idle-governance-program-wave-epoch-closeout.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveEpochCloseoutCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-epoch-closeout-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareEpochCloseoutFields(
  baseline: O10IdleGovernanceProgramWaveEpochCloseoutResult,
  candidate: O10IdleGovernanceProgramWaveEpochCloseoutResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.epochReady !== candidate.epochReady) {
    mismatches.push(`epoch_ready ${baseline.epochReady} vs ${candidate.epochReady}`);
  }
  if (baseline.sealCompare.parityOk !== candidate.sealCompare.parityOk) {
    mismatches.push('seal_compare_parity');
  }
  if (baseline.primarySeal.sealVerdict !== candidate.primarySeal.sealVerdict) {
    mismatches.push('primary_seal_verdict');
  }
  if (
    baseline.sealExport.payload.projectedLocHint !== candidate.sealExport.payload.projectedLocHint
  ) {
    mismatches.push('projected_loc_hint');
  }
  return mismatches;
}

/** Round-26 / wave-26 twin epoch closeout regression compare (O10-183). */
export function compareIdleGovernanceProgramWaveEpochCloseouts(
  baseline: O10IdleGovernanceProgramWaveEpochCloseoutResult,
  candidate: O10IdleGovernanceProgramWaveEpochCloseoutResult
): O10IdleGovernanceProgramWaveEpochCloseoutCompareResult {
  const mismatches = compareEpochCloseoutFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_epoch_closeout_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-epoch-closeout-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveEpochCloseoutCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveEpochCloseoutResult => ({
    schema: '10m.agent20.idle-governance-program-wave-epoch-closeout.v1',
    waveRound: 26,
    epochReady: true,
    epochCloseoutMarkdown: 'md',
    summaryLine: 'ep',
    primarySeal: { sealVerdict: 'sealed' } as O10IdleGovernanceProgramWaveEpochCloseoutResult['primarySeal'],
    twinSeal: {} as O10IdleGovernanceProgramWaveEpochCloseoutResult['twinSeal'],
    sealCompare: { parityOk: true } as O10IdleGovernanceProgramWaveEpochCloseoutResult['sealCompare'],
    sealExport: {
      payload: { projectedLocHint: 1_563_481 },
    } as O10IdleGovernanceProgramWaveEpochCloseoutResult['sealExport'],
  });

  const ok = compareIdleGovernanceProgramWaveEpochCloseouts(twin(), twin());
  push('gov_prog_epoch_cmp_parity', 'identical epoch closeouts report parity', ok.parityOk === true);

  const bad = compareIdleGovernanceProgramWaveEpochCloseouts(twin(), { ...twin(), epochReady: false });
  push(
    'gov_prog_epoch_cmp_ready',
    'epoch_ready drift surfaces mismatch',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('epoch_ready'))
  );

  push(
    'gov_prog_epoch_cmp_schema',
    'epoch closeout compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-epoch-closeout-compare.v1'
  );

  return results;
}
