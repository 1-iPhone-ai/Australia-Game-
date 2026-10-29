import type { O10IdleGovernanceProgramWaveRound48CapstoneResult } from './automation-idle-governance-program-wave-round48-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound48CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round48-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound48CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound48CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound48CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round48Export.payload.round48Ready !== candidate.round48Export.payload.round48Ready) {
    mismatches.push('round48_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-49 twin round-48 capstone compare (O10-229 ladder). */
export function compareIdleGovernanceProgramWaveRound48Capstones(
  baseline: O10IdleGovernanceProgramWaveRound48CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound48CapstoneResult
): O10IdleGovernanceProgramWaveRound48CapstoneCompareResult {
  const mismatches = compareRound48CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round48_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round48-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound48CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound48CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round48-capstone.v1',
    o10TaskId: 'O10-227',
    waveRound: 48,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound47Capstone: {} as O10IdleGovernanceProgramWaveRound48CapstoneResult['primaryRound47Capstone'],
    twinRound47Capstone: {} as O10IdleGovernanceProgramWaveRound48CapstoneResult['twinRound47Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound48CapstoneResult['capstoneCompare'],
    round48Export: { payload: { round48Ready: true } } as O10IdleGovernanceProgramWaveRound48CapstoneResult['round48Export'],
  });

  push(
    'gov_prog_r48_cap_cmp_parity',
    'identical round 48 capstones report parity',
    compareIdleGovernanceProgramWaveRound48Capstones(twin(), twin()).parityOk
  );
  push(
    'gov_prog_r48_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound48Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r48_cap_cmp_schema',
    'round48 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound48Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round48-capstone-compare.v1'
  );
  return results;
}
