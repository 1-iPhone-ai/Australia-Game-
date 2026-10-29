import type { O10IdleGovernanceProgramWaveRound47CapstoneResult } from './automation-idle-governance-program-wave-round47-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound47CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round47-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound47CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound47CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound47CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round47Export.payload.round47Ready !== candidate.round47Export.payload.round47Ready) {
    mismatches.push('round47_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-48 twin round-47 capstone compare (O10-227 ladder). */
export function compareIdleGovernanceProgramWaveRound47Capstones(
  baseline: O10IdleGovernanceProgramWaveRound47CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound47CapstoneResult
): O10IdleGovernanceProgramWaveRound47CapstoneCompareResult {
  const mismatches = compareRound47CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round47_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round47-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound47CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound47CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round47-capstone.v1',
    o10TaskId: 'O10-225',
    waveRound: 47,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound46Capstone: {} as O10IdleGovernanceProgramWaveRound47CapstoneResult['primaryRound46Capstone'],
    twinRound46Capstone: {} as O10IdleGovernanceProgramWaveRound47CapstoneResult['twinRound46Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound47CapstoneResult['capstoneCompare'],
    round47Export: { payload: { round47Ready: true } } as O10IdleGovernanceProgramWaveRound47CapstoneResult['round47Export'],
  });

  push(
    'gov_prog_r47_cap_cmp_parity',
    'identical round 47 capstones report parity',
    compareIdleGovernanceProgramWaveRound47Capstones(twin(), twin()).parityOk
  );
  push(
    'gov_prog_r47_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound47Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r47_cap_cmp_schema',
    'round47 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound47Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round47-capstone-compare.v1'
  );
  return results;
}
