import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_AmenityCostRow,
  OP10M_A11_CommuteWedgeBand,
  OP10M_A11_CommuteWedgeRow,
  OP10M_A11_CorridorFlowRow,
  OP10M_A11_PeriUrbanPressureRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function wedgeBand(score: number): OP10M_A11_CommuteWedgeBand {
  if (score < 24) return 'balanced';
  if (score < 42) return 'widening';
  if (score < 60) return 'severe';
  return 'unsustainable';
}

export function op10mA11ComputeInterregionalCommuteAffordabilityWedge(args: {
  amenityCost: OP10M_A11_AmenityCostRow[];
  periUrbanPressure: OP10M_A11_PeriUrbanPressureRow[];
  corridorFlows: OP10M_A11_CorridorFlowRow[];
}): { rows: OP10M_A11_CommuteWedgeRow[]; nationalIndex: number } {
  const amenityByRegion = new Map(args.amenityCost.map((a) => [a.regionId, a]));
  const periByRegion = new Map(args.periUrbanPressure.map((p) => [p.regionId, p]));

  const outboundPressure = new Map<OP10M_A11_RegionId, number>();
  for (const flow of args.corridorFlows) {
    const prev = outboundPressure.get(flow.fromRegion) ?? 0;
    outboundPressure.set(flow.fromRegion, Math.max(prev, flow.flowPressure));
  }

  const rows: OP10M_A11_CommuteWedgeRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const amenity = amenityByRegion.get(rid);
    const peri = periByRegion.get(rid);
    const corridorLoad = outboundPressure.get(rid) ?? 22;

    const costDrag = amenity ? op10mA11Clamp(amenity.amenityScore * 0.5) : 16;
    const sprawlDrag = peri ? op10mA11Clamp(peri.pressureScore * 0.38) : 12;
    const commuteDrag = op10mA11Clamp(corridorLoad * 0.42);

    const wedgeScore = op10mA11Clamp(costDrag + sprawlDrag + commuteDrag * 0.62);
    weighted += wedgeScore;

    const pressures: string[] = [];
    if (amenity && (amenity.band === 'strained' || amenity.band === 'crisis')) pressures.push('amenity cost');
    if (peri && (peri.band === 'sprawl_risk' || peri.band === 'unchecked')) pressures.push('peri-urban stretch');
    if (corridorLoad >= 58) pressures.push('corridor commute load');
    if (!pressures.length) pressures.push('contained commute wedge');

    rows.push({
      regionId: rid,
      wedgeScore: op10mA11Round(wedgeScore),
      band: wedgeBand(wedgeScore),
      pressures: pressures.slice(0, 3),
      narrative: `${rid} commute affordability wedge ${wedgeBand(wedgeScore)} (${op10mA11Round(wedgeScore)}); ${pressures.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.wedgeScore - a.wedgeScore), nationalIndex };
}

export function op10mA11RegionsWithSevereCommuteWedge(rows: OP10M_A11_CommuteWedgeRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'severe' || r.band === 'unsustainable').map((r) => r.regionId);
}

export function op10mA11CommuteWedgeWidening(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 50;
  return currentIndex >= 44 && currentIndex > priorIndex + 6;
}
