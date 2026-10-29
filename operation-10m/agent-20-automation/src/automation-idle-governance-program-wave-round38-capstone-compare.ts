import type { O10IdleGovernanceProgramWaveRound38CapstoneResult } from './automation-idle-governance-program-wave-round38-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound38CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round38-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound38CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound38CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound38CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round38Export.payload.round38Ready !== candidate.round38Export.payload.round38Ready) {
    mismatches.push('round38_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-39 twin round-38 capstone compare (O10-209 ladder). */
export function compareIdleGovernanceProgramWaveRound38Capstones(
  baseline: O10IdleGovernanceProgramWaveRound38CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound38CapstoneResult
): O10IdleGovernanceProgramWaveRound38CapstoneCompareResult {
  const mismatches = compareRound38CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round38_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round38-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound38CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound38CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round38-capstone.v1',
    o10TaskId: 'O10-207',
    waveRound: 38,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound37Capstone: {} as O10IdleGovernanceProgramWaveRound38CapstoneResult['primaryRound37Capstone'],
    twinRound37Capstone: {} as O10IdleGovernanceProgramWaveRound38CapstoneResult['twinRound37Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound38CapstoneResult['capstoneCompare'],
    round38Export: { payload: { round38Ready: true } } as O10IdleGovernanceProgramWaveRound38CapstoneResult['round38Export'],
  });

  push('gov_prog_r38_cap_cmp_parity', 'identical round 38 capstones report parity', compareIdleGovernanceProgramWaveRound38Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r38_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound38Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r38_cap_cmp_schema',
    'round38 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound38Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round38-capstone-compare.v1'
  );
  return results;
}
