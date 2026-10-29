/** Named macro stress bundles for LAB / regression (shock id lists only). */
export interface MacroStressScenario {
  id: string;
  label: string;
  shockIds: string[];
  description: string;
}

export const MACRO_STRESS_SCENARIO_CATALOG: MacroStressScenario[] = [
  {
    id: 'baseline_soft_landing',
    label: 'Soft landing',
    shockIds: ['terms_of_trade_squeeze'],
    description: 'Mild external drag without credit seizure.'
  },
  {
    id: 'resource_bust',
    label: 'Resource bust',
    shockIds: ['commodity_bust', 'credit_contraction'],
    description: 'Mining terms and credit tighten together.'
  },
  {
    id: 'stagflation_mix',
    label: 'Stagflation mix',
    shockIds: ['high_inflation', 'global_slowdown'],
    description: 'Inflation scenario plus external demand shock.'
  },
  {
    id: 'policy_recovery',
    label: 'Policy recovery',
    shockIds: ['stimulus_bounce', 'mining_supercycle'],
    description: 'Stimulus plus resource capex upswing.'
  },
  {
    id: 'housing_and_credit',
    label: 'Housing & credit',
    shockIds: ['housing_correction', 'credit_contraction'],
    description: 'Domestic financial stress combination.'
  },
  {
    id: 'credit_crunch',
    label: 'Credit crunch',
    shockIds: ['credit_contraction', 'global_slowdown'],
    description: 'Spread widening with external demand fade.'
  },
  {
    id: 'labor_innovation_shock',
    label: 'Labor & innovation shock',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'External fade with labor and innovation pipeline stress (harness overlay).'
  },
  {
    id: 'housing_strategic_stress',
    label: 'Housing & strategic stress',
    shockIds: ['housing_correction', 'credit_contraction'],
    description: 'Domestic housing correction with strategic capital and credit tension (harness overlay).'
  },
  {
    id: 'inflation_energy_stress',
    label: 'Inflation & energy stress',
    shockIds: ['high_inflation', 'commodity_bust'],
    description: 'Price-pressure and energy cost shock combination (harness overlay).'
  },
  {
    id: 'events_companies_stress',
    label: 'Events & companies stress',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'Narrative backlog with private-sector utilization stress (harness overlay).'
  },
  {
    id: 'turns_transport_stress',
    label: 'Turns & transport stress',
    shockIds: ['global_slowdown', 'commodity_bust'],
    description: 'Temporal cadence stall with logistics connectivity stress (harness overlay).'
  },
  {
    id: 'research_population_stress',
    label: 'Research & population stress',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'Weak research pipeline with demographic drag (harness overlay).'
  },
  {
    id: 'modes_guardian_stress',
    label: 'Modes & guardian stress',
    shockIds: ['housing_correction', 'global_slowdown'],
    description: 'Extreme scenario difficulty with elevated guardian alerts (harness overlay).'
  },
  {
    id: 'cities_forecasting_stress',
    label: 'Cities & forecasting stress',
    shockIds: ['global_slowdown', 'housing_correction'],
    description: 'Metro pressure with downside forecast dispersion (harness overlay).'
  }
];

export function resolveMacroStressScenario(id: string): MacroStressScenario | null {
  return MACRO_STRESS_SCENARIO_CATALOG.find(s => s.id === id) ?? null;
}

export function macroStressScenarioShockIds(id: string): string[] {
  return resolveMacroStressScenario(id)?.shockIds ?? [];
}
