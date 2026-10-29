import type { O10IdleGovernanceProgramWaveRound43CapstoneResult } from './automation-idle-governance-program-wave-round43-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound43CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round43-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound43CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound43CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound43CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round43Export.payload.round43Ready !== candidate.round43Export.payload.round43Ready) {
    mismatches.push('round43_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-44 twin round-43 capstone compare (O10-219 ladder). */
export function compareIdleGovernanceProgramWaveRound43Capstones(
  baseline: O10IdleGovernanceProgramWaveRound43CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound43CapstoneResult
): O10IdleGovernanceProgramWaveRound43CapstoneCompareResult {
  const mismatches = compareRound43CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round43_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round43-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound43CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound43CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round43-capstone.v1',
    o10TaskId: 'O10-217',
    waveRound: 43,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound42Capstone: {} as O10IdleGovernanceProgramWaveRound43CapstoneResult['primaryRound42Capstone'],
    twinRound42Capstone: {} as O10IdleGovernanceProgramWaveRound43CapstoneResult['twinRound42Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound43CapstoneResult['capstoneCompare'],
    round43Export: { payload: { round43Ready: true } } as O10IdleGovernanceProgramWaveRound43CapstoneResult['round43Export'],
  });

  push('gov_prog_r43_cap_cmp_parity', 'identical round 43 capstones report parity', compareIdleGovernanceProgramWaveRound43Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r43_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound43Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r43_cap_cmp_schema',
    'round43 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound43Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round43-capstone-compare.v1'
  );
  return results;
}
