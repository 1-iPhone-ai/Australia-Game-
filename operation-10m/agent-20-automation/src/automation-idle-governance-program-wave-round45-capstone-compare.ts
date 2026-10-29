import type { O10IdleGovernanceProgramWaveRound45CapstoneResult } from './automation-idle-governance-program-wave-round45-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound45CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round45-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound45CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound45CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound45CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round45Export.payload.round45Ready !== candidate.round45Export.payload.round45Ready) {
    mismatches.push('round45_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-46 twin round-45 capstone compare (O10-223 ladder). */
export function compareIdleGovernanceProgramWaveRound45Capstones(
  baseline: O10IdleGovernanceProgramWaveRound45CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound45CapstoneResult
): O10IdleGovernanceProgramWaveRound45CapstoneCompareResult {
  const mismatches = compareRound45CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round45_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round45-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound45CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound45CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round45-capstone.v1',
    o10TaskId: 'O10-221',
    waveRound: 45,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound44Capstone: {} as O10IdleGovernanceProgramWaveRound45CapstoneResult['primaryRound44Capstone'],
    twinRound44Capstone: {} as O10IdleGovernanceProgramWaveRound45CapstoneResult['twinRound44Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound45CapstoneResult['capstoneCompare'],
    round45Export: { payload: { round45Ready: true } } as O10IdleGovernanceProgramWaveRound45CapstoneResult['round45Export'],
  });

  push('gov_prog_r45_cap_cmp_parity', 'identical round 45 capstones report parity', compareIdleGovernanceProgramWaveRound45Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r45_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound45Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r45_cap_cmp_schema',
    'round45 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound45Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round45-capstone-compare.v1'
  );
  return results;
}
