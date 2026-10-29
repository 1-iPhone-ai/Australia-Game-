import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type GrantSovereignReconciliationOutlookInflationLatchBand =
  | 'aligned'
  | 'building'
  | 'strained'
  | 'sovereign_rupture';

export interface GrantSovereignReconciliationOutlookInflationLatchAssessment {
  latchBand: GrantSovereignReconciliationOutlookInflationLatchBand;
  reconciliationIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Grant sovereign reconciliation outlook inflation latch (Agent 07, round 53). */
export function assessGrantSovereignReconciliationOutlookInflationLatch(input: {
  consolidatedDeficitBand: 'surplus' | 'balanced' | 'moderate_deficit' | 'large_deficit';
  debtServicePressure: 'low' | 'moderate' | 'elevated' | 'critical';
  wave52GrantSovereignReconciliationOutlookLatch: boolean;
  grantSovereignReconciliationOutlookBand: 'aligned' | 'strained' | 'ruptured';
  sovereignBufferBridgeGapElevated: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): GrantSovereignReconciliationOutlookInflationLatchAssessment {
  let pressure = 0;
  if (input.consolidatedDeficitBand === 'large_deficit') pressure += 0.18;
  else if (input.consolidatedDeficitBand === 'moderate_deficit') pressure += 0.09;
  if (input.debtServicePressure === 'critical') pressure += 0.21;
  else if (input.debtServicePressure === 'elevated') pressure += 0.11;
  if (input.wave52GrantSovereignReconciliationOutlookLatch) pressure += 0.14;
  if (input.grantSovereignReconciliationOutlookBand === 'ruptured') pressure += 0.23;
  else if (input.grantSovereignReconciliationOutlookBand === 'strained') pressure += 0.1;
  if (input.sovereignBufferBridgeGapElevated) pressure += 0.08;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0041, 0, 1.05);
  const reconciliationIndex = finRound(100 + pressure * 16.3, 1);

  let latchBand: GrantSovereignReconciliationOutlookInflationLatchBand = 'aligned';
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
      ? 'Grant sovereign reconciliation outlook latch elevating government-charges CPI metadata.'
      : latchBand === 'building'
        ? 'Sovereign reconciliation outlook latch building under buffer bridge stress.'
        : 'Grant sovereign reconciliation outlook latch aligned versus headline CPI.';

  return { latchBand, reconciliationIndex, inflationScoreNudge, narrative };
}

export function grantSovereignReconciliationOutlookInflationLatchScoreAdjustment(
  band: GrantSovereignReconciliationOutlookInflationLatchBand,
): number {
  if (band === 'sovereign_rupture') return 4;
  if (band === 'strained') return 3;
  if (band === 'building') return 2;
  return 0;
}
