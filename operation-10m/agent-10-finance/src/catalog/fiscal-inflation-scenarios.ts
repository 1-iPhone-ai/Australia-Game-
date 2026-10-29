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
  {
    id: 'phillips_overheat_stack',
    label: 'Phillips overheat stack',
    description: 'Demand-side overheating with strained fiscal backdrop (Agent 06 merge in sim).',
    patch: {
      inflationSettingMultiplier: 1.28,
      fiscalPressure: 'strained',
      actorCreditStressIndex: 0.48,
      highInflationScenario: true,
    },
    tags: ['inflation', 'phillips', 'round5'],
  },
  {
    id: 'fiscal_dominance_inflation',
    label: 'Fiscal dominance inflation',
    description: 'Critical fiscal pressure with sovereign vulnerability — anchoring stress.',
    patch: {
      fiscalPressure: 'critical',
      sovereignDebtPressure: 'high',
      fiscalSustainability: 'vulnerable',
      highInflationScenario: true,
      inflationSettingMultiplier: 1.2,
    },
    tags: ['fiscal', 'inflation', 'round5'],
  },
  {
    id: 'stagflation_risk_blend',
    label: 'Stagflation risk blend',
    description: 'Elevated inflation with credit restriction and household strain.',
    patch: {
      creditShockActive: true,
      householdAffordability: 'severe_pressure',
      fiscalPressure: 'critical',
      inflationSettingMultiplier: 1.15,
    },
    tags: ['inflation', 'credit', 'round5'],
  },
  {
    id: 'real_rate_accommodative_stack',
    label: 'Real rate accommodative stack',
    description: 'High inflation score with accommodative credit — negative real rate gap stress.',
    patch: {
      highInflationScenario: true,
      inflationSettingMultiplier: 1.32,
      creditShockActive: false,
      actorCreditStressIndex: 0.42,
    },
    tags: ['inflation', 'rates', 'round6'],
  },
  {
    id: 'disinflation_sacrifice_path',
    label: 'Disinflation sacrifice path',
    description: 'Elevated inflation with improving fiscal consolidation metaphor.',
    patch: {
      highInflationScenario: true,
      fiscalPressure: 'strained',
      inflationSettingMultiplier: 1.1,
      publicStability: 55,
    },
    tags: ['inflation', 'disinflation', 'round6'],
  },
  {
    id: 'credit_inflation_vicious_loop',
    label: 'Credit–inflation vicious loop',
    description: 'Credit shock with household extreme stress — amplifying feedback.',
    patch: {
      creditShockActive: true,
      householdAffordability: 'severe_pressure',
      householdInflationScenarioActive: true,
      fiscalPressure: 'critical',
      inflationSettingMultiplier: 1.24,
    },
    tags: ['inflation', 'credit', 'round6'],
  },
  {
    id: 'import_shock_pass_through',
    label: 'Import shock pass-through',
    description: 'Open economy with sharp FX depreciation — import CPI channel.',
    patch: {
      highInflationScenario: true,
      inflationSettingMultiplier: 1.28,
      householdAffordability: 'strained',
    },
    tags: ['inflation', 'trade', 'round7'],
  },
  {
    id: 'term_premium_fiscal_stress',
    label: 'Term premium fiscal stress',
    description: 'Critical fiscal and sovereign debt — long-rate inflation signal.',
    patch: {
      fiscalPressure: 'critical',
      sovereignDebtPressure: 'critical',
      fiscalSustainability: 'vulnerable',
      highInflationScenario: true,
      inflationSettingMultiplier: 1.18,
    },
    tags: ['inflation', 'rates', 'round7'],
  },
  {
    id: 'corporate_pricing_power_spike',
    label: 'Corporate pricing power spike',
    description: 'Strong corporate pass-through intent with elevated inflation multiplier.',
    patch: {
      highInflationScenario: true,
      inflationSettingMultiplier: 1.35,
      actorCreditStressIndex: 0.52,
      publicStability: 48,
    },
    tags: ['inflation', 'corporate', 'round7'],
  },
  {
    id: 'energy_grid_crisis_pass_through',
    label: 'Energy grid crisis pass-through',
    description: 'Wholesale energy crisis with fragile grid — utility CPI channel.',
    patch: {
      highInflationScenario: true,
      inflationSettingMultiplier: 1.26,
      systemicLiquidityBand: 'critical',
      fiscalPressure: 'strained',
    },
    tags: ['inflation', 'energy', 'round8'],
  },
  {
    id: 'urban_shelter_rent_overheat',
    label: 'Urban shelter rent overheat',
    description: 'Critical vacancy with surging rents — shelter CPI dominance.',
    patch: {
      householdAffordability: 'severe_pressure',
      householdInflationScenarioActive: true,
      inflationSettingMultiplier: 1.22,
      highInflationScenario: true,
    },
    tags: ['inflation', 'cities', 'round8'],
  },
  {
    id: 'energy_transition_cost_stack',
    label: 'Energy transition cost stack',
    description: 'Elevated transition costs with tariff shock and fiscal strain.',
    patch: {
      fiscalPressure: 'critical',
      inflationSettingMultiplier: 1.19,
      highInflationScenario: true,
      publicStability: 42,
    },
    tags: ['inflation', 'energy', 'round8'],
  },
  {
    id: 'food_supply_chain_shock',
    label: 'Food supply chain shock',
    description: 'Harvest stress with supply disruption — grocery CPI pass-through.',
    patch: {
      highInflationScenario: true,
      inflationSettingMultiplier: 1.24,
      fiscalPressure: 'strained',
      creditShockActive: true,
    },
    tags: ['inflation', 'food', 'round9'],
  },
  {
    id: 'transport_freight_bottleneck',
    label: 'Transport freight bottleneck',
    description: 'Critical freight capacity with strained liquidity — logistics inflation.',
    patch: {
      highInflationScenario: true,
      inflationSettingMultiplier: 1.21,
      systemicLiquidityBand: 'critical',
      fiscalPressure: 'critical',
    },
    tags: ['inflation', 'transport', 'round9'],
  },
  {
    id: 'housing_wellbeing_cost_stack',
    label: 'Housing wellbeing cost stack',
    description: 'Mortgage and essential-services pressure — household inflation flags.',
    patch: {
      householdAffordability: 'severe_pressure',
      householdInflationScenarioActive: true,
      inflationSettingMultiplier: 1.2,
      publicStability: 44,
    },
    tags: ['inflation', 'housing', 'round9'],
  },
  {
    id: 'healthcare_workforce_crisis',
    label: 'Healthcare workforce crisis',
    description: 'Acute wage and capacity pressure in healthcare services CPI.',
    patch: {
      highInflationScenario: true,
      inflationSettingMultiplier: 1.23,
      fiscalPressure: 'critical',
      activeCrises: 2,
    },
    tags: ['inflation', 'healthcare', 'round10'],
  },
  {
    id: 'insurance_hard_market_stack',
    label: 'Insurance hard market stack',
    description: 'Claims inflation with reinsurance stress — premium pass-through.',
    patch: {
      highInflationScenario: true,
      inflationSettingMultiplier: 1.25,
      creditShockActive: true,
      publicStability: 40,
    },
    tags: ['inflation', 'insurance', 'round10'],
  },
  {
    id: 'research_offset_vs_event_shock',
    label: 'Research offset vs event shock',
    description: 'Productivity relief overwhelmed by national supply disruption.',
    patch: {
      inflationSettingMultiplier: 1.28,
      highInflationScenario: true,
      fiscalPressure: 'strained',
      activeCrises: 1,
    },
    tags: ['inflation', 'events', 'round10'],
  },
  {
    id: 'education_subsidy_cut_stack',
    label: 'Education subsidy cut stack',
    description: 'Fiscal strain with tuition indexation — education CPI pressure.',
    patch: {
      fiscalPressure: 'critical',
      inflationSettingMultiplier: 1.22,
      highInflationScenario: true,
      householdInflationScenarioActive: true,
    },
    tags: ['inflation', 'education', 'round11'],
  },
  {
    id: 'comms_tariff_platform_spike',
    label: 'Comms tariff platform spike',
    description: 'Regulated tariff shock with liquidity strain — digital services CPI.',
    patch: {
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.2,
      highInflationScenario: true,
    },
    tags: ['inflation', 'comms', 'round11'],
  },
  {
    id: 'modes_extreme_inflation_sandbox',
    label: 'Modes extreme inflation sandbox',
    description: 'Scenario bias extreme with stability erosion — mode-driven inflation.',
    patch: {
      inflationSettingMultiplier: 1.32,
      highInflationScenario: true,
      publicStability: 38,
      activeCrises: 1,
    },
    tags: ['inflation', 'modes', 'round11'],
  },
  {
    id: 'tourism_leisure_boom_pass_through',
    label: 'Tourism leisure boom pass-through',
    description: 'Surging tourism with discretionary pressure — recreation CPI.',
    patch: {
      highInflationScenario: true,
      inflationSettingMultiplier: 1.23,
      householdInflationScenarioActive: true,
      publicStability: 46,
    },
    tags: ['inflation', 'leisure', 'round12'],
  },
  {
    id: 'professional_fee_compliance_stack',
    label: 'Professional fee compliance stack',
    description: 'Elevated billing and compliance — professional services CPI.',
    patch: {
      fiscalPressure: 'critical',
      inflationSettingMultiplier: 1.26,
      creditShockActive: true,
      highInflationScenario: true,
    },
    tags: ['inflation', 'professional', 'round12'],
  },
  {
    id: 'command_team_upside_risk_brief',
    label: 'Command team upside risk brief',
    description: 'Fused macro alert with team upside consensus — inflation flags.',
    patch: {
      inflationSettingMultiplier: 1.3,
      highInflationScenario: true,
      publicStability: 36,
      activeCrises: 2,
    },
    tags: ['inflation', 'command', 'round12'],
  },
  {
    id: 'childcare_capacity_award_stack',
    label: 'Childcare capacity award stack',
    description: 'Severe capacity with award pass-through — childcare CPI.',
    patch: {
      householdAffordability: 'severe_pressure',
      inflationSettingMultiplier: 1.22,
      highInflationScenario: true,
      fiscalPressure: 'strained',
    },
    tags: ['inflation', 'childcare', 'round13'],
  },
  {
    id: 'government_levy_indexation_step',
    label: 'Government levy indexation step',
    description: 'Above-CPI fee indexation with fiscal critical — charges CPI.',
    patch: {
      fiscalPressure: 'critical',
      inflationSettingMultiplier: 1.24,
      highInflationScenario: true,
      publicStability: 41,
    },
    tags: ['inflation', 'government', 'round13'],
  },
  {
    id: 'turns_automation_inflation_drift',
    label: 'Turns automation inflation drift',
    description: 'Peak season carryover with unattended autopilot drift.',
    patch: {
      inflationSettingMultiplier: 1.27,
      highInflationScenario: true,
      creditShockActive: true,
      activeCrises: 1,
    },
    tags: ['inflation', 'automation', 'round13'],
  },
  {
    id: 'water_drought_utility_crisis',
    label: 'Water drought utility crisis',
    description: 'Severe drought with tariff shock — water utilities CPI.',
    patch: {
      systemicLiquidityBand: 'critical',
      inflationSettingMultiplier: 1.23,
      highInflationScenario: true,
      fiscalPressure: 'critical',
    },
    tags: ['inflation', 'water', 'round14'],
  },
  {
    id: 'domestic_travel_capacity_overheat',
    label: 'Domestic travel capacity overheat',
    description: 'Constrained routes with full accommodation — travel CPI.',
    patch: {
      highInflationScenario: true,
      householdInflationScenarioActive: true,
      inflationSettingMultiplier: 1.21,
      publicStability: 43,
    },
    tags: ['inflation', 'travel', 'round14'],
  },
  {
    id: 'strategic_memory_inflation_drift',
    label: 'Strategic memory inflation drift',
    description: 'Expansionary strategic bias with recalled high-inflation regime.',
    patch: {
      inflationSettingMultiplier: 1.29,
      highInflationScenario: true,
      creditShockActive: true,
      activeCrises: 1,
    },
    tags: ['inflation', 'strategic', 'round14'],
  },
  {
    id: 'construction_materials_supply_crunch',
    label: 'Construction materials supply crunch',
    description: 'Severe supply chain with labor pass-through — materials CPI.',
    patch: {
      creditShockActive: true,
      inflationSettingMultiplier: 1.25,
      highInflationScenario: true,
      fiscalPressure: 'critical',
    },
    tags: ['inflation', 'construction', 'round15'],
  },
  {
    id: 'retail_margin_price_led_shelf',
    label: 'Retail margin price-led shelf',
    description: 'Light discounting with high wage bill — retail CPI pass-through.',
    patch: {
      householdAffordability: 'severe_pressure',
      inflationSettingMultiplier: 1.22,
      highInflationScenario: true,
      householdInflationScenarioActive: true,
    },
    tags: ['inflation', 'retail', 'round15'],
  },
  {
    id: 'dashboard_regional_heatmap_alert',
    label: 'Dashboard regional heatmap alert',
    description: 'Critical dashboard urgency with regional inflation alert.',
    patch: {
      inflationSettingMultiplier: 1.26,
      highInflationScenario: true,
      systemicLiquidityBand: 'strained',
      publicStability: 40,
    },
    tags: ['inflation', 'dashboard', 'round15'],
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
