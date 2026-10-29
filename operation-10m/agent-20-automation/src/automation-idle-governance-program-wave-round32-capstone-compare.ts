import type { O10IdleGovernanceProgramWaveRound32CapstoneResult } from './automation-idle-governance-program-wave-round32-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound32CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round32-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound32CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound32CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound32CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round32Export.payload.round32Ready !== candidate.round32Export.payload.round32Ready) {
    mismatches.push('round32_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-33 twin round-32 capstone compare (O10-197 ladder). */
export function compareIdleGovernanceProgramWaveRound32Capstones(
  baseline: O10IdleGovernanceProgramWaveRound32CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound32CapstoneResult
): O10IdleGovernanceProgramWaveRound32CapstoneCompareResult {
  const mismatches = compareRound32CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round32_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round32-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound32CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound32CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round32-capstone.v1',
    o10TaskId: 'O10-195',
    waveRound: 32,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound31Capstone: {} as O10IdleGovernanceProgramWaveRound32CapstoneResult['primaryRound31Capstone'],
    twinRound31Capstone: {} as O10IdleGovernanceProgramWaveRound32CapstoneResult['twinRound31Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound32CapstoneResult['capstoneCompare'],
    round32Export: { payload: { round32Ready: true } } as O10IdleGovernanceProgramWaveRound32CapstoneResult['round32Export'],
  });

  push('gov_prog_r32_cap_cmp_parity', 'identical round 32 capstones report parity', compareIdleGovernanceProgramWaveRound32Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r32_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound32Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r32_cap_cmp_schema',
    'round32 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound32Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round32-capstone-compare.v1'
  );
  return results;
}
