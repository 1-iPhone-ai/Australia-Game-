import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type TradeClearedForwardArcInflationHandoffLatchBand =
  | 'anchored'
  | 'building'
  | 'handoff_stress'
  | 'continuity_rupture';

export interface TradeClearedForwardArcInflationHandoffLatchAssessment {
  latchBand: TradeClearedForwardArcInflationHandoffLatchBand;
  continuityIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Trade cleared forward-arc inflation handoff latch (Agent 15, round 49). */
export function assessTradeClearedForwardArcInflationHandoffLatch(input: {
  tradeOpennessBand: 'closed' | 'mixed' | 'open';
  exchangeRatePressure: 'appreciation' | 'stable' | 'depreciation' | 'sharp_depreciation';
  wave49ClearedForwardArcHandoffLatch: boolean;
  clearedForwardArcHandoffContinuityBand: 'stable' | 'strained' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): TradeClearedForwardArcInflationHandoffLatchAssessment {
  let pressure = 0;
  if (input.exchangeRatePressure === 'sharp_depreciation') pressure += 0.19;
  else if (input.exchangeRatePressure === 'depreciation') pressure += 0.1;
  if (input.tradeOpennessBand === 'open') pressure += 0.08;
  if (input.wave49ClearedForwardArcHandoffLatch) pressure += 0.14;
  if (input.clearedForwardArcHandoffContinuityBand === 'ruptured') pressure += 0.21;
  else if (input.clearedForwardArcHandoffContinuityBand === 'strained') pressure += 0.09;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0038, 0, 1.05);
  const continuityIndex = finRound(100 + pressure * 16.4, 1);

  let latchBand: TradeClearedForwardArcInflationHandoffLatchBand = 'anchored';
  if (pressure >= 0.57) latchBand = 'continuity_rupture';
  else if (pressure >= 0.37) latchBand = 'handoff_stress';
  else if (pressure >= 0.16) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'continuity_rupture'
      ? 0.094
      : latchBand === 'handoff_stress'
        ? 0.061
        : latchBand === 'building'
          ? 0.029
          : 0;

  const narrative =
    latchBand === 'continuity_rupture' || latchBand === 'handoff_stress'
      ? 'Cleared forward-arc handoff failing to anchor import-side CPI metadata.'
      : latchBand === 'building'
        ? 'Forward-arc handoff continuity building under trade stress.'
        : 'Trade cleared forward-arc handoff latch anchored versus headline CPI.';

  return { latchBand, continuityIndex, inflationScoreNudge, narrative };
}

export function tradeClearedForwardArcInflationHandoffLatchScoreAdjustment(
  band: TradeClearedForwardArcInflationHandoffLatchBand,
): number {
  if (band === 'continuity_rupture') return 4;
  if (band === 'handoff_stress') return 3;
  if (band === 'building') return 2;
  return 0;
}
