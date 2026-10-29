import type { TransportStressScenario } from '../types.ts';
import { TRANSPORT_SCENARIOS_ROUND2 } from './scenarios-round2.ts';
import { TRANSPORT_SCENARIOS_ROUND3 } from './scenarios-round3.ts';
import { TRANSPORT_SCENARIOS_ROUND4 } from './scenarios-round4.ts';
import { TRANSPORT_SCENARIOS_ROUND5 } from './scenarios-round5.ts';
import { TRANSPORT_SCENARIOS_ROUND6 } from './scenarios-round6.ts';
import { TRANSPORT_SCENARIOS_ROUND7 } from './scenarios-round7.ts';
import { TRANSPORT_SCENARIOS_ROUND8 } from './scenarios-round8.ts';
import { TRANSPORT_SCENARIOS_ROUND9 } from './scenarios-round9.ts';
import { TRANSPORT_SCENARIOS_ROUND10 } from './scenarios-round10.ts';
import { TRANSPORT_SCENARIOS_ROUND11 } from './scenarios-round11.ts';
import { TRANSPORT_SCENARIOS_ROUND12 } from './scenarios-round12.ts';
import { TRANSPORT_SCENARIOS_ROUND13 } from './scenarios-round13.ts';
import { TRANSPORT_SCENARIOS_ROUND14 } from './scenarios-round14.ts';
import { TRANSPORT_SCENARIOS_ROUND15 } from './scenarios-round15.ts';
import { TRANSPORT_SCENARIOS_ROUND16 } from './scenarios-round16.ts';
import { TRANSPORT_SCENARIOS_ROUND17 } from './scenarios-round17.ts';
import { TRANSPORT_SCENARIOS_ROUND18 } from './scenarios-round18.ts';
import { TRANSPORT_SCENARIOS_ROUND19 } from './scenarios-round19.ts';
import { TRANSPORT_SCENARIOS_ROUND20 } from './scenarios-round20.ts';

/** Scale-wave scenario library — measurable utilization + condition penalties. */
export const TRANSPORT_STRESS_SCENARIOS: TransportStressScenario[] = [
  {
    id: 'scn_nsw_flood_m1',
    label: 'NSW M1 Flood Closure',
    description: 'Heavy rain closes Pacific Motorway segments; freight detours.',
    targetRegions: ['NSW'],
    networkKind: 'freight',
    utilizationAdd: 0.22,
    conditionPenaltySteps: 1,
    affectedCategories: ['road'],
  },
  {
    id: 'scn_vic_port_strike',
    label: 'Melbourne Port Industrial Action',
    description: 'Stevedoring strike reduces container throughput.',
    targetRegions: ['VIC'],
    networkKind: 'trade',
    utilizationAdd: 0.35,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'logistics'],
  },
  {
    id: 'scn_qld_cyclone_coast',
    label: 'Queensland Coastal Cyclone',
    description: 'Brisbane port and Bruce Highway disruption.',
    targetRegions: ['QLD'],
    networkKind: 'trade',
    utilizationAdd: 0.28,
    conditionPenaltySteps: 1,
    affectedCategories: ['road', 'port'],
  },
  {
    id: 'scn_wa_pilbara_heat',
    label: 'Pilbara Extreme Heat Slow Orders',
    description: 'Rail and road speed restrictions on iron-ore corridors.',
    targetRegions: ['WA'],
    networkKind: 'freight',
    utilizationAdd: 0.18,
    conditionPenaltySteps: 1,
    affectedCategories: ['rail', 'road'],
  },
  {
    id: 'scn_sa_rail_maintenance',
    label: 'Adelaide Rail Track Maintenance Blitz',
    description: 'Freight corridor possession windows.',
    targetRegions: ['SA'],
    networkKind: 'freight',
    utilizationAdd: 0.15,
    conditionPenaltySteps: 1,
    affectedCategories: ['rail'],
  },
  {
    id: 'scn_nt_wet_season',
    label: 'Top End Wet Season Isolation',
    description: 'Stuart Highway flooding and Darwin port delays.',
    targetRegions: ['NT'],
    networkKind: 'freight',
    utilizationAdd: 0.25,
    conditionPenaltySteps: 1,
    affectedCategories: ['road', 'port'],
  },
  {
    id: 'scn_tas_bass_ferry',
    label: 'Bass Strait Ferry Capacity Cut',
    description: 'Reduced sailings constrain island logistics.',
    targetRegions: ['TAS', 'VIC'],
    networkKind: 'freight',
    utilizationAdd: 0.2,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics', 'port'],
  },
  {
    id: 'scn_act_bushfire_smoke',
    label: 'Capital Region Bushfire Smoke',
    description: 'Hume/Barton highway visibility restrictions.',
    targetRegions: ['ACT', 'NSW'],
    networkKind: 'mobility',
    utilizationAdd: 0.12,
    conditionPenaltySteps: 1,
    affectedCategories: ['road'],
  },
  {
    id: 'scn_national_fuel_spike',
    label: 'National Diesel Price Spike',
    description: 'Road freight cost pressure without physical damage.',
    targetRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'],
    networkKind: 'freight',
    utilizationAdd: 0.1,
    conditionPenaltySteps: 0,
    affectedCategories: ['road', 'logistics'],
  },
  {
    id: 'scn_east_coast_labour',
    label: 'East Coast Logistics Labour Shortage',
    description: 'Warehouse and port staffing gaps.',
    targetRegions: ['NSW', 'VIC', 'QLD'],
    networkKind: 'trade',
    utilizationAdd: 0.16,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics', 'port'],
  },
  {
    id: 'scn_wa_iron_ore_surge',
    label: 'Iron Ore Export Surge',
    description: 'Demand spike without new capacity — congestion.',
    targetRegions: ['WA'],
    networkKind: 'trade',
    utilizationAdd: 0.32,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'rail'],
  },
  {
    id: 'scn_nsw_interstate_rail_fault',
    label: 'NSW Interstate Rail Signal Fault',
    description: 'Sydney–Brisbane path capacity cut.',
    targetRegions: ['NSW', 'QLD'],
    networkKind: 'freight',
    utilizationAdd: 0.21,
    conditionPenaltySteps: 1,
    affectedCategories: ['rail'],
  },
  {
    id: 'scn_vic_regional_flood',
    label: 'Gippsland Regional Flood',
    description: 'Monash feed and regional road damage.',
    targetRegions: ['VIC'],
    networkKind: 'mobility',
    utilizationAdd: 0.14,
    conditionPenaltySteps: 1,
    affectedCategories: ['road'],
  },
  {
    id: 'scn_qld_coal_export_queue',
    label: 'Queensland Coal Export Queue',
    description: 'Bulk vessel queue at Hay Point / Gladstone pressure.',
    targetRegions: ['QLD'],
    networkKind: 'trade',
    utilizationAdd: 0.26,
    conditionPenaltySteps: 0,
    affectedCategories: ['port'],
  },
  {
    id: 'scn_sa_desal_power',
    label: 'SA Grid Event — Logistics Cold Chain Risk',
    description: 'Power volatility hits refrigerated logistics.',
    targetRegions: ['SA'],
    networkKind: 'freight',
    utilizationAdd: 0.11,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics'],
  },
  {
    id: 'scn_deferred_maintenance_wave',
    label: 'Deferred Maintenance Wave',
    description: 'Nationwide backlog catch-up — slower effective conditions.',
    targetRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'],
    utilizationAdd: 0.08,
    conditionPenaltySteps: 1,
  },
  ...TRANSPORT_SCENARIOS_ROUND2,
  ...TRANSPORT_SCENARIOS_ROUND3,
  ...TRANSPORT_SCENARIOS_ROUND4,
  ...TRANSPORT_SCENARIOS_ROUND5,
  ...TRANSPORT_SCENARIOS_ROUND6,
  ...TRANSPORT_SCENARIOS_ROUND7,
  ...TRANSPORT_SCENARIOS_ROUND8,
  ...TRANSPORT_SCENARIOS_ROUND9,
  ...TRANSPORT_SCENARIOS_ROUND10,
  ...TRANSPORT_SCENARIOS_ROUND11,
  ...TRANSPORT_SCENARIOS_ROUND12,
  ...TRANSPORT_SCENARIOS_ROUND13,
  ...TRANSPORT_SCENARIOS_ROUND14,
  ...TRANSPORT_SCENARIOS_ROUND15,
  ...TRANSPORT_SCENARIOS_ROUND16,
  ...TRANSPORT_SCENARIOS_ROUND17,
  ...TRANSPORT_SCENARIOS_ROUND18,
  ...TRANSPORT_SCENARIOS_ROUND19,
  ...TRANSPORT_SCENARIOS_ROUND20,
];

export function getScenarioById(id: string): TransportStressScenario | undefined {
  return TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === id);
}

export function scenariosForRegion(regionId: string): TransportStressScenario[] {
  return TRANSPORT_STRESS_SCENARIOS.filter((s) => s.targetRegions.includes(regionId as never));
}
