import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type MacroDemandOverheatInflationSlippageBand = 'anchored' | 'warming' | 'overheating' | 'dislocated';

export interface MacroDemandOverheatInflationSlippageAssessment {
  slippageBand: MacroDemandOverheatInflationSlippageBand;
  macroIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Macro demand overheat and transmission inflation slippage (Agent 06). */
export function assessMacroDemandOverheatInflationSlippage(input: {
  gdpGrowthBand: 'contraction' | 'slow' | 'steady' | 'strong';
  nominalDemandPressure: number;
  outputGap: number;
  macroDemandOverheatLatch: boolean;
  transmissionSlippageBand: 'stable' | 'slipping' | 'dislocated';
  inflationBand: InflationConditionsBand;
  turn: number;
}): MacroDemandOverheatInflationSlippageAssessment {
  let pressure = 0;
  if (input.gdpGrowthBand === 'strong') {
    pressure += 0.16;
  } else if (input.gdpGrowthBand === 'steady') {
    pressure += 0.07;
  }
  pressure += finClamp(input.nominalDemandPressure, -0.5, 1) * 0.24;
  if (input.outputGap > 0.25) {
    pressure += input.outputGap * 0.35;
  }
  if (input.macroDemandOverheatLatch) {
    pressure += 0.15;
  }
  if (input.transmissionSlippageBand === 'dislocated') {
    pressure += 0.24;
  } else if (input.transmissionSlippageBand === 'slipping') {
    pressure += 0.12;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const macroIndex = finRound(100 + pressure * 15, 1);

  let slippageBand: MacroDemandOverheatInflationSlippageBand = 'anchored';
  if (pressure >= 0.54) slippageBand = 'dislocated';
  else if (pressure >= 0.34) slippageBand = 'overheating';
  else if (pressure >= 0.15) slippageBand = 'warming';

  const inflationScoreNudge =
    slippageBand === 'dislocated'
      ? 0.087
      : slippageBand === 'overheating'
        ? 0.055
        : slippageBand === 'warming'
          ? 0.026
          : 0;

  const narrative =
    slippageBand === 'dislocated' || slippageBand === 'overheating'
      ? 'Macro demand overheat is slipping inflation through transmission channels.'
      : slippageBand === 'warming'
        ? 'Nominal demand pressure warming CPI metadata.'
        : 'Macro transmission slippage anchored versus headline CPI.';

  return { slippageBand, macroIndex, inflationScoreNudge, narrative };
}

export function macroDemandOverheatInflationSlippageScoreAdjustment(
  band: MacroDemandOverheatInflationSlippageBand,
): number {
  if (band === 'dislocated') return 4;
  if (band === 'overheating') return 3;
  if (band === 'warming') return 2;
  return 0;
}
