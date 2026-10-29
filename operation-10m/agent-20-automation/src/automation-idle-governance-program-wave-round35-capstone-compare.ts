import type { O10IdleGovernanceProgramWaveRound35CapstoneResult } from './automation-idle-governance-program-wave-round35-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound35CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round35-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound35CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound35CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound35CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round35Export.payload.round35Ready !== candidate.round35Export.payload.round35Ready) {
    mismatches.push('round35_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-36 twin round-35 capstone compare (O10-203 ladder). */
export function compareIdleGovernanceProgramWaveRound35Capstones(
  baseline: O10IdleGovernanceProgramWaveRound35CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound35CapstoneResult
): O10IdleGovernanceProgramWaveRound35CapstoneCompareResult {
  const mismatches = compareRound35CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round35_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round35-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound35CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound35CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round35-capstone.v1',
    o10TaskId: 'O10-201',
    waveRound: 35,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound34Capstone: {} as O10IdleGovernanceProgramWaveRound35CapstoneResult['primaryRound34Capstone'],
    twinRound34Capstone: {} as O10IdleGovernanceProgramWaveRound35CapstoneResult['twinRound34Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound35CapstoneResult['capstoneCompare'],
    round35Export: { payload: { round35Ready: true } } as O10IdleGovernanceProgramWaveRound35CapstoneResult['round35Export'],
  });

  push('gov_prog_r35_cap_cmp_parity', 'identical round 35 capstones report parity', compareIdleGovernanceProgramWaveRound35Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r35_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound35Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r35_cap_cmp_schema',
    'round35 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound35Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round35-capstone-compare.v1'
  );
  return results;
}
