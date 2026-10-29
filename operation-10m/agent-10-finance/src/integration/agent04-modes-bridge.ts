import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only modes / scenarios snapshot from Agent 04 (contract only). */
export interface Agent04ModesSnapshot {
  turn: number;
  scenarioInflationBias: 'disinflationary' | 'neutral' | 'inflationary' | 'extreme';
  sandboxStressModeActive: boolean;
  difficultyCostMultiplier: number;
  /** Round 26: difficulty setting inflation cascade active. */
  difficultyInflationCascade?: boolean;
  /** Round 26: sandbox stress inflation band. */
  sandboxStressInflationBand?: 'routine' | 'stressed' | 'extreme';
  /** Round 37: wave sandbox inflation latch. */
  wave37SandboxInflationLatch?: boolean;
  /** Round 37: scenario bias cascade band. */
  scenarioBiasCascadeBand?: 'routine' | 'stressed' | 'runaway';
  /** Round 45: sandbox pressure inflation latch. */
  wave45SandboxPressureLatch?: boolean;
  /** Round 45: scenario stress surge band. */
  scenarioStressSurgeBand?: 'routine' | 'stressed' | 'surge';
}

export function mergeAgent04IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent04ModesSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.scenarioInflationBias === 'extreme' || snapshot.scenarioInflationBias === 'inflationary') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.1, 0.85, 1.45);
  } else if (snapshot.scenarioInflationBias === 'disinflationary') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier - 0.05, 0.85, 1.45);
  }

  if (snapshot.sandboxStressModeActive) {
    inflationSettingMultiplier = finClamp(
      inflationSettingMultiplier * finClamp(snapshot.difficultyCostMultiplier, 1, 1.25),
      0.85,
      1.45,
    );
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.scenarioInflationBias === 'extreme') {
    highInflationScenario = true;
  }
  if (snapshot.difficultyInflationCascade && snapshot.sandboxStressInflationBand === 'extreme') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  } else if (snapshot.sandboxStressInflationBand === 'stressed' && snapshot.sandboxStressModeActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave37SandboxInflationLatch && snapshot.scenarioBiasCascadeBand === 'runaway') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.scenarioBiasCascadeBand === 'stressed' && snapshot.scenarioInflationBias === 'extreme') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.wave45SandboxPressureLatch && snapshot.scenarioStressSurgeBand === 'surge') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.scenarioStressSurgeBand === 'stressed' && snapshot.sandboxStressModeActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
  };
}

export function agent04ModesBridgeIntegrationNote(): string {
  return 'Agent 04 modes snapshot adjusts scenario inflation bias; no mode save writes.';
}
