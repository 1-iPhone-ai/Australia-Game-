import type { O10IdleGovernanceProgramWaveRound42CapstoneResult } from './automation-idle-governance-program-wave-round42-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound42CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round42-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound42CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound42CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound42CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round42Export.payload.round42Ready !== candidate.round42Export.payload.round42Ready) {
    mismatches.push('round42_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-43 twin round-42 capstone compare (O10-217 ladder). */
export function compareIdleGovernanceProgramWaveRound42Capstones(
  baseline: O10IdleGovernanceProgramWaveRound42CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound42CapstoneResult
): O10IdleGovernanceProgramWaveRound42CapstoneCompareResult {
  const mismatches = compareRound42CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round42_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round42-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound42CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound42CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round42-capstone.v1',
    o10TaskId: 'O10-215',
    waveRound: 42,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound41Capstone: {} as O10IdleGovernanceProgramWaveRound42CapstoneResult['primaryRound41Capstone'],
    twinRound41Capstone: {} as O10IdleGovernanceProgramWaveRound42CapstoneResult['twinRound41Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound42CapstoneResult['capstoneCompare'],
    round42Export: { payload: { round42Ready: true } } as O10IdleGovernanceProgramWaveRound42CapstoneResult['round42Export'],
  });

  push('gov_prog_r42_cap_cmp_parity', 'identical round 42 capstones report parity', compareIdleGovernanceProgramWaveRound42Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r42_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound42Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r42_cap_cmp_schema',
    'round42 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound42Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round42-capstone-compare.v1'
  );
  return results;
}
