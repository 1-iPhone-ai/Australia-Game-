import type { O10IdleGovernanceProgramWaveRound50CapstoneResult } from './automation-idle-governance-program-wave-round50-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound50CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round50-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound50CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound50CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound50CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round50Export.payload.round50Ready !== candidate.round50Export.payload.round50Ready) {
    mismatches.push('round50_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-51 twin round-50 capstone compare (O10-233 ladder). */
export function compareIdleGovernanceProgramWaveRound50Capstones(
  baseline: O10IdleGovernanceProgramWaveRound50CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound50CapstoneResult
): O10IdleGovernanceProgramWaveRound50CapstoneCompareResult {
  const mismatches = compareRound50CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round50_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round50-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound50CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound50CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round50-capstone.v1',
    o10TaskId: 'O10-231',
    waveRound: 50,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound49Capstone: {} as O10IdleGovernanceProgramWaveRound50CapstoneResult['primaryRound49Capstone'],
    twinRound49Capstone: {} as O10IdleGovernanceProgramWaveRound50CapstoneResult['twinRound49Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound50CapstoneResult['capstoneCompare'],
    round50Export: { payload: { round50Ready: true } } as O10IdleGovernanceProgramWaveRound50CapstoneResult['round50Export'],
  });

  push(
    'gov_prog_r50_cap_cmp_parity',
    'identical round 50 capstones report parity',
    compareIdleGovernanceProgramWaveRound50Capstones(twin(), twin()).parityOk
  );
  push(
    'gov_prog_r50_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound50Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r50_cap_cmp_schema',
    'round50 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound50Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round50-capstone-compare.v1'
  );
  return results;
}
