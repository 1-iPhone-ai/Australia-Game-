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
  },
  {
    id: 'command_automation_stress',
    label: 'Command & automation stress',
    shockIds: ['credit_contraction', 'global_slowdown'],
    description: 'Crisis command posture with stalled automation throughput (harness overlay).'
  },
  {
    id: 'team_replay_stress',
    label: 'Team AI & replay stress',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'Fractured team cohesion with persistent replay stress memory (harness overlay).'
  },
  {
    id: 'memory_dashboard_stress',
    label: 'Memory & dashboards stress',
    shockIds: ['global_slowdown', 'housing_correction'],
    description: 'Runaway memory drift with stale dashboard refresh (harness overlay).'
  },
  {
    id: 'ui_utilities_stress',
    label: 'UI & utilities stress',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'Degraded UI shell with rolling utility outages (harness overlay).'
  },
  {
    id: 'logistics_negotiation_stress',
    label: 'Logistics & negotiation stress',
    shockIds: ['global_slowdown', 'terms_of_trade_squeeze'],
    description: 'Gridlocked trade logistics with entrenched negotiation deadlock (harness overlay).'
  },
  {
    id: 'confidence_capex_stress',
    label: 'Confidence & capex stress',
    shockIds: ['credit_contraction', 'housing_correction'],
    description: 'Collapsed consumer confidence with frozen private capex pipeline (harness overlay).'
  },
  {
    id: 'monetary_rental_stress',
    label: 'Monetary & rental stress',
    shockIds: ['high_inflation', 'housing_correction'],
    description: 'Restrictive monetary stance with severe rental pressure (harness overlay).'
  },
  {
    id: 'climate_forecast_stress',
    label: 'Climate & forecast stress',
    shockIds: ['drought_ag_cycle', 'global_slowdown'],
    description: 'Disruptive climate transition with wide forecast dispersion (harness overlay).'
  },
  {
    id: 'accessibility_timeline_stress',
    label: 'Accessibility & timeline stress',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'Failing UI accessibility with broken history timeline continuity (harness overlay).'
  },
  {
    id: 'liquidity_maps_stress',
    label: 'Liquidity & maps stress',
    shockIds: ['credit_contraction', 'global_slowdown'],
    description: 'Frozen system liquidity with distorted maps telemetry (harness overlay).'
  },
  {
    id: 'gameplay_archive_stress',
    label: 'Gameplay & archive stress',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'Gridlocked strategic gameplay with corrupt history archive integrity (harness overlay).'
  },
  {
    id: 'integration_cadence_stress',
    label: 'Integration & cadence stress',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'Fractured cross-system integration with chaotic turn cadence drift (harness overlay).'
  },
  {
    id: 'research_budget_stress',
    label: 'Research & budget stress',
    shockIds: ['credit_contraction', 'global_slowdown'],
    description: 'Collapsed research momentum with exhausted public budget capex room (harness overlay).'
  },
  {
    id: 'mode_supply_stress',
    label: 'Mode & supply stress',
    shockIds: ['global_slowdown', 'commodity_bust'],
    description: 'Chaotic mode scenario shift with broken corporate supply chains (harness overlay).'
  },
  {
    id: 'event_demographic_stress',
    label: 'Event & demographic stress',
    shockIds: ['global_slowdown', 'drought_ag_cycle'],
    description: 'Runaway event cascade with adverse demographic shift (harness overlay).'
  },
  {
    id: 'expectations_metro_stress',
    label: 'Expectations & metro stress',
    shockIds: ['high_inflation', 'housing_correction'],
    description: 'Deanchored inflation expectations with stalled metro growth (harness overlay).'
  },
  {
    id: 'transport_energy_stress',
    label: 'Transport & energy stress',
    shockIds: ['commodity_bust', 'drought_ag_cycle'],
    description: 'Collapsed transport throughput with disruptive energy transition pace (harness overlay).'
  },
  {
    id: 'housing_trade_stress',
    label: 'Housing & trade stress',
    shockIds: ['housing_correction', 'global_slowdown'],
    description: 'Crushed housing affordability with dislocated trade exposure (harness overlay).'
  },
  {
    id: 'guardian_command_stress',
    label: 'Guardian & command stress',
    shockIds: ['credit_contraction', 'global_slowdown'],
    description: 'Red guardian vigilance with broken command coordination (harness overlay).'
  },
  {
    id: 'team_memory_stress',
    label: 'Team AI & memory stress',
    shockIds: ['high_inflation', 'terms_of_trade_squeeze'],
    description: 'Fractured team AI cohesion with volatile memory retention (harness overlay).'
  },
  {
    id: 'automation_forecast_stress',
    label: 'Automation & forecast stress',
    shockIds: ['stimulus_bounce', 'mining_supercycle'],
    description: 'Collapsed automation throughput with runaway forecast calibration bias (harness overlay).'
  },
  {
    id: 'governance_projection_stress',
    label: 'Governance & projection stress',
    shockIds: ['terms_of_trade_squeeze', 'global_slowdown'],
    description: 'Escalated automation idle governance with runaway forecast projection drift (harness overlay).'
  },
  {
    id: 'wave36_export_projection_stress',
    label: 'Wave 36 export & projection stress',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'Blocked automation wave 36 export with drifted forecast wave 36 projection sync (harness overlay).'
  }
];

export function resolveMacroStressScenario(id: string): MacroStressScenario | null {
  return MACRO_STRESS_SCENARIO_CATALOG.find(s => s.id === id) ?? null;
}

export function macroStressScenarioShockIds(id: string): string[] {
  return resolveMacroStressScenario(id)?.shockIds ?? [];
}
