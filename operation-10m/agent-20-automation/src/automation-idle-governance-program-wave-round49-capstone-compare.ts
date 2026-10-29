import type { O10IdleGovernanceProgramWaveRound49CapstoneResult } from './automation-idle-governance-program-wave-round49-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound49CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round49-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound49CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound49CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound49CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round49Export.payload.round49Ready !== candidate.round49Export.payload.round49Ready) {
    mismatches.push('round49_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-50 twin round-49 capstone compare (O10-231 ladder). */
export function compareIdleGovernanceProgramWaveRound49Capstones(
  baseline: O10IdleGovernanceProgramWaveRound49CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound49CapstoneResult
): O10IdleGovernanceProgramWaveRound49CapstoneCompareResult {
  const mismatches = compareRound49CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round49_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round49-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound49CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound49CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round49-capstone.v1',
    o10TaskId: 'O10-229',
    waveRound: 49,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound48Capstone: {} as O10IdleGovernanceProgramWaveRound49CapstoneResult['primaryRound48Capstone'],
    twinRound48Capstone: {} as O10IdleGovernanceProgramWaveRound49CapstoneResult['twinRound48Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound49CapstoneResult['capstoneCompare'],
    round49Export: { payload: { round49Ready: true } } as O10IdleGovernanceProgramWaveRound49CapstoneResult['round49Export'],
  });

  push(
    'gov_prog_r49_cap_cmp_parity',
    'identical round 49 capstones report parity',
    compareIdleGovernanceProgramWaveRound49Capstones(twin(), twin()).parityOk
  );
  push(
    'gov_prog_r49_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound49Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r49_cap_cmp_schema',
    'round49 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound49Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round49-capstone-compare.v1'
  );
  return results;
}
