import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only household economy snapshot from Agent 09 (contract only). */
export interface Agent09HouseholdSnapshot {
  turn: number;
  laborParticipationBand: 'weak' | 'steady' | 'strong';
  wageGrowthBand: 'subdued' | 'moderate' | 'elevated' | 'surge';
  costOfLivingStress: 'low' | 'moderate' | 'high' | 'extreme';
  /** Round 20: labor market slack band for wage-price pass-through. */
  participationSlackInflationBand?: 'tight' | 'balanced' | 'slack' | 'severe_slack';
  /** Round 20: household inflation expectations de-anchoring flag. */
  householdExpectationsDeanchoring?: boolean;
}

export function mergeAgent09IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent09HouseholdSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let householdAffordability = base.householdAffordability;
  if (snapshot.costOfLivingStress === 'extreme') {
    householdAffordability = 'severe_pressure';
  } else if (snapshot.costOfLivingStress === 'high' && householdAffordability === 'healthy') {
    householdAffordability = 'strained';
  }

  let householdInflationScenarioActive = base.householdInflationScenarioActive;
  if (snapshot.wageGrowthBand === 'surge' || snapshot.costOfLivingStress === 'extreme') {
    householdInflationScenarioActive = true;
  }

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (snapshot.wageGrowthBand === 'elevated' || snapshot.wageGrowthBand === 'surge') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  }

  let actorCreditStressIndex = base.actorCreditStressIndex ?? 0.35;
  if (snapshot.costOfLivingStress === 'extreme') {
    actorCreditStressIndex = finClamp(actorCreditStressIndex + 0.08, 0, 1);
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.householdExpectationsDeanchoring) {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.04, 0.85, 1.45);
  }
  if (snapshot.participationSlackInflationBand === 'severe_slack' && snapshot.wageGrowthBand !== 'subdued') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    householdAffordability,
    householdInflationScenarioActive,
    inflationSettingMultiplier,
    actorCreditStressIndex,
    highInflationScenario,
  };
}

export function agent09HouseholdBridgeIntegrationNote(): string {
  return 'Agent 09 household snapshot adjusts affordability and service-cost inflation flags; macro CPI only.';
}
