import type { O10IdleGovernanceProgramWaveRound40CapstoneResult } from './automation-idle-governance-program-wave-round40-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound40CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round40-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound40CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound40CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound40CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round40Export.payload.round40Ready !== candidate.round40Export.payload.round40Ready) {
    mismatches.push('round40_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-41 twin round-40 capstone compare (O10-213 ladder). */
export function compareIdleGovernanceProgramWaveRound40Capstones(
  baseline: O10IdleGovernanceProgramWaveRound40CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound40CapstoneResult
): O10IdleGovernanceProgramWaveRound40CapstoneCompareResult {
  const mismatches = compareRound40CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round40_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round40-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound40CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound40CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round40-capstone.v1',
    o10TaskId: 'O10-211',
    waveRound: 40,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound39Capstone: {} as O10IdleGovernanceProgramWaveRound40CapstoneResult['primaryRound39Capstone'],
    twinRound39Capstone: {} as O10IdleGovernanceProgramWaveRound40CapstoneResult['twinRound39Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound40CapstoneResult['capstoneCompare'],
    round40Export: { payload: { round40Ready: true } } as O10IdleGovernanceProgramWaveRound40CapstoneResult['round40Export'],
  });

  push('gov_prog_r40_cap_cmp_parity', 'identical round 40 capstones report parity', compareIdleGovernanceProgramWaveRound40Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r40_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound40Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r40_cap_cmp_schema',
    'round40 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound40Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round40-capstone-compare.v1'
  );
  return results;
}
