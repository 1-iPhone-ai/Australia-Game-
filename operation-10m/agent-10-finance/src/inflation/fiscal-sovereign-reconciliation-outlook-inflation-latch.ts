import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type FiscalSovereignReconciliationOutlookInflationLatchBand =
  | 'aligned'
  | 'building'
  | 'strained'
  | 'sovereign_rupture';

export interface FiscalSovereignReconciliationOutlookInflationLatchAssessment {
  latchBand: FiscalSovereignReconciliationOutlookInflationLatchBand;
  reconciliationIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Fiscal sovereign reconciliation outlook inflation latch (Agent 07, round 52). */
export function assessFiscalSovereignReconciliationOutlookInflationLatch(input: {
  consolidatedDeficitBand: 'surplus' | 'balanced' | 'moderate_deficit' | 'large_deficit';
  debtServicePressure: 'low' | 'moderate' | 'elevated' | 'critical';
  wave52FiscalSovereignReconciliationOutlookLatch: boolean;
  fiscalSovereignReconciliationOutlookBand: 'aligned' | 'strained' | 'ruptured';
  sovereignBufferBridgeGapElevated: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): FiscalSovereignReconciliationOutlookInflationLatchAssessment {
  let pressure = 0;
  if (input.consolidatedDeficitBand === 'large_deficit') pressure += 0.18;
  else if (input.consolidatedDeficitBand === 'moderate_deficit') pressure += 0.09;
  if (input.debtServicePressure === 'critical') pressure += 0.21;
  else if (input.debtServicePressure === 'elevated') pressure += 0.11;
  if (input.wave52FiscalSovereignReconciliationOutlookLatch) pressure += 0.14;
  if (input.fiscalSovereignReconciliationOutlookBand === 'ruptured') pressure += 0.23;
  else if (input.fiscalSovereignReconciliationOutlookBand === 'strained') pressure += 0.1;
  if (input.sovereignBufferBridgeGapElevated) pressure += 0.08;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0041, 0, 1.05);
  const reconciliationIndex = finRound(100 + pressure * 16.3, 1);

  let latchBand: FiscalSovereignReconciliationOutlookInflationLatchBand = 'aligned';
  if (pressure >= 0.59) latchBand = 'sovereign_rupture';
  else if (pressure >= 0.39) latchBand = 'strained';
  else if (pressure >= 0.18) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'sovereign_rupture'
      ? 0.095
      : latchBand === 'strained'
        ? 0.061
        : latchBand === 'building'
          ? 0.03
          : 0;

  const narrative =
    latchBand === 'sovereign_rupture' || latchBand === 'strained'
      ? 'Fiscal sovereign reconciliation outlook latch elevating government-charges CPI metadata.'
      : latchBand === 'building'
        ? 'Sovereign reconciliation outlook latch building under buffer bridge stress.'
        : 'Fiscal sovereign reconciliation outlook latch aligned versus headline CPI.';

  return { latchBand, reconciliationIndex, inflationScoreNudge, narrative };
}

export function fiscalSovereignReconciliationOutlookInflationLatchScoreAdjustment(
  band: FiscalSovereignReconciliationOutlookInflationLatchBand,
): number {
  if (band === 'sovereign_rupture') return 4;
  if (band === 'strained') return 3;
  if (band === 'building') return 2;
  return 0;
}
