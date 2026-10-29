import type { O10IdleGovernanceProgramWaveCycleCloseoutResult } from './automation-idle-governance-program-wave-cycle-closeout.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveCycleCloseoutCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-cycle-closeout-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareCycleCloseoutFields(
  baseline: O10IdleGovernanceProgramWaveCycleCloseoutResult,
  candidate: O10IdleGovernanceProgramWaveCycleCloseoutResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.cycleRecommendation !== candidate.cycleRecommendation) {
    mismatches.push(
      `cycle_rec ${baseline.cycleRecommendation} vs ${candidate.cycleRecommendation}`
    );
  }
  if (baseline.gateCompare.parityOk !== candidate.gateCompare.parityOk) {
    mismatches.push('gate_compare_parity');
  }
  if (baseline.primaryGate.gateOpen !== candidate.primaryGate.gateOpen) {
    mismatches.push('primary_gate_open');
  }
  if (baseline.handoffBundle.payload.gateOpen !== candidate.handoffBundle.payload.gateOpen) {
    mismatches.push('handoff_gate_open');
  }
  return mismatches;
}

/** Round-22 twin cycle closeout regression compare. */
export function compareIdleGovernanceProgramWaveCycleCloseouts(
  baseline: O10IdleGovernanceProgramWaveCycleCloseoutResult,
  candidate: O10IdleGovernanceProgramWaveCycleCloseoutResult
): O10IdleGovernanceProgramWaveCycleCloseoutCompareResult {
  const mismatches = compareCycleCloseoutFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_cycle_closeout_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-cycle-closeout-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveCycleCloseoutCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveCycleCloseoutResult => ({
    schema: '10m.agent20.idle-governance-program-wave-cycle-closeout.v1',
    waveRound: 22,
    cycleRecommendation: 'advance_scale_wave_cycle',
    cycleCloseoutMarkdown: 'md',
    summaryLine: 'close',
    primaryGate: { gateOpen: true } as O10IdleGovernanceProgramWaveCycleCloseoutResult['primaryGate'],
    twinGate: {} as O10IdleGovernanceProgramWaveCycleCloseoutResult['twinGate'],
    gateCompare: { parityOk: true } as O10IdleGovernanceProgramWaveCycleCloseoutResult['gateCompare'],
    handoffBundle: {
      payload: { gateOpen: true },
    } as O10IdleGovernanceProgramWaveCycleCloseoutResult['handoffBundle'],
  });

  const ok = compareIdleGovernanceProgramWaveCycleCloseouts(twin(), twin());
  push('gov_prog_cycle_cmp_parity', 'identical cycle closeouts report parity', ok.parityOk === true);

  const bad = compareIdleGovernanceProgramWaveCycleCloseouts(twin(), {
    ...twin(),
    cycleRecommendation: 'hold_scale_wave_cycle',
  });
  push(
    'gov_prog_cycle_cmp_rec',
    'cycle recommendation drift surfaces mismatch',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('cycle_rec'))
  );

  push(
    'gov_prog_cycle_cmp_schema',
    'cycle closeout compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-cycle-closeout-compare.v1'
  );

  return results;
}
