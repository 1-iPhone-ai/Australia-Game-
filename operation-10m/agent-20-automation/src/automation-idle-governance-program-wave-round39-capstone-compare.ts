import type { O10IdleGovernanceProgramWaveRound39CapstoneResult } from './automation-idle-governance-program-wave-round39-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound39CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round39-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound39CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound39CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound39CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round39Export.payload.round39Ready !== candidate.round39Export.payload.round39Ready) {
    mismatches.push('round39_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-40 twin round-39 capstone compare (O10-211 ladder). */
export function compareIdleGovernanceProgramWaveRound39Capstones(
  baseline: O10IdleGovernanceProgramWaveRound39CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound39CapstoneResult
): O10IdleGovernanceProgramWaveRound39CapstoneCompareResult {
  const mismatches = compareRound39CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round39_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round39-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound39CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound39CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round39-capstone.v1',
    o10TaskId: 'O10-209',
    waveRound: 39,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound38Capstone: {} as O10IdleGovernanceProgramWaveRound39CapstoneResult['primaryRound38Capstone'],
    twinRound38Capstone: {} as O10IdleGovernanceProgramWaveRound39CapstoneResult['twinRound38Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound39CapstoneResult['capstoneCompare'],
    round39Export: { payload: { round39Ready: true } } as O10IdleGovernanceProgramWaveRound39CapstoneResult['round39Export'],
  });

  push('gov_prog_r39_cap_cmp_parity', 'identical round 39 capstones report parity', compareIdleGovernanceProgramWaveRound39Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r39_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound39Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r39_cap_cmp_schema',
    'round39 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound39Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round39-capstone-compare.v1'
  );
  return results;
}
