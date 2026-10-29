import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type MacroTransmissionMergeBand = 'coherent' | 'drifting' | 'fragile' | 'inline_blocked';

export interface MacroTransmissionMergeInflationAssessment {
  mergeBand: MacroTransmissionMergeBand;
  transmissionIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Macro transmission disagreement and inline merge readiness feeding CPI metadata (Agent 06). */
export function assessMacroTransmissionMergeInflation(input: {
  transmissionStabilityFragile: boolean;
  macroRecoveryRankStressActive: boolean;
  outputGap: number;
  nominalDemandPressure: number;
  inflationBand: InflationConditionsBand;
  turn: number;
}): MacroTransmissionMergeInflationAssessment {
  let pressure = 0;
  if (input.transmissionStabilityFragile) {
    pressure += 0.3;
  }
  if (input.macroRecoveryRankStressActive) {
    pressure += 0.22;
  }

  if (input.outputGap > 0.25) {
    pressure += 0.12;
  } else if (input.outputGap < -0.2) {
    pressure += 0.08;
  }

  if (input.nominalDemandPressure > 0.4) {
    pressure += 0.14;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.06;
  }

  pressure = finClamp(pressure + input.turn * 0.0038, 0, 1.05);
  const transmissionIndex = finRound(100 + pressure * 16, 1);

  let mergeBand: MacroTransmissionMergeBand = 'coherent';
  if (pressure >= 0.55) mergeBand = 'inline_blocked';
  else if (pressure >= 0.38) mergeBand = 'fragile';
  else if (pressure >= 0.2) mergeBand = 'drifting';

  const inflationScoreNudge =
    mergeBand === 'inline_blocked'
      ? 0.088
      : mergeBand === 'fragile'
        ? 0.058
        : mergeBand === 'drifting'
          ? 0.026
          : 0;

  const narrative =
    mergeBand === 'inline_blocked' || mergeBand === 'fragile'
      ? 'Macro transmission merge stress is passing through to CPI via fragile stability layers.'
      : mergeBand === 'drifting'
        ? 'Transmission layers drifting — modest CPI nudge from recovery rank stress.'
        : 'Macro transmission merge coherent; inline merge pass-through subdued.';

  return { mergeBand, transmissionIndex, inflationScoreNudge, narrative };
}

export function macroTransmissionMergeInflationScoreAdjustment(band: MacroTransmissionMergeBand): number {
  if (band === 'inline_blocked') return 4;
  if (band === 'fragile') return 3;
  if (band === 'drifting') return 2;
  return 0;
}
