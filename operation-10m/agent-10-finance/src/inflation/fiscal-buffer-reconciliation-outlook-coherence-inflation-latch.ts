import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type FiscalBufferReconciliationOutlookCoherenceInflationLatchBand =
  | 'coherent'
  | 'building'
  | 'strained'
  | 'coherence_rupture';

export interface FiscalBufferReconciliationOutlookCoherenceInflationLatchAssessment {
  latchBand: FiscalBufferReconciliationOutlookCoherenceInflationLatchBand;
  coherenceIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Fiscal buffer reconciliation outlook coherence inflation latch (Agent 07, round 54). */
export function assessFiscalBufferReconciliationOutlookCoherenceInflationLatch(input: {
  revenueMomentum: 'weak' | 'steady' | 'strong';
  grantFiscalCoherenceGapElevated: boolean;
  wave53BufferFiscalReconciliationOutlookCoherenceLatch: boolean;
  fiscalBufferReconciliationOutlookCoherenceBand: 'contained' | 'building' | 'critical';
  grantOutlookWithinBand: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): FiscalBufferReconciliationOutlookCoherenceInflationLatchAssessment {
  let pressure = 0;
  if (input.revenueMomentum === 'weak') pressure += 0.16;
  else if (input.revenueMomentum === 'steady') pressure += 0.06;
  if (input.grantFiscalCoherenceGapElevated) pressure += 0.12;
  if (input.wave53BufferFiscalReconciliationOutlookCoherenceLatch) pressure += 0.15;
  if (input.fiscalBufferReconciliationOutlookCoherenceBand === 'critical') pressure += 0.22;
  else if (input.fiscalBufferReconciliationOutlookCoherenceBand === 'building') pressure += 0.1;
  if (!input.grantOutlookWithinBand) pressure += 0.09;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0041, 0, 1.05);
  const coherenceIndex = finRound(100 + pressure * 15.9, 1);

  let latchBand: FiscalBufferReconciliationOutlookCoherenceInflationLatchBand = 'coherent';
  if (pressure >= 0.58) latchBand = 'coherence_rupture';
  else if (pressure >= 0.38) latchBand = 'strained';
  else if (pressure >= 0.17) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'coherence_rupture'
      ? 0.095
      : latchBand === 'strained'
        ? 0.061
        : latchBand === 'building'
          ? 0.03
          : 0;

  const narrative =
    latchBand === 'coherence_rupture' || latchBand === 'strained'
      ? 'Fiscal buffer reconciliation outlook coherence latch feeding indexed-charges CPI metadata.'
      : latchBand === 'building'
        ? 'Buffer reconciliation coherence latch building under fiscal outlook stress.'
        : 'Fiscal buffer reconciliation outlook coherence latch coherent versus headline CPI.';

  return { latchBand, coherenceIndex, inflationScoreNudge, narrative };
}

export function fiscalBufferReconciliationOutlookCoherenceInflationLatchScoreAdjustment(
  band: FiscalBufferReconciliationOutlookCoherenceInflationLatchBand,
): number {
  if (band === 'coherence_rupture') return 4;
  if (band === 'strained') return 3;
  if (band === 'building') return 2;
  return 0;
}
