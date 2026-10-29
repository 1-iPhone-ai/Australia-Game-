import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only research / tech snapshot from Agent 03 (contract only). */
export interface Agent03ResearchSnapshot {
  turn: number;
  productivityGainBand: 'flat' | 'moderate' | 'strong';
  supplySideReliefActive: boolean;
  innovationInflationOffsetScore: number;
  /** Round 26: tech-tree inflation latch feeding supply-side CPI metadata. */
  techTreeInflationLatch?: boolean;
  /** Round 26: supply-side inflation offset band. */
  supplySideOffsetBand?: 'weak' | 'building' | 'strong';
  /** Round 48: research breakthrough supply-side inflation latch. */
  wave48ResearchBreakthroughLatch?: boolean;
  /** Round 48: research supply-side failure band. */
  researchSupplySideFailureBand?: 'contained' | 'building' | 'critical';
}

export function mergeAgent03IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent03ResearchSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.productivityGainBand === 'strong' && snapshot.supplySideReliefActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier - 0.06, 0.85, 1.45);
  } else if (snapshot.productivityGainBand === 'moderate' && snapshot.innovationInflationOffsetScore > 0.45) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier - 0.03, 0.85, 1.45);
  } else if (snapshot.productivityGainBand === 'flat' && !snapshot.supplySideReliefActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  if (snapshot.techTreeInflationLatch && snapshot.supplySideOffsetBand === 'weak') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.supplySideOffsetBand === 'strong' && snapshot.supplySideReliefActive) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier - 0.04, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.wave48ResearchBreakthroughLatch && snapshot.researchSupplySideFailureBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  } else if (snapshot.researchSupplySideFailureBand === 'building' && snapshot.productivityGainBand === 'flat') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
  };
}

export function agent03ResearchBridgeIntegrationNote(): string {
  return 'Agent 03 research snapshot adjusts supply-side inflation offset; no tech tree writes.';
}
