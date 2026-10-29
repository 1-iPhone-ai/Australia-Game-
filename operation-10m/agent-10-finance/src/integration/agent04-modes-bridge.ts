import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only modes / scenarios snapshot from Agent 04 (contract only). */
export interface Agent04ModesSnapshot {
  turn: number;
  scenarioInflationBias: 'disinflationary' | 'neutral' | 'inflationary' | 'extreme';
  sandboxStressModeActive: boolean;
  difficultyCostMultiplier: number;
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
