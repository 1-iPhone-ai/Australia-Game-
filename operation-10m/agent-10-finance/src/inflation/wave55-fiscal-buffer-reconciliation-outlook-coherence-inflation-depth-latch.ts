import type { InflationConditionsBand } from '../definitions/types.js';
import type { FiscalBufferReconciliationOutlookCoherenceInflationLatchBand } from './fiscal-buffer-reconciliation-outlook-coherence-inflation-latch.js';
import { finClamp, finRound } from '../compute/math.js';

export type Wave55FiscalBufferReconciliationOutlookCoherenceInflationDepthLatchBand =
  | 'stable'
  | 'deepening'
  | 'critical_depth'
  | 'coherence_stack_rupture';

export interface Wave55FiscalBufferReconciliationOutlookCoherenceInflationDepthLatchAssessment {
  latchBand: Wave55FiscalBufferReconciliationOutlookCoherenceInflationDepthLatchBand;
  depthIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Wave-55 fiscal buffer reconciliation outlook coherence inflation depth latch (O10-247). */
export function assessWave55FiscalBufferReconciliationOutlookCoherenceInflationDepthLatch(input: {
  wave54FiscalBufferReconciliationOutlookCoherenceLatch: boolean;
  wave54FiscalBufferReconciliationOutlookCoherenceBand: FiscalBufferReconciliationOutlookCoherenceInflationLatchBand;
  revenueMomentum: 'weak' | 'steady' | 'strong';
  grantFiscalCoherenceGapElevated: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): Wave55FiscalBufferReconciliationOutlookCoherenceInflationDepthLatchAssessment {
  let pressure = 0;
  if (input.wave54FiscalBufferReconciliationOutlookCoherenceLatch) pressure += 0.17;
  if (input.wave54FiscalBufferReconciliationOutlookCoherenceBand === 'coherence_rupture') pressure += 0.23;
  else if (input.wave54FiscalBufferReconciliationOutlookCoherenceBand === 'strained') pressure += 0.11;
  else if (input.wave54FiscalBufferReconciliationOutlookCoherenceBand === 'building') pressure += 0.05;
  if (input.revenueMomentum === 'weak') pressure += 0.13;
  else if (input.revenueMomentum === 'steady') pressure += 0.05;
  if (input.grantFiscalCoherenceGapElevated) pressure += 0.11;
  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0042, 0, 1.08);
  const depthIndex = finRound(100 + pressure * 16.8, 1);

  let latchBand: Wave55FiscalBufferReconciliationOutlookCoherenceInflationDepthLatchBand = 'stable';
  if (pressure >= 0.61) latchBand = 'coherence_stack_rupture';
  else if (pressure >= 0.41) latchBand = 'critical_depth';
  else if (pressure >= 0.19) latchBand = 'deepening';

  const inflationScoreNudge =
    latchBand === 'coherence_stack_rupture'
      ? 0.097
      : latchBand === 'critical_depth'
        ? 0.063
        : latchBand === 'deepening'
          ? 0.031
          : 0;

  const narrative =
    latchBand === 'coherence_stack_rupture' || latchBand === 'critical_depth'
      ? 'Wave-55 fiscal buffer reconciliation depth latch stacking charges-indexation CPI metadata.'
      : latchBand === 'deepening'
        ? 'Fiscal buffer reconciliation depth latch deepening under wave-54 coherence stress.'
        : 'Wave-55 fiscal buffer reconciliation depth latch stable versus headline CPI.';

  return { latchBand, depthIndex, inflationScoreNudge, narrative };
}

export function wave55FiscalBufferReconciliationOutlookCoherenceInflationDepthLatchScoreAdjustment(
  band: Wave55FiscalBufferReconciliationOutlookCoherenceInflationDepthLatchBand,
): number {
  if (band === 'coherence_stack_rupture') return 4;
  if (band === 'critical_depth') return 3;
  if (band === 'deepening') return 2;
  return 0;
}
