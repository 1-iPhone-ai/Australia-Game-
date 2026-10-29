import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type ScenarioSandboxInflationBiasBand = 'disinflationary' | 'neutral' | 'inflationary' | 'extreme_stress';

export interface ScenarioSandboxInflationBiasAssessment {
  biasBand: ScenarioSandboxInflationBiasBand;
  scenarioIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Scenario modes and sandbox stress inflation bias (Agent 04). */
export function assessScenarioSandboxInflationBias(input: {
  scenarioInflationBias: 'disinflationary' | 'neutral' | 'inflationary' | 'extreme';
  sandboxStressModeActive: boolean;
  difficultyCostMultiplier: number;
  difficultyInflationCascade: boolean;
  sandboxStressInflationBand: 'routine' | 'stressed' | 'extreme';
  inflationBand: InflationConditionsBand;
  turn: number;
}): ScenarioSandboxInflationBiasAssessment {
  let pressure = 0;
  if (input.scenarioInflationBias === 'extreme') {
    pressure += 0.32;
  } else if (input.scenarioInflationBias === 'inflationary') {
    pressure += 0.18;
  } else if (input.scenarioInflationBias === 'disinflationary') {
    pressure -= 0.12;
  }
  if (input.sandboxStressModeActive) {
    pressure += finClamp(input.difficultyCostMultiplier - 1, 0, 0.35) * 0.55;
  }
  if (input.difficultyInflationCascade) {
    pressure += 0.14;
  }
  if (input.sandboxStressInflationBand === 'extreme') {
    pressure += 0.2;
  } else if (input.sandboxStressInflationBand === 'stressed') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0038, -0.2, 1.05);
  const scenarioIndex = finRound(100 + pressure * 17, 1);

  let biasBand: ScenarioSandboxInflationBiasBand = 'neutral';
  if (pressure >= 0.52) biasBand = 'extreme_stress';
  else if (pressure >= 0.28) biasBand = 'inflationary';
  else if (pressure <= -0.06) biasBand = 'disinflationary';

  const inflationScoreNudge =
    biasBand === 'extreme_stress'
      ? 0.088
      : biasBand === 'inflationary'
        ? 0.052
        : biasBand === 'disinflationary'
          ? -0.028
          : 0;

  const narrative =
    biasBand === 'extreme_stress' || biasBand === 'inflationary'
      ? 'Scenario sandbox stress is biasing CPI metadata toward higher inflation.'
      : biasBand === 'disinflationary'
        ? 'Disinflationary scenario bias offsetting headline pressure.'
        : 'Scenario inflation bias neutral versus headline CPI.';

  return { biasBand, scenarioIndex, inflationScoreNudge, narrative };
}

export function scenarioSandboxInflationBiasScoreAdjustment(band: ScenarioSandboxInflationBiasBand): number {
  if (band === 'extreme_stress') return 4;
  if (band === 'inflationary') return 3;
  if (band === 'disinflationary') return -1;
  return 0;
}
