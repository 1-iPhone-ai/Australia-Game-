import type { O10IdleGovernanceProgramWaveRound34CapstoneResult } from './automation-idle-governance-program-wave-round34-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound34CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round34-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound34CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound34CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound34CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round34Export.payload.round34Ready !== candidate.round34Export.payload.round34Ready) {
    mismatches.push('round34_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-35 twin round-34 capstone compare (O10-201 ladder). */
export function compareIdleGovernanceProgramWaveRound34Capstones(
  baseline: O10IdleGovernanceProgramWaveRound34CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound34CapstoneResult
): O10IdleGovernanceProgramWaveRound34CapstoneCompareResult {
  const mismatches = compareRound34CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round34_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round34-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound34CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound34CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round34-capstone.v1',
    o10TaskId: 'O10-199',
    waveRound: 34,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound33Capstone: {} as O10IdleGovernanceProgramWaveRound34CapstoneResult['primaryRound33Capstone'],
    twinRound33Capstone: {} as O10IdleGovernanceProgramWaveRound34CapstoneResult['twinRound33Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound34CapstoneResult['capstoneCompare'],
    round34Export: { payload: { round34Ready: true } } as O10IdleGovernanceProgramWaveRound34CapstoneResult['round34Export'],
  });

  push('gov_prog_r34_cap_cmp_parity', 'identical round 34 capstones report parity', compareIdleGovernanceProgramWaveRound34Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r34_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound34Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r34_cap_cmp_schema',
    'round34 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound34Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round34-capstone-compare.v1'
  );
  return results;
}
