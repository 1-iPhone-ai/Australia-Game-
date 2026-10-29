import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type MacroOutputGapInflationPressureLatchBand = 'subdued' | 'building' | 'latched' | 'overheat_crisis';

export interface MacroOutputGapInflationPressureLatchAssessment {
  latchBand: MacroOutputGapInflationPressureLatchBand;
  pressureIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Macro output-gap inflation pressure latch (Agent 06, round 47). */
export function assessMacroOutputGapInflationPressureLatch(input: {
  gdpGrowthBand: 'contraction' | 'slow' | 'steady' | 'strong';
  outputGap: number;
  wave47MacroOutputGapLatch: boolean;
  outputGapEscalationBand: 'stable' | 'elevated' | 'critical';
  inflationBand: InflationConditionsBand;
  turn: number;
}): MacroOutputGapInflationPressureLatchAssessment {
  let pressure = 0;
  if (input.gdpGrowthBand === 'strong') pressure += 0.18;
  else if (input.gdpGrowthBand === 'steady' && input.outputGap > 0.2) pressure += 0.1;
  if (input.outputGap > 0.45) pressure += 0.2;
  else if (input.outputGap > 0.25) pressure += 0.11;
  if (input.wave47MacroOutputGapLatch) pressure += 0.14;
  if (input.outputGapEscalationBand === 'critical') pressure += 0.22;
  else if (input.outputGapEscalationBand === 'elevated') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0038, 0, 1.05);
  const pressureIndex = finRound(100 + pressure * 16.5, 1);

  let latchBand: MacroOutputGapInflationPressureLatchBand = 'subdued';
  if (pressure >= 0.58) latchBand = 'overheat_crisis';
  else if (pressure >= 0.38) latchBand = 'latched';
  else if (pressure >= 0.17) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'overheat_crisis'
      ? 0.094
      : latchBand === 'latched'
        ? 0.06
        : latchBand === 'building'
          ? 0.029
          : 0;

  const narrative =
    latchBand === 'overheat_crisis' || latchBand === 'latched'
      ? 'Macro output-gap latch elevating CPI demand-side metadata.'
      : latchBand === 'building'
        ? 'Output-gap escalation latch building under nominal demand pressure.'
        : 'Macro output-gap pressure latch subdued versus headline CPI.';

  return { latchBand, pressureIndex, inflationScoreNudge, narrative };
}

export function macroOutputGapInflationPressureLatchScoreAdjustment(
  band: MacroOutputGapInflationPressureLatchBand,
): number {
  if (band === 'overheat_crisis') return 4;
  if (band === 'latched') return 3;
  if (band === 'building') return 2;
  return 0;
}
