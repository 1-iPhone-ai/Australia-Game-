import type { O10IdleGovernanceProgramWaveRound44CapstoneResult } from './automation-idle-governance-program-wave-round44-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound44CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round44-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound44CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound44CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound44CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round44Export.payload.round44Ready !== candidate.round44Export.payload.round44Ready) {
    mismatches.push('round44_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-45 twin round-44 capstone compare (O10-221 ladder). */
export function compareIdleGovernanceProgramWaveRound44Capstones(
  baseline: O10IdleGovernanceProgramWaveRound44CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound44CapstoneResult
): O10IdleGovernanceProgramWaveRound44CapstoneCompareResult {
  const mismatches = compareRound44CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round44_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round44-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound44CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound44CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round44-capstone.v1',
    o10TaskId: 'O10-219',
    waveRound: 44,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound43Capstone: {} as O10IdleGovernanceProgramWaveRound44CapstoneResult['primaryRound43Capstone'],
    twinRound43Capstone: {} as O10IdleGovernanceProgramWaveRound44CapstoneResult['twinRound43Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound44CapstoneResult['capstoneCompare'],
    round44Export: { payload: { round44Ready: true } } as O10IdleGovernanceProgramWaveRound44CapstoneResult['round44Export'],
  });

  push('gov_prog_r44_cap_cmp_parity', 'identical round 44 capstones report parity', compareIdleGovernanceProgramWaveRound44Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r44_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound44Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r44_cap_cmp_schema',
    'round44 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound44Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round44-capstone-compare.v1'
  );
  return results;
}
