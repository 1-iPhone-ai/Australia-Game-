import type { O10IdleGovernanceProgramWaveRound26CapstoneResult } from './automation-idle-governance-program-wave-round26-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound26CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round26-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareCapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound26CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound26CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.epochCompare.parityOk !== candidate.epochCompare.parityOk) {
    mismatches.push('epoch_compare_parity');
  }
  if (baseline.epochExport.payload.epochReady !== candidate.epochExport.payload.epochReady) {
    mismatches.push('epoch_export_ready');
  }
  return mismatches;
}

/** Round-27 twin round-26 capstone regression compare (O10-185 ladder). */
export function compareIdleGovernanceProgramWaveRound26Capstones(
  baseline: O10IdleGovernanceProgramWaveRound26CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound26CapstoneResult
): O10IdleGovernanceProgramWaveRound26CapstoneCompareResult {
  const mismatches = compareCapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_round26_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round26-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound26CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveRound26CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round26-capstone.v1',
    o10TaskId: 'O10-183',
    waveRound: 26,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryEpoch: {} as O10IdleGovernanceProgramWaveRound26CapstoneResult['primaryEpoch'],
    twinEpoch: {} as O10IdleGovernanceProgramWaveRound26CapstoneResult['twinEpoch'],
    epochCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound26CapstoneResult['epochCompare'],
    epochExport: {
      payload: { epochReady: true },
    } as O10IdleGovernanceProgramWaveRound26CapstoneResult['epochExport'],
  });

  const ok = compareIdleGovernanceProgramWaveRound26Capstones(twin(), twin());
  push('gov_prog_r26_cap_cmp_parity', 'identical capstones report parity', ok.parityOk === true);

  const bad = compareIdleGovernanceProgramWaveRound26Capstones(twin(), { ...twin(), capstoneReady: false });
  push(
    'gov_prog_r26_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('capstone_ready'))
  );

  push(
    'gov_prog_r26_cap_cmp_schema',
    'round26 capstone compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-round26-capstone-compare.v1'
  );

  return results;
}
