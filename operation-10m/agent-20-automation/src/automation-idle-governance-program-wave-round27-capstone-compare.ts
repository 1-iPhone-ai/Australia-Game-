import type { O10IdleGovernanceProgramWaveRound27CapstoneResult } from './automation-idle-governance-program-wave-round27-capstone.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveRound27CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round27-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound27CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound27CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound27CapstoneResult
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
  if (baseline.round27Export.payload.round27Ready !== candidate.round27Export.payload.round27Ready) {
    mismatches.push('round27_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) {
    mismatches.push('o10_task_id');
  }
  return mismatches;
}

/** Round-28 twin round-27 capstone compare (O10-187 ladder). */
export function compareIdleGovernanceProgramWaveRound27Capstones(
  baseline: O10IdleGovernanceProgramWaveRound27CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound27CapstoneResult
): O10IdleGovernanceProgramWaveRound27CapstoneCompareResult {
  const mismatches = compareRound27CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_round27_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round27-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound27CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveRound27CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round27-capstone.v1',
    o10TaskId: 'O10-185',
    waveRound: 27,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound26Capstone: {} as O10IdleGovernanceProgramWaveRound27CapstoneResult['primaryRound26Capstone'],
    twinRound26Capstone: {} as O10IdleGovernanceProgramWaveRound27CapstoneResult['twinRound26Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound27CapstoneResult['capstoneCompare'],
    round27Export: {
      payload: { round27Ready: true },
    } as O10IdleGovernanceProgramWaveRound27CapstoneResult['round27Export'],
  });

  const ok = compareIdleGovernanceProgramWaveRound27Capstones(twin(), twin());
  push('gov_prog_r27_cap_cmp_parity', 'identical round 27 capstones report parity', ok.parityOk === true);

  const bad = compareIdleGovernanceProgramWaveRound27Capstones(twin(), { ...twin(), capstoneReady: false });
  push(
    'gov_prog_r27_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('capstone_ready'))
  );

  push(
    'gov_prog_r27_cap_cmp_schema',
    'round27 capstone compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-round27-capstone-compare.v1'
  );

  return results;
}
