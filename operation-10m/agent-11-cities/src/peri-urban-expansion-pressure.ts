import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CityGrowthSlice,
  OP10M_A11_CorridorFlowRow,
  OP10M_A11_PeriUrbanPressureBand,
  OP10M_A11_PeriUrbanPressureRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

const GROWTH_SPRAWL: Record<OP10M_A11_CityGrowthSlice['growthBand'], number> = {
  contracting: 6,
  slow: 14,
  steady: 28,
  fast: 46,
  surging: 62,
};

function periUrbanBand(score: number): OP10M_A11_PeriUrbanPressureBand {
  if (score < 26) return 'contained';
  if (score < 46) return 'expanding';
  if (score < 66) return 'sprawl_risk';
  return 'unchecked';
}

export function op10mA11ComputePeriUrbanExpansionPressure(args: {
  cities: OP10M_A11_CityGrowthSlice[];
  corridorFlows: OP10M_A11_CorridorFlowRow[];
}): OP10M_A11_PeriUrbanPressureRow[] {
  const inboundFlow = new Map<OP10M_A11_RegionId, number>();
  for (const flow of args.corridorFlows) {
    inboundFlow.set(flow.toRegion, (inboundFlow.get(flow.toRegion) ?? 0) + flow.flowPressure * 0.35);
  }

  const rows: OP10M_A11_PeriUrbanPressureRow[] = [];

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const regionCities = args.cities.filter((c) => c.regionId === rid);
    const avgSprawl =
      regionCities.length > 0
        ? regionCities.reduce((a, c) => a + GROWTH_SPRAWL[c.growthBand], 0) / regionCities.length
        : 18;
    const corridorPull = op10mA11Clamp(inboundFlow.get(rid) ?? 0);
    const nonGatewayPenalty = regionCities.filter((c) => !c.gateway).length * 4;

    const pressureScore = op10mA11Clamp(avgSprawl * 0.62 + corridorPull * 0.48 + nonGatewayPenalty);
    const band = periUrbanBand(pressureScore);

    rows.push({
      regionId: rid,
      pressureScore: op10mA11Round(pressureScore),
      band,
      corridorPull: op10mA11Round(corridorPull),
      metroCount: regionCities.length,
      narrative: `${rid} peri-urban ${band} (pressure ${op10mA11Round(pressureScore)}); corridor pull ${op10mA11Round(corridorPull)}.`,
    });
  }

  return rows.sort((a, b) => b.pressureScore - a.pressureScore);
}

export function op10mA11NationalPeriUrbanPressureIndex(rows: OP10M_A11_PeriUrbanPressureRow[]): number {
  if (!rows.length) return 0;
  const avg = rows.reduce((a, r) => a + r.pressureScore, 0) / rows.length;
  const hot = rows.filter((r) => r.band === 'sprawl_risk' || r.band === 'unchecked').length;
  return op10mA11Round(op10mA11Clamp(avg + hot * 5));
}

export function op10mA11RegionsWithPeriUrbanSprawl(rows: OP10M_A11_PeriUrbanPressureRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'sprawl_risk' || r.band === 'unchecked').map((r) => r.regionId);
}
