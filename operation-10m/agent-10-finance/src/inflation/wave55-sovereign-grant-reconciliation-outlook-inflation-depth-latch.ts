import type { InflationConditionsBand } from '../definitions/types.js';
import type { SovereignGrantReconciliationOutlookInflationLatchBand } from './sovereign-grant-reconciliation-outlook-inflation-latch.js';
import { finClamp, finRound } from '../compute/math.js';

export type Wave55SovereignGrantReconciliationOutlookInflationDepthLatchBand =
  | 'stable'
  | 'deepening'
  | 'critical_depth'
  | 'rupture_stack';

export interface Wave55SovereignGrantReconciliationOutlookInflationDepthLatchAssessment {
  latchBand: Wave55SovereignGrantReconciliationOutlookInflationDepthLatchBand;
  depthIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Wave-55 sovereign grant reconciliation outlook inflation depth latch (O10-247). */
export function assessWave55SovereignGrantReconciliationOutlookInflationDepthLatch(input: {
  wave54SovereignGrantReconciliationOutlookLatch: boolean;
  wave54SovereignGrantReconciliationOutlookBand: SovereignGrantReconciliationOutlookInflationLatchBand;
  consolidatedDeficitBand: 'surplus' | 'balanced' | 'moderate_deficit' | 'large_deficit';
  sovereignBufferBridgeGapElevated: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): Wave55SovereignGrantReconciliationOutlookInflationDepthLatchAssessment {
  let pressure = 0;
  if (input.wave54SovereignGrantReconciliationOutlookLatch) pressure += 0.16;
  if (input.wave54SovereignGrantReconciliationOutlookBand === 'sovereign_rupture') pressure += 0.24;
  else if (input.wave54SovereignGrantReconciliationOutlookBand === 'strained') pressure += 0.12;
  else if (input.wave54SovereignGrantReconciliationOutlookBand === 'building') pressure += 0.06;
  if (input.consolidatedDeficitBand === 'large_deficit') pressure += 0.14;
  else if (input.consolidatedDeficitBand === 'moderate_deficit') pressure += 0.07;
  if (input.sovereignBufferBridgeGapElevated) pressure += 0.1;
  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.06;

  pressure = finClamp(pressure + input.turn * 0.0043, 0, 1.08);
  const depthIndex = finRound(100 + pressure * 17.1, 1);

  let latchBand: Wave55SovereignGrantReconciliationOutlookInflationDepthLatchBand = 'stable';
  if (pressure >= 0.62) latchBand = 'rupture_stack';
  else if (pressure >= 0.42) latchBand = 'critical_depth';
  else if (pressure >= 0.2) latchBand = 'deepening';

  const inflationScoreNudge =
    latchBand === 'rupture_stack'
      ? 0.098
      : latchBand === 'critical_depth'
        ? 0.064
        : latchBand === 'deepening'
          ? 0.032
          : 0;

  const narrative =
    latchBand === 'rupture_stack' || latchBand === 'critical_depth'
      ? 'Wave-55 sovereign grant reconciliation depth latch stacking indexed-charges CPI pressure.'
      : latchBand === 'deepening'
        ? 'Sovereign grant reconciliation depth latch deepening under wave-54 outlook stress.'
        : 'Wave-55 sovereign grant reconciliation depth latch stable versus headline CPI.';

  return { latchBand, depthIndex, inflationScoreNudge, narrative };
}

export function wave55SovereignGrantReconciliationOutlookInflationDepthLatchScoreAdjustment(
  band: Wave55SovereignGrantReconciliationOutlookInflationDepthLatchBand,
): number {
  if (band === 'rupture_stack') return 4;
  if (band === 'critical_depth') return 3;
  if (band === 'deepening') return 2;
  return 0;
}
