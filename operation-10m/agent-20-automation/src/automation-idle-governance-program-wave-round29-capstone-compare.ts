import type { O10IdleGovernanceProgramWaveRound29CapstoneResult } from './automation-idle-governance-program-wave-round29-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound29CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round29-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound29CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound29CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound29CapstoneResult
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
  if (baseline.round29Export.payload.round29Ready !== candidate.round29Export.payload.round29Ready) {
    mismatches.push('round29_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) {
    mismatches.push('o10_task_id');
  }
  return mismatches;
}

/** Round-30 twin round-29 capstone compare (O10-191 ladder). */
export function compareIdleGovernanceProgramWaveRound29Capstones(
  baseline: O10IdleGovernanceProgramWaveRound29CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound29CapstoneResult
): O10IdleGovernanceProgramWaveRound29CapstoneCompareResult {
  const mismatches = compareRound29CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_round29_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round29-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound29CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveRound29CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round29-capstone.v1',
    o10TaskId: 'O10-189',
    waveRound: 29,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound28Capstone: {} as O10IdleGovernanceProgramWaveRound29CapstoneResult['primaryRound28Capstone'],
    twinRound28Capstone: {} as O10IdleGovernanceProgramWaveRound29CapstoneResult['twinRound28Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound29CapstoneResult['capstoneCompare'],
    round29Export: {
      payload: { round29Ready: true },
    } as O10IdleGovernanceProgramWaveRound29CapstoneResult['round29Export'],
  });

  const ok = compareIdleGovernanceProgramWaveRound29Capstones(twin(), twin());
  push('gov_prog_r29_cap_cmp_parity', 'identical round 29 capstones report parity', ok.parityOk === true);

  const bad = compareIdleGovernanceProgramWaveRound29Capstones(twin(), { ...twin(), capstoneReady: false });
  push(
    'gov_prog_r29_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('capstone_ready'))
  );

  push(
    'gov_prog_r29_cap_cmp_schema',
    'round29 capstone compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-round29-capstone-compare.v1'
  );

  return results;
}
