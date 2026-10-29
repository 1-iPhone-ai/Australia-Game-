import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only housing / wellbeing snapshot from Agent 14 (contract only). */
export interface Agent14HousingSnapshot {
  turn: number;
  mortgageStressBand: 'low' | 'elevated' | 'severe';
  wellbeingCostBand: 'stable' | 'strained' | 'critical';
  essentialServicesInflationFlag: boolean;
  /** Round 18: inline merge trajectory band from Agent 14 wellbeing module. */
  inlineMergeTrajectoryBand?: 'on_track' | 'lagging' | 'blocked';
  /** Round 18: turn-boundary inline activation monitor in critical band. */
  inlineActivationBoundaryCritical?: boolean;
}

export function mergeAgent14IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent14HousingSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.mortgageStressBand === 'severe') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.08, 0.85, 1.45);
  } else if (snapshot.mortgageStressBand === 'elevated') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }

  if (snapshot.wellbeingCostBand === 'critical') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.07, 0.85, 1.45);
  } else if (snapshot.wellbeingCostBand === 'strained') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  if (snapshot.essentialServicesInflationFlag) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }

  if (snapshot.inlineMergeTrajectoryBand === 'blocked') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  } else if (snapshot.inlineMergeTrajectoryBand === 'lagging') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  let householdAffordability = base.householdAffordability;
  if (
    snapshot.mortgageStressBand === 'severe' &&
    (snapshot.wellbeingCostBand === 'critical' || snapshot.wellbeingCostBand === 'strained')
  ) {
    householdAffordability = 'severe_pressure';
  } else if (snapshot.mortgageStressBand === 'elevated' && householdAffordability === 'healthy') {
    householdAffordability = 'strained';
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    householdAffordability,
    householdInflationScenarioActive:
      base.householdInflationScenarioActive ||
      snapshot.essentialServicesInflationFlag ||
      snapshot.wellbeingCostBand === 'critical' ||
      snapshot.inlineActivationBoundaryCritical === true,
    highInflationScenario:
      base.highInflationScenario ||
      snapshot.inlineMergeTrajectoryBand === 'blocked' ||
      snapshot.inlineActivationBoundaryCritical === true,
  };
}

export function agent14HousingBridgeIntegrationNote(): string {
  return 'Agent 14 housing snapshot adjusts wellbeing-side inflation multipliers; no mortgage ledger writes.';
}
