import type { O10IdleGovernanceProgramWaveScaleDispatchResult } from './automation-idle-governance-program-wave-scale-dispatch.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceProgramWaveScaleDispatchCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-scale-dispatch-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareDispatchFields(
  baseline: O10IdleGovernanceProgramWaveScaleDispatchResult,
  candidate: O10IdleGovernanceProgramWaveScaleDispatchResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.dispatchReady !== candidate.dispatchReady) {
    mismatches.push(`dispatch_ready ${baseline.dispatchReady} vs ${candidate.dispatchReady}`);
  }
  if (baseline.closeoutCompare.parityOk !== candidate.closeoutCompare.parityOk) {
    mismatches.push('closeout_compare_parity');
  }
  if (baseline.projectionRollup.projectedLocBand !== candidate.projectionRollup.projectedLocBand) {
    mismatches.push('projection_loc_band');
  }
  if (
    baseline.projectionRollup.projectionHookLines.length !==
    candidate.projectionRollup.projectionHookLines.length
  ) {
    mismatches.push('projection_hook_count');
  }
  return mismatches;
}

/** Round-23 twin scale dispatch regression compare. */
export function compareIdleGovernanceProgramWaveScaleDispatches(
  baseline: O10IdleGovernanceProgramWaveScaleDispatchResult,
  candidate: O10IdleGovernanceProgramWaveScaleDispatchResult
): O10IdleGovernanceProgramWaveScaleDispatchCompareResult {
  const mismatches = compareDispatchFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_scale_dispatch_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-scale-dispatch-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveScaleDispatchCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveScaleDispatchResult => ({
    schema: '10m.agent20.idle-governance-program-wave-scale-dispatch.v1',
    waveRound: 23,
    dispatchReady: true,
    dispatchMarkdown: 'md',
    summaryLine: 'dsp',
    primaryCloseout: {} as O10IdleGovernanceProgramWaveScaleDispatchResult['primaryCloseout'],
    twinCloseout: {} as O10IdleGovernanceProgramWaveScaleDispatchResult['twinCloseout'],
    closeoutCompare: { parityOk: true } as O10IdleGovernanceProgramWaveScaleDispatchResult['closeoutCompare'],
    projectionRollup: {
      projectedLocBand: 'on_track',
      projectionHookLines: ['a', 'b', 'c', 'd', 'e'],
    } as O10IdleGovernanceProgramWaveScaleDispatchResult['projectionRollup'],
  });

  const ok = compareIdleGovernanceProgramWaveScaleDispatches(twin(), twin());
  push('gov_prog_dsp_cmp_parity', 'identical dispatches report parity', ok.parityOk === true);

  const bad = compareIdleGovernanceProgramWaveScaleDispatches(twin(), {
    ...twin(),
    dispatchReady: false,
  });
  push(
    'gov_prog_dsp_cmp_ready',
    'dispatch_ready drift surfaces mismatch',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('dispatch_ready'))
  );

  push(
    'gov_prog_dsp_cmp_schema',
    'scale dispatch compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-scale-dispatch-compare.v1'
  );

  return results;
}
