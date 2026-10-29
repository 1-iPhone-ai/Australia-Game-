import type { MigrationShockKind } from '../types';

export type LaborStressScenarioId =
  | 'ld_sc_mining_supercycle'
  | 'ld_sc_housing_affordability_crunch'
  | 'ld_sc_automation_displacement'
  | 'ld_sc_metro_talent_war'
  | 'ld_sc_frontier_recovery'
  | 'ld_sc_tourism_reopening'
  | 'ld_sc_energy_transition_skills'
  | 'ld_sc_essential_access_crisis';

export interface LaborStressScenario {
  id: LaborStressScenarioId;
  title: string;
  narrative: string;
  primaryRegions: string[];
  expectedShockKinds: MigrationShockKind[];
  wagePressureBias: number;
  migrationFlowBias: number;
  employmentLinkageBias: number;
  tags: readonly string[];
}

export const LABOR_STRESS_SCENARIO_CATALOG: LaborStressScenario[] = [
  {
    id: 'ld_sc_mining_supercycle',
    title: 'Mining supercycle labor pull',
    narrative: 'Sustained mining effectiveOutput concentrates inflow pressure on WA and QLD without inventing headcounts.',
    primaryRegions: ['WA', 'QLD'],
    expectedShockKinds: ['resource_boom_inflow'],
    wagePressureBias: 6,
    migrationFlowBias: 10,
    employmentLinkageBias: 4,
    tags: ['agent-09', 'v10.14', 'mining']
  },
  {
    id: 'ld_sc_housing_affordability_crunch',
    title: 'Housing affordability crunch',
    narrative: 'Severe household budget pressure triggers outflow shocks in metro regions.',
    primaryRegions: ['NSW', 'VIC'],
    expectedShockKinds: ['housing_affordability_outflow'],
    wagePressureBias: 8,
    migrationFlowBias: -12,
    employmentLinkageBias: -3,
    tags: ['agent-09', 'v10.14', 'households']
  },
  {
    id: 'ld_sc_automation_displacement',
    title: 'Automation displacement wave',
    narrative: 'High capability automationShift reduces employment linkage while wage paths bifurcate by strain.',
    primaryRegions: ['NSW', 'VIC', 'QLD'],
    expectedShockKinds: [],
    wagePressureBias: 4,
    migrationFlowBias: -4,
    employmentLinkageBias: -8,
    tags: ['agent-09', 'v10.14', 'automation']
  },
  {
    id: 'ld_sc_metro_talent_war',
    title: 'Metro talent war',
    narrative: 'Tech output with manageable budgets pulls talent toward NSW/VIC metros.',
    primaryRegions: ['NSW', 'VIC'],
    expectedShockKinds: ['metro_talent_pull'],
    wagePressureBias: 5,
    migrationFlowBias: 7,
    employmentLinkageBias: 2,
    tags: ['agent-09', 'v10.14', 'technology']
  },
  {
    id: 'ld_sc_frontier_recovery',
    title: 'Frontier recovery redirect',
    narrative: 'National household shock sensitivity redirects modest recovery inflow to a frontier region.',
    primaryRegions: ['NT', 'TAS', 'SA'],
    expectedShockKinds: ['frontier_recovery_inflow'],
    wagePressureBias: 0,
    migrationFlowBias: 5,
    employmentLinkageBias: 1,
    tags: ['agent-09', 'v10.14', 'migration']
  },
  {
    id: 'ld_sc_tourism_reopening',
    title: 'Tourism reopening surge',
    narrative: 'Tourism effectiveOutput recovery lifts employment linkage in QLD and TAS.',
    primaryRegions: ['QLD', 'TAS'],
    expectedShockKinds: [],
    wagePressureBias: 3,
    migrationFlowBias: 4,
    employmentLinkageBias: 5,
    tags: ['agent-09', 'v10.14', 'tourism']
  },
  {
    id: 'ld_sc_energy_transition_skills',
    title: 'Energy transition skills gap',
    narrative: 'Energy and manufacturing mismatch elevates wage pressure under workforce strain.',
    primaryRegions: ['SA', 'VIC', 'WA'],
    expectedShockKinds: [],
    wagePressureBias: 7,
    migrationFlowBias: 2,
    employmentLinkageBias: -2,
    tags: ['agent-09', 'v10.14', 'energy']
  },
  {
    id: 'ld_sc_essential_access_crisis',
    title: 'Essential access crisis',
    narrative: 'Essentials gap triggers outflow shocks and weakens employment fit.',
    primaryRegions: ['NSW', 'QLD', 'NT'],
    expectedShockKinds: ['essential_access_outflow'],
    wagePressureBias: 5,
    migrationFlowBias: -9,
    employmentLinkageBias: -5,
    tags: ['agent-09', 'v10.14', 'households']
  }
];

export function lookupLaborStressScenario(id: string): LaborStressScenario | null {
  return LABOR_STRESS_SCENARIO_CATALOG.find(s => s.id === id) ?? null;
}

export function laborStressScenariosForRegion(regionId: string): LaborStressScenario[] {
  return LABOR_STRESS_SCENARIO_CATALOG.filter(s => s.primaryRegions.includes(regionId));
}
