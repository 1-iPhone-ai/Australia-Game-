import type { MacroFinancialSystemInputs } from '../definitions/types.js';

export interface MacroFinancialScenarioPreset {
  id: string;
  label: string;
  description: string;
  patch: Partial<MacroFinancialSystemInputs>;
  tags: string[];
}

export const MACRO_FINANCIAL_SCENARIO_PRESETS: readonly MacroFinancialScenarioPreset[] = [
  {
    id: 'baseline_balanced',
    label: 'Balanced baseline',
    description: 'Neutral fiscal, credit, and inflation inputs for regression default.',
    patch: {},
    tags: ['baseline', 'regression'],
  },
  {
    id: 'high_inflation_pass_through',
    label: 'High inflation pass-through',
    description: 'Scenario + multiplier without touching commodity prices.',
    patch: { highInflationScenario: true, inflationSettingMultiplier: 1.25 },
    tags: ['inflation', 'scenario'],
  },
  {
    id: 'credit_shock_stack',
    label: 'Credit shock stack',
    description: 'Active credit shock with strained fiscal spillover.',
    patch: { creditShockActive: true, fiscalPressure: 'strained', actorCreditStressIndex: 0.65 },
    tags: ['credit', 'shock'],
  },
  {
    id: 'liquidity_crisis',
    label: 'Liquidity stress',
    description: 'Systemic liquidity critical with multiple active crises.',
    patch: { systemicLiquidityBand: 'critical', activeCrises: 3, publicStability: 35 },
    tags: ['stability', 'liquidity'],
  },
  {
    id: 'household_cost_wave',
    label: 'Household cost wave',
    description: 'Affordability strain feeding service-cost inflation channel.',
    patch: { householdAffordability: 'severe_pressure', householdInflationScenarioActive: true },
    tags: ['inflation', 'household'],
  },
  {
    id: 'sovereign_risk_tight',
    label: 'Sovereign risk + tight credit',
    description: 'Debt overhang with capital squeeze.',
    patch: {
      sovereignDebtPressure: 'high',
      fiscalSustainability: 'vulnerable',
      capitalFlexibility: 'very_low',
    },
    tags: ['fiscal', 'credit'],
  },
  {
    id: 'wage_spiral_services',
    label: 'Wage–price spiral (services)',
    description: 'Elevated inflation with severe household affordability — macro CPI channel only.',
    patch: {
      highInflationScenario: true,
      householdAffordability: 'severe_pressure',
      householdInflationScenarioActive: true,
      inflationSettingMultiplier: 1.18,
    },
    tags: ['inflation', 'wage', 'round4'],
  },
  {
    id: 'deanchoring_stress',
    label: 'Expectations de-anchoring',
    description: 'Runaway scenario flag with critical fiscal spillover.',
    patch: {
      highInflationScenario: true,
      fiscalPressure: 'critical',
      inflationSettingMultiplier: 1.35,
      publicStability: 30,
    },
    tags: ['inflation', 'expectations', 'round4'],
  },
  {
    id: 'macro06_demand_overheat',
    label: 'Macro demand overheat (Agent 06 bridge)',
    description: 'Simulates merged Agent 06 demand pressure via multiplier stress.',
    patch: {
      inflationSettingMultiplier: 1.22,
      actorCreditStressIndex: 0.55,
      fiscalPressure: 'strained',
    },
    tags: ['integration', 'agent06', 'round4'],
  },
] as const;

export function getMacroFinancialScenarioPreset(id: string): MacroFinancialScenarioPreset | undefined {
  return MACRO_FINANCIAL_SCENARIO_PRESETS.find((p) => p.id === id);
}

export function applyMacroFinancialScenarioPreset(
  base: MacroFinancialSystemInputs,
  presetId: string,
): MacroFinancialSystemInputs | null {
  const preset = getMacroFinancialScenarioPreset(presetId);
  if (!preset) return null;
  return {
    ...base,
    ...preset.patch,
    regions: { ...base.regions, ...(preset.patch.regions || {}) },
  };
}
