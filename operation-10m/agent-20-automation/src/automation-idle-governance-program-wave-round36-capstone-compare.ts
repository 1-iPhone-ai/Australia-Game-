import type { O10IdleGovernanceProgramWaveRound36CapstoneResult } from './automation-idle-governance-program-wave-round36-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound36CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round36-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound36CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound36CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound36CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round36Export.payload.round36Ready !== candidate.round36Export.payload.round36Ready) {
    mismatches.push('round36_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-37 twin round-36 capstone compare (O10-205 ladder). */
export function compareIdleGovernanceProgramWaveRound36Capstones(
  baseline: O10IdleGovernanceProgramWaveRound36CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound36CapstoneResult
): O10IdleGovernanceProgramWaveRound36CapstoneCompareResult {
  const mismatches = compareRound36CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round36_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round36-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound36CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound36CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round36-capstone.v1',
    o10TaskId: 'O10-203',
    waveRound: 36,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound35Capstone: {} as O10IdleGovernanceProgramWaveRound36CapstoneResult['primaryRound35Capstone'],
    twinRound35Capstone: {} as O10IdleGovernanceProgramWaveRound36CapstoneResult['twinRound35Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound36CapstoneResult['capstoneCompare'],
    round36Export: { payload: { round36Ready: true } } as O10IdleGovernanceProgramWaveRound36CapstoneResult['round36Export'],
  });

  push('gov_prog_r36_cap_cmp_parity', 'identical round 36 capstones report parity', compareIdleGovernanceProgramWaveRound36Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r36_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound36Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r36_cap_cmp_schema',
    'round36 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound36Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round36-capstone-compare.v1'
  );
  return results;
}
