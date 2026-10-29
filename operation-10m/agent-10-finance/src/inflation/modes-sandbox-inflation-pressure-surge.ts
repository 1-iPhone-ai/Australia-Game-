import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type ModesSandboxInflationPressureSurgeBand = 'routine' | 'stressed' | 'surge' | 'sandbox_crisis';

export interface ModesSandboxInflationPressureSurgeAssessment {
  surgeBand: ModesSandboxInflationPressureSurgeBand;
  pressureIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Modes sandbox inflation pressure surge (Agent 04, round 45). */
export function assessModesSandboxInflationPressureSurge(input: {
  scenarioInflationBias: 'disinflationary' | 'neutral' | 'inflationary' | 'extreme';
  sandboxStressModeActive: boolean;
  wave45SandboxPressureLatch: boolean;
  scenarioStressSurgeBand: 'routine' | 'stressed' | 'surge';
  inflationBand: InflationConditionsBand;
  turn: number;
}): ModesSandboxInflationPressureSurgeAssessment {
  let pressure = 0;
  if (input.scenarioInflationBias === 'extreme') pressure += 0.22;
  else if (input.scenarioInflationBias === 'inflationary') pressure += 0.11;
  if (input.sandboxStressModeActive) pressure += 0.14;
  if (input.wave45SandboxPressureLatch) pressure += 0.13;
  if (input.scenarioStressSurgeBand === 'surge') pressure += 0.21;
  else if (input.scenarioStressSurgeBand === 'stressed') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const pressureIndex = finRound(100 + pressure * 15, 1);

  let surgeBand: ModesSandboxInflationPressureSurgeBand = 'routine';
  if (pressure >= 0.57) surgeBand = 'sandbox_crisis';
  else if (pressure >= 0.37) surgeBand = 'surge';
  else if (pressure >= 0.16) surgeBand = 'stressed';

  const inflationScoreNudge =
    surgeBand === 'sandbox_crisis'
      ? 0.091
      : surgeBand === 'surge'
        ? 0.058
        : surgeBand === 'stressed'
          ? 0.027
          : 0;

  const narrative =
    surgeBand === 'sandbox_crisis' || surgeBand === 'surge'
      ? 'Sandbox pressure surge feeding CPI scenario metadata.'
      : surgeBand === 'stressed'
        ? 'Modes pressure latch building under stress mode.'
        : 'Modes sandbox pressure surge routine versus headline CPI.';

  return { surgeBand, pressureIndex, inflationScoreNudge, narrative };
}

export function modesSandboxInflationPressureSurgeScoreAdjustment(
  band: ModesSandboxInflationPressureSurgeBand,
): number {
  if (band === 'sandbox_crisis') return 4;
  if (band === 'surge') return 3;
  if (band === 'stressed') return 2;
  return 0;
}
