import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type ModesSandboxInflationStressCascadeBand = 'routine' | 'stressed' | 'extreme' | 'bias_runaway';

export interface ModesSandboxInflationStressCascadeAssessment {
  cascadeBand: ModesSandboxInflationStressCascadeBand;
  stressIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Modes sandbox inflation stress cascade (Agent 04). */
export function assessModesSandboxInflationStressCascade(input: {
  scenarioInflationBias: 'disinflationary' | 'neutral' | 'inflationary' | 'extreme';
  sandboxStressModeActive: boolean;
  difficultyCostMultiplier: number;
  wave37SandboxInflationLatch: boolean;
  scenarioBiasCascadeBand: 'routine' | 'stressed' | 'runaway';
  inflationBand: InflationConditionsBand;
  turn: number;
}): ModesSandboxInflationStressCascadeAssessment {
  let pressure = 0;
  if (input.scenarioInflationBias === 'extreme') pressure += 0.24;
  else if (input.scenarioInflationBias === 'inflationary') pressure += 0.14;
  if (input.sandboxStressModeActive) pressure += 0.12;
  pressure += finClamp(input.difficultyCostMultiplier - 1, 0, 0.25) * 0.4;
  if (input.wave37SandboxInflationLatch) pressure += 0.13;
  if (input.scenarioBiasCascadeBand === 'runaway') pressure += 0.21;
  else if (input.scenarioBiasCascadeBand === 'stressed') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const stressIndex = finRound(100 + pressure * 16, 1);

  let cascadeBand: ModesSandboxInflationStressCascadeBand = 'routine';
  if (pressure >= 0.57) cascadeBand = 'bias_runaway';
  else if (pressure >= 0.38) cascadeBand = 'extreme';
  else if (pressure >= 0.17) cascadeBand = 'stressed';

  const inflationScoreNudge =
    cascadeBand === 'bias_runaway'
      ? 0.09
      : cascadeBand === 'extreme'
        ? 0.057
        : cascadeBand === 'stressed'
          ? 0.026
          : 0;

  const narrative =
    cascadeBand === 'bias_runaway' || cascadeBand === 'extreme'
      ? 'Sandbox stress cascade elevating CPI scenario-bias metadata.'
      : cascadeBand === 'stressed'
        ? 'Difficulty inflation latch building under sandbox stress.'
        : 'Modes sandbox inflation stress routine versus headline CPI.';

  return { cascadeBand, stressIndex, inflationScoreNudge, narrative };
}

export function modesSandboxInflationStressCascadeScoreAdjustment(
  band: ModesSandboxInflationStressCascadeBand,
): number {
  if (band === 'bias_runaway') return 4;
  if (band === 'extreme') return 3;
  if (band === 'stressed') return 2;
  return 0;
}
