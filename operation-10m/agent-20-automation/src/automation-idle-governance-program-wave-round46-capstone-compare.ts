import type { O10IdleGovernanceProgramWaveRound46CapstoneResult } from './automation-idle-governance-program-wave-round46-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound46CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round46-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound46CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound46CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound46CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round46Export.payload.round46Ready !== candidate.round46Export.payload.round46Ready) {
    mismatches.push('round46_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-47 twin round-46 capstone compare (O10-225 ladder). */
export function compareIdleGovernanceProgramWaveRound46Capstones(
  baseline: O10IdleGovernanceProgramWaveRound46CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound46CapstoneResult
): O10IdleGovernanceProgramWaveRound46CapstoneCompareResult {
  const mismatches = compareRound46CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round46_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round46-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound46CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound46CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round46-capstone.v1',
    o10TaskId: 'O10-223',
    waveRound: 46,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound45Capstone: {} as O10IdleGovernanceProgramWaveRound46CapstoneResult['primaryRound45Capstone'],
    twinRound45Capstone: {} as O10IdleGovernanceProgramWaveRound46CapstoneResult['twinRound45Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound46CapstoneResult['capstoneCompare'],
    round46Export: { payload: { round46Ready: true } } as O10IdleGovernanceProgramWaveRound46CapstoneResult['round46Export'],
  });

  push(
    'gov_prog_r46_cap_cmp_parity',
    'identical round 46 capstones report parity',
    compareIdleGovernanceProgramWaveRound46Capstones(twin(), twin()).parityOk
  );
  push(
    'gov_prog_r46_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound46Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r46_cap_cmp_schema',
    'round46 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound46Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round46-capstone-compare.v1'
  );
  return results;
}
