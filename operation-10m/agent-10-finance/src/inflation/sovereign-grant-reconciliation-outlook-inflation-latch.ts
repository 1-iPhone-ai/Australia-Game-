import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type SovereignGrantReconciliationOutlookInflationLatchBand =
  | 'aligned'
  | 'building'
  | 'strained'
  | 'sovereign_rupture';

export interface SovereignGrantReconciliationOutlookInflationLatchAssessment {
  latchBand: SovereignGrantReconciliationOutlookInflationLatchBand;
  reconciliationIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Sovereign grant reconciliation outlook inflation latch (Agent 07, round 54). */
export function assessSovereignGrantReconciliationOutlookInflationLatch(input: {
  consolidatedDeficitBand: 'surplus' | 'balanced' | 'moderate_deficit' | 'large_deficit';
  debtServicePressure: 'low' | 'moderate' | 'elevated' | 'critical';
  wave53GrantSovereignReconciliationOutlookLatch: boolean;
  sovereignGrantReconciliationOutlookBand: 'aligned' | 'strained' | 'ruptured';
  sovereignBufferBridgeGapElevated: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): SovereignGrantReconciliationOutlookInflationLatchAssessment {
  let pressure = 0;
  if (input.consolidatedDeficitBand === 'large_deficit') pressure += 0.18;
  else if (input.consolidatedDeficitBand === 'moderate_deficit') pressure += 0.09;
  if (input.debtServicePressure === 'critical') pressure += 0.21;
  else if (input.debtServicePressure === 'elevated') pressure += 0.11;
  if (input.wave53GrantSovereignReconciliationOutlookLatch) pressure += 0.14;
  if (input.sovereignGrantReconciliationOutlookBand === 'ruptured') pressure += 0.23;
  else if (input.sovereignGrantReconciliationOutlookBand === 'strained') pressure += 0.1;
  if (input.sovereignBufferBridgeGapElevated) pressure += 0.08;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0042, 0, 1.05);
  const reconciliationIndex = finRound(100 + pressure * 16.4, 1);

  let latchBand: SovereignGrantReconciliationOutlookInflationLatchBand = 'aligned';
  if (pressure >= 0.59) latchBand = 'sovereign_rupture';
  else if (pressure >= 0.39) latchBand = 'strained';
  else if (pressure >= 0.18) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'sovereign_rupture'
      ? 0.096
      : latchBand === 'strained'
        ? 0.062
        : latchBand === 'building'
          ? 0.031
          : 0;

  const narrative =
    latchBand === 'sovereign_rupture' || latchBand === 'strained'
      ? 'Sovereign grant reconciliation outlook latch elevating government-charges CPI metadata.'
      : latchBand === 'building'
        ? 'Grant reconciliation outlook latch building under sovereign buffer stress.'
        : 'Sovereign grant reconciliation outlook latch aligned versus headline CPI.';

  return { latchBand, reconciliationIndex, inflationScoreNudge, narrative };
}

export function sovereignGrantReconciliationOutlookInflationLatchScoreAdjustment(
  band: SovereignGrantReconciliationOutlookInflationLatchBand,
): number {
  if (band === 'sovereign_rupture') return 4;
  if (band === 'strained') return 3;
  if (band === 'building') return 2;
  return 0;
}
