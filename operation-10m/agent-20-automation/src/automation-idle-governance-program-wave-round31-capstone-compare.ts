import type { O10IdleGovernanceProgramWaveRound31CapstoneResult } from './automation-idle-governance-program-wave-round31-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound31CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round31-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound31CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound31CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound31CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round31Export.payload.round31Ready !== candidate.round31Export.payload.round31Ready) {
    mismatches.push('round31_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-32 twin round-31 capstone compare (O10-195 ladder). */
export function compareIdleGovernanceProgramWaveRound31Capstones(
  baseline: O10IdleGovernanceProgramWaveRound31CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound31CapstoneResult
): O10IdleGovernanceProgramWaveRound31CapstoneCompareResult {
  const mismatches = compareRound31CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round31_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round31-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound31CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound31CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round31-capstone.v1',
    o10TaskId: 'O10-193',
    waveRound: 31,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound30Capstone: {} as O10IdleGovernanceProgramWaveRound31CapstoneResult['primaryRound30Capstone'],
    twinRound30Capstone: {} as O10IdleGovernanceProgramWaveRound31CapstoneResult['twinRound30Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound31CapstoneResult['capstoneCompare'],
    round31Export: { payload: { round31Ready: true } } as O10IdleGovernanceProgramWaveRound31CapstoneResult['round31Export'],
  });

  push('gov_prog_r31_cap_cmp_parity', 'identical round 31 capstones report parity', compareIdleGovernanceProgramWaveRound31Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r31_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound31Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r31_cap_cmp_schema',
    'round31 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound31Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round31-capstone-compare.v1'
  );
  return results;
}
