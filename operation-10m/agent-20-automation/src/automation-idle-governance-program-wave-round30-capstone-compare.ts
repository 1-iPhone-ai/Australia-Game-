import type { O10IdleGovernanceProgramWaveRound30CapstoneResult } from './automation-idle-governance-program-wave-round30-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound30CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round30-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound30CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound30CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound30CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round30Export.payload.round30Ready !== candidate.round30Export.payload.round30Ready) {
    mismatches.push('round30_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-31 twin round-30 capstone compare (O10-193 ladder). */
export function compareIdleGovernanceProgramWaveRound30Capstones(
  baseline: O10IdleGovernanceProgramWaveRound30CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound30CapstoneResult
): O10IdleGovernanceProgramWaveRound30CapstoneCompareResult {
  const mismatches = compareRound30CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round30_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round30-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound30CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound30CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round30-capstone.v1',
    o10TaskId: 'O10-191',
    waveRound: 30,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound29Capstone: {} as O10IdleGovernanceProgramWaveRound30CapstoneResult['primaryRound29Capstone'],
    twinRound29Capstone: {} as O10IdleGovernanceProgramWaveRound30CapstoneResult['twinRound29Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound30CapstoneResult['capstoneCompare'],
    round30Export: { payload: { round30Ready: true } } as O10IdleGovernanceProgramWaveRound30CapstoneResult['round30Export'],
  });

  push('gov_prog_r30_cap_cmp_parity', 'identical round 30 capstones report parity', compareIdleGovernanceProgramWaveRound30Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r30_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound30Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r30_cap_cmp_schema',
    'round30 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound30Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round30-capstone-compare.v1'
  );
  return results;
}
