import type { O10IdleGovernanceProgramWaveLandingGateResult } from './automation-idle-governance-program-wave-landing-gate.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveLandingGateCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-landing-gate-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareLandingGateFields(
  baseline: O10IdleGovernanceProgramWaveLandingGateResult,
  candidate: O10IdleGovernanceProgramWaveLandingGateResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.landingOpen !== candidate.landingOpen) {
    mismatches.push(`landing_open ${baseline.landingOpen} vs ${candidate.landingOpen}`);
  }
  if (baseline.dispatchCompare.parityOk !== candidate.dispatchCompare.parityOk) {
    mismatches.push('dispatch_compare_parity');
  }
  if (baseline.replayParity.replayParityOk !== candidate.replayParity.replayParityOk) {
    mismatches.push('replay_parity');
  }
  if (baseline.primaryDispatch.dispatchReady !== candidate.primaryDispatch.dispatchReady) {
    mismatches.push('primary_dispatch_ready');
  }
  return mismatches;
}

/** Round-24 twin landing gate regression compare. */
export function compareIdleGovernanceProgramWaveLandingGates(
  baseline: O10IdleGovernanceProgramWaveLandingGateResult,
  candidate: O10IdleGovernanceProgramWaveLandingGateResult
): O10IdleGovernanceProgramWaveLandingGateCompareResult {
  const mismatches = compareLandingGateFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_landing_gate_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-landing-gate-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveLandingGateCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveLandingGateResult => ({
    schema: '10m.agent20.idle-governance-program-wave-landing-gate.v1',
    waveRound: 24,
    landingOpen: true,
    landingMarkdown: 'md',
    summaryLine: 'land',
    primaryDispatch: {
      dispatchReady: true,
    } as O10IdleGovernanceProgramWaveLandingGateResult['primaryDispatch'],
    twinDispatch: {} as O10IdleGovernanceProgramWaveLandingGateResult['twinDispatch'],
    dispatchCompare: { parityOk: true } as O10IdleGovernanceProgramWaveLandingGateResult['dispatchCompare'],
    replayParity: { replayParityOk: true } as O10IdleGovernanceProgramWaveLandingGateResult['replayParity'],
  });

  const ok = compareIdleGovernanceProgramWaveLandingGates(twin(), twin());
  push('gov_prog_land_cmp_parity', 'identical landing gates report parity', ok.parityOk === true);

  const bad = compareIdleGovernanceProgramWaveLandingGates(twin(), { ...twin(), landingOpen: false });
  push(
    'gov_prog_land_cmp_open',
    'landing_open drift surfaces mismatch',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('landing_open'))
  );

  push(
    'gov_prog_land_cmp_schema',
    'landing gate compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-landing-gate-compare.v1'
  );

  return results;
}
