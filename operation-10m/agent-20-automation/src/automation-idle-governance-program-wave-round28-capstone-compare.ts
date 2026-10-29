import type { O10IdleGovernanceProgramWaveRound28CapstoneResult } from './automation-idle-governance-program-wave-round28-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound28CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round28-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound28CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound28CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound28CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round28Export.payload.round28Ready !== candidate.round28Export.payload.round28Ready) {
    mismatches.push('round28_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) {
    mismatches.push('o10_task_id');
  }
  return mismatches;
}

/** Round-29 twin round-28 capstone compare (O10-189 ladder). */
export function compareIdleGovernanceProgramWaveRound28Capstones(
  baseline: O10IdleGovernanceProgramWaveRound28CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound28CapstoneResult
): O10IdleGovernanceProgramWaveRound28CapstoneCompareResult {
  const mismatches = compareRound28CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_round28_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round28-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound28CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveRound28CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round28-capstone.v1',
    o10TaskId: 'O10-187',
    waveRound: 28,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound27Capstone: {} as O10IdleGovernanceProgramWaveRound28CapstoneResult['primaryRound27Capstone'],
    twinRound27Capstone: {} as O10IdleGovernanceProgramWaveRound28CapstoneResult['twinRound27Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound28CapstoneResult['capstoneCompare'],
    round28Export: {
      payload: { round28Ready: true },
    } as O10IdleGovernanceProgramWaveRound28CapstoneResult['round28Export'],
  });

  const ok = compareIdleGovernanceProgramWaveRound28Capstones(twin(), twin());
  push('gov_prog_r28_cap_cmp_parity', 'identical round 28 capstones report parity', ok.parityOk === true);

  const bad = compareIdleGovernanceProgramWaveRound28Capstones(twin(), { ...twin(), capstoneReady: false });
  push(
    'gov_prog_r28_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('capstone_ready'))
  );

  push(
    'gov_prog_r28_cap_cmp_schema',
    'round28 capstone compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-round28-capstone-compare.v1'
  );

  return results;
}
