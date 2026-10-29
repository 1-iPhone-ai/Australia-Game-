import type { O10IdleGovernanceProgramWaveRound41CapstoneResult } from './automation-idle-governance-program-wave-round41-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound41CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round41-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound41CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound41CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound41CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round41Export.payload.round41Ready !== candidate.round41Export.payload.round41Ready) {
    mismatches.push('round41_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-42 twin round-41 capstone compare (O10-215 ladder). */
export function compareIdleGovernanceProgramWaveRound41Capstones(
  baseline: O10IdleGovernanceProgramWaveRound41CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound41CapstoneResult
): O10IdleGovernanceProgramWaveRound41CapstoneCompareResult {
  const mismatches = compareRound41CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round41_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round41-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound41CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound41CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round41-capstone.v1',
    o10TaskId: 'O10-213',
    waveRound: 41,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound40Capstone: {} as O10IdleGovernanceProgramWaveRound41CapstoneResult['primaryRound40Capstone'],
    twinRound40Capstone: {} as O10IdleGovernanceProgramWaveRound41CapstoneResult['twinRound40Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound41CapstoneResult['capstoneCompare'],
    round41Export: { payload: { round41Ready: true } } as O10IdleGovernanceProgramWaveRound41CapstoneResult['round41Export'],
  });

  push('gov_prog_r41_cap_cmp_parity', 'identical round 41 capstones report parity', compareIdleGovernanceProgramWaveRound41Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r41_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound41Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r41_cap_cmp_schema',
    'round41 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound41Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round41-capstone-compare.v1'
  );
  return results;
}
