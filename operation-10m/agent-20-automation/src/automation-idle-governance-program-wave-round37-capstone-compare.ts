import type { O10IdleGovernanceProgramWaveRound37CapstoneResult } from './automation-idle-governance-program-wave-round37-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound37CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round37-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound37CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound37CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound37CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round37Export.payload.round37Ready !== candidate.round37Export.payload.round37Ready) {
    mismatches.push('round37_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-38 twin round-37 capstone compare (O10-207 ladder). */
export function compareIdleGovernanceProgramWaveRound37Capstones(
  baseline: O10IdleGovernanceProgramWaveRound37CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound37CapstoneResult
): O10IdleGovernanceProgramWaveRound37CapstoneCompareResult {
  const mismatches = compareRound37CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round37_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round37-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound37CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound37CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round37-capstone.v1',
    o10TaskId: 'O10-205',
    waveRound: 37,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound36Capstone: {} as O10IdleGovernanceProgramWaveRound37CapstoneResult['primaryRound36Capstone'],
    twinRound36Capstone: {} as O10IdleGovernanceProgramWaveRound37CapstoneResult['twinRound36Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound37CapstoneResult['capstoneCompare'],
    round37Export: { payload: { round37Ready: true } } as O10IdleGovernanceProgramWaveRound37CapstoneResult['round37Export'],
  });

  push('gov_prog_r37_cap_cmp_parity', 'identical round 37 capstones report parity', compareIdleGovernanceProgramWaveRound37Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r37_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound37Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r37_cap_cmp_schema',
    'round37 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound37Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round37-capstone-compare.v1'
  );
  return results;
}
