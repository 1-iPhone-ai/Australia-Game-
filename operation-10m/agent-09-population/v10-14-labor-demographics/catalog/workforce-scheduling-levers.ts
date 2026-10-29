import type { StrategicIndustryKind } from '../types';

export type WorkforceSchedulingLeverKind =
  | 'shift_swap_lane'
  | 'roster_flex_band'
  | 'peak_load_buffer'
  | 'seasonal_crew_pool'
  | 'on_call_rotation';

export interface WorkforceSchedulingLever {
  id: string;
  kind: WorkforceSchedulingLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  schedulingStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_SCHEDULING_LEVERS: WorkforceSchedulingLever[] = [
  {
    id: 'sched_health_nsw',
    kind: 'on_call_rotation',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    schedulingStrength: 0.73,
    label: 'Capital health on-call rotation',
    narrative: 'Rotations stabilize essential-worker participation without literal roster counts.'
  },
  {
    id: 'sched_tourism_qld',
    kind: 'seasonal_crew_pool',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'NSW'],
    schedulingStrength: 0.68,
    label: 'Coastal seasonal crew pool',
    narrative: 'Crew pools feed seasonal participation swing outlooks.'
  },
  {
    id: 'sched_agri_sa',
    kind: 'peak_load_buffer',
    targetIndustry: 'agriculture',
    hostRegions: ['SA', 'VIC', 'TAS'],
    schedulingStrength: 0.64,
    label: 'Harvest peak buffer',
    narrative: 'Peak buffers ease corridor moves during harvest swings.'
  },
  {
    id: 'sched_manufacturing_vic',
    kind: 'roster_flex_band',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    schedulingStrength: 0.7,
    label: 'Manufacturing roster flex band',
    narrative: 'Flex bands reinforce wage-automation coupling briefs.'
  },
  {
    id: 'sched_mining_wa',
    kind: 'shift_swap_lane',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD', 'NT'],
    schedulingStrength: 0.72,
    label: 'Frontier shift swap lane',
    narrative: 'Swap lanes offset cohesion-corridor coupling drag.'
  },
  {
    id: 'sched_tech_nsw_vic',
    kind: 'roster_flex_band',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    schedulingStrength: 0.76,
    label: 'Tech hybrid roster flex',
    narrative: 'Hybrid flex supports reliability index without remote headcounts.'
  },
  {
    id: 'sched_energy_nt',
    kind: 'on_call_rotation',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'QLD'],
    schedulingStrength: 0.69,
    label: 'Energy on-call rotation',
    narrative: 'Rotations align with safety levers in remote regions.'
  },
  {
    id: 'sched_trade_sa',
    kind: 'peak_load_buffer',
    targetIndustry: 'trade',
    hostRegions: ['SA', 'WA'],
    schedulingStrength: 0.61,
    label: 'Trade logistics peak buffer',
    narrative: 'Peak buffers smooth migration-shock participation buffers.'
  }
];

export function lookupWorkforceSchedulingLever(id: string): WorkforceSchedulingLever | undefined {
  return WORKFORCE_SCHEDULING_LEVERS.find(l => l.id === id);
}

export function schedulingLeversForIndustry(industry: StrategicIndustryKind): WorkforceSchedulingLever[] {
  return WORKFORCE_SCHEDULING_LEVERS.filter(l => l.targetIndustry === industry);
}

export function schedulingEaseForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_SCHEDULING_LEVERS.filter(
    l => l.targetIndustry === dominantIndustry && l.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, l) => a + l.schedulingStrength, 0) / matches.length;
}
