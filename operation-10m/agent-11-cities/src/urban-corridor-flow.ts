import {
  OP10M_A11_CORE_REGIONS,
  type OP10M_A11_CityGrowthSlice,
  type OP10M_A11_FlowPressureBand,
  type OP10M_A11_IntercityLinkSlice,
  type OP10M_A11_RegionId,
  type OP10M_A11_CorridorFlowRow,
  type OP10M_A11_RegionalLinkageEdge,
} from './types.ts';
import { op10mA11Clamp, op10mA11Round } from './constants.ts';

function flowBand(pressure: number): OP10M_A11_FlowPressureBand {
  if (pressure < 28) return 'light';
  if (pressure < 48) return 'moderate';
  if (pressure < 68) return 'heavy';
  return 'surge';
}

function regionUrbanPulse(cities: OP10M_A11_CityGrowthSlice[], rid: OP10M_A11_RegionId): number {
  const rows = cities.filter((c) => c.regionId === rid);
  if (!rows.length) return 45;
  return rows.reduce((a, c) => a + c.growthScore, 0) / rows.length;
}

export function op10mA11ComputeCorridorFlows(args: {
  cities: OP10M_A11_CityGrowthSlice[];
  links: OP10M_A11_IntercityLinkSlice[];
  linkages: OP10M_A11_RegionalLinkageEdge[];
}): OP10M_A11_CorridorFlowRow[] {
  const pulse = {} as Record<OP10M_A11_RegionId, number>;
  for (const rid of OP10M_A11_CORE_REGIONS) pulse[rid] = regionUrbanPulse(args.cities, rid);

  const linkageByKey = new Map<string, OP10M_A11_RegionalLinkageEdge>();
  for (const l of args.linkages) {
    linkageByKey.set([l.fromRegion, l.toRegion].sort().join('::'), l);
  }

  const acc = new Map<string, { pressure: number; gradient: number; n: number }>();

  for (const link of args.links) {
    if (link.regionA === link.regionB) continue;
    const key = [link.regionA, link.regionB].sort().join('::');
    const grad = Math.abs(pulse[link.regionA] - pulse[link.regionB]);
    const util = link.utilization;
    const healthDrag =
      link.health === 'severed' ? 0.2 : link.health === 'degraded' ? 0.65 : link.health === 'operational' ? 0.9 : 1;
    const add = op10mA11Clamp(util * 0.58 * healthDrag + grad * 0.38 + (link.strategic ? 12 : 0));
    const prev = acc.get(key) || { pressure: 0, gradient: 0, n: 0 };
    prev.pressure += add;
    prev.gradient = Math.max(prev.gradient, grad);
    prev.n += 1;
    acc.set(key, prev);
  }

  const out: OP10M_A11_CorridorFlowRow[] = [];
  for (const [key, val] of acc) {
    const [fromRegion, toRegion] = key.split('::') as [OP10M_A11_RegionId, OP10M_A11_RegionId];
    const linkage = linkageByKey.get(key);
    const linkageBoost = linkage ? linkage.strength * 0.08 : 0;
    const flowPressure = op10mA11Clamp(val.pressure / Math.max(1, val.n) + linkageBoost);
    const band = flowBand(flowPressure);
    out.push({
      fromRegion,
      toRegion,
      flowPressure: op10mA11Round(flowPressure),
      band,
      growthGradient: op10mA11Round(val.gradient),
      explanation: `${fromRegion}↔${toRegion} corridor ${band} (pressure ${op10mA11Round(flowPressure)}, gradient ${op10mA11Round(val.gradient)}).`,
    });
  }

  return out.sort((a, b) => b.flowPressure - a.flowPressure);
}

export function op10mA11MaxCorridorFlow(flows: OP10M_A11_CorridorFlowRow[]): number {
  if (!flows.length) return 0;
  return Math.max(...flows.map((f) => f.flowPressure));
}

export function op10mA11SurgeCorridors(flows: OP10M_A11_CorridorFlowRow[]): OP10M_A11_CorridorFlowRow[] {
  return flows.filter((f) => f.band === 'surge' || f.band === 'heavy');
}
