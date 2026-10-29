import type { O10IdleGovernanceProgramWaveRound33CapstoneResult } from './automation-idle-governance-program-wave-round33-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound33CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round33-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound33CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound33CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound33CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round33Export.payload.round33Ready !== candidate.round33Export.payload.round33Ready) {
    mismatches.push('round33_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-34 twin round-33 capstone compare (O10-199 ladder). */
export function compareIdleGovernanceProgramWaveRound33Capstones(
  baseline: O10IdleGovernanceProgramWaveRound33CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound33CapstoneResult
): O10IdleGovernanceProgramWaveRound33CapstoneCompareResult {
  const mismatches = compareRound33CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round33_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round33-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound33CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound33CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round33-capstone.v1',
    o10TaskId: 'O10-197',
    waveRound: 33,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound32Capstone: {} as O10IdleGovernanceProgramWaveRound33CapstoneResult['primaryRound32Capstone'],
    twinRound32Capstone: {} as O10IdleGovernanceProgramWaveRound33CapstoneResult['twinRound32Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound33CapstoneResult['capstoneCompare'],
    round33Export: { payload: { round33Ready: true } } as O10IdleGovernanceProgramWaveRound33CapstoneResult['round33Export'],
  });

  push('gov_prog_r33_cap_cmp_parity', 'identical round 33 capstones report parity', compareIdleGovernanceProgramWaveRound33Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r33_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound33Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r33_cap_cmp_schema',
    'round33 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound33Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round33-capstone-compare.v1'
  );
  return results;
}
