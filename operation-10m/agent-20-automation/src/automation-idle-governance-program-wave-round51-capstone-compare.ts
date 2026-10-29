import type { O10IdleGovernanceProgramWaveRound51CapstoneResult } from './automation-idle-governance-program-wave-round51-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound51CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round51-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound51CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound51CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound51CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round51Export.payload.round51Ready !== candidate.round51Export.payload.round51Ready) {
    mismatches.push('round51_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-52 twin round-51 capstone compare (O10-235 ladder). */
export function compareIdleGovernanceProgramWaveRound51Capstones(
  baseline: O10IdleGovernanceProgramWaveRound51CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound51CapstoneResult
): O10IdleGovernanceProgramWaveRound51CapstoneCompareResult {
  const mismatches = compareRound51CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round51_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round51-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound51CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound51CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round51-capstone.v1',
    o10TaskId: 'O10-233',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound50Capstone: {} as O10IdleGovernanceProgramWaveRound51CapstoneResult['primaryRound50Capstone'],
    twinRound50Capstone: {} as O10IdleGovernanceProgramWaveRound51CapstoneResult['twinRound50Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound51CapstoneResult['capstoneCompare'],
    round51Export: { payload: { round51Ready: true } } as O10IdleGovernanceProgramWaveRound51CapstoneResult['round51Export'],
  });

  push(
    'gov_prog_r51_cap_cmp_parity',
    'identical round 51 capstones report parity',
    compareIdleGovernanceProgramWaveRound51Capstones(twin(), twin()).parityOk
  );
  push(
    'gov_prog_r51_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound51Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r51_cap_cmp_schema',
    'round50 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound51Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round51-capstone-compare.v1'
  );
  return results;
}
