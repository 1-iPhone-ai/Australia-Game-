import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type BufferFiscalReconciliationOutlookCoherenceInflationLatchBand =
  | 'coherent'
  | 'building'
  | 'strained'
  | 'coherence_rupture';

export interface BufferFiscalReconciliationOutlookCoherenceInflationLatchAssessment {
  latchBand: BufferFiscalReconciliationOutlookCoherenceInflationLatchBand;
  coherenceIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Buffer fiscal reconciliation outlook coherence inflation latch (Agent 07, round 53). */
export function assessBufferFiscalReconciliationOutlookCoherenceInflationLatch(input: {
  revenueMomentum: 'weak' | 'steady' | 'strong';
  grantFiscalCoherenceGapElevated: boolean;
  wave52BufferFiscalReconciliationOutlookCoherenceLatch: boolean;
  bufferFiscalReconciliationOutlookCoherenceBand: 'contained' | 'building' | 'critical';
  grantOutlookWithinBand: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): BufferFiscalReconciliationOutlookCoherenceInflationLatchAssessment {
  let pressure = 0;
  if (input.revenueMomentum === 'weak') pressure += 0.16;
  else if (input.revenueMomentum === 'steady') pressure += 0.06;
  if (input.grantFiscalCoherenceGapElevated) pressure += 0.12;
  if (input.wave52BufferFiscalReconciliationOutlookCoherenceLatch) pressure += 0.15;
  if (input.bufferFiscalReconciliationOutlookCoherenceBand === 'critical') pressure += 0.22;
  else if (input.bufferFiscalReconciliationOutlookCoherenceBand === 'building') pressure += 0.1;
  if (!input.grantOutlookWithinBand) pressure += 0.09;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.004, 0, 1.05);
  const coherenceIndex = finRound(100 + pressure * 15.8, 1);

  let latchBand: BufferFiscalReconciliationOutlookCoherenceInflationLatchBand = 'coherent';
  if (pressure >= 0.58) latchBand = 'coherence_rupture';
  else if (pressure >= 0.38) latchBand = 'strained';
  else if (pressure >= 0.17) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'coherence_rupture'
      ? 0.094
      : latchBand === 'strained'
        ? 0.06
        : latchBand === 'building'
          ? 0.029
          : 0;

  const narrative =
    latchBand === 'coherence_rupture' || latchBand === 'strained'
      ? 'Buffer fiscal reconciliation outlook coherence latch feeding indexed-charges CPI metadata.'
      : latchBand === 'building'
        ? 'Grant reconciliation coherence latch building under fiscal outlook stress.'
        : 'Buffer fiscal reconciliation outlook coherence latch coherent versus headline CPI.';

  return { latchBand, coherenceIndex, inflationScoreNudge, narrative };
}

export function bufferFiscalReconciliationOutlookCoherenceInflationLatchScoreAdjustment(
  band: BufferFiscalReconciliationOutlookCoherenceInflationLatchBand,
): number {
  if (band === 'coherence_rupture') return 4;
  if (band === 'strained') return 3;
  if (band === 'building') return 2;
  return 0;
}
