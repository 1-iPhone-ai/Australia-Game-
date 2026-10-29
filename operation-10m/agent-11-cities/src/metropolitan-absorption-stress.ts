import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_AbsorptionStressBand,
  OP10M_A11_AbsorptionStressRow,
  OP10M_A11_CityGrowthSlice,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

const GROWTH_LOAD: Record<OP10M_A11_CityGrowthSlice['growthBand'], number> = {
  contracting: 8,
  slow: 18,
  steady: 32,
  fast: 52,
  surging: 68,
};

function absorptionBand(stress: number): OP10M_A11_AbsorptionStressBand {
  if (stress < 28) return 'comfortable';
  if (stress < 48) return 'tightening';
  if (stress < 68) return 'strained';
  return 'breached';
}

export function op10mA11ComputeMetropolitanAbsorptionStress(
  cities: OP10M_A11_CityGrowthSlice[],
): OP10M_A11_AbsorptionStressRow[] {
  const rows: OP10M_A11_AbsorptionStressRow[] = [];

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const regionCities = cities.filter((c) => c.regionId === rid);
    if (!regionCities.length) {
      rows.push({
        regionId: rid,
        stressScore: 22,
        band: 'comfortable',
        minHeadroom: 50,
        gatewayLoad: 0,
        narrative: `${rid} absorption comfortable — no tracked metros; neutral prior.`,
      });
      continue;
    }

    const minHeadroom = Math.min(...regionCities.map((c) => c.absorptionHeadroom));
    const avgLoad =
      regionCities.reduce((a, c) => a + GROWTH_LOAD[c.growthBand], 0) / regionCities.length;
    const gatewayLoad = regionCities
      .filter((c) => c.gateway)
      .reduce((a, c) => a + GROWTH_LOAD[c.growthBand] * 1.15, 0);

    const headroomPenalty = op10mA11Clamp(72 - minHeadroom);
    const stressScore = op10mA11Clamp(avgLoad * 0.55 + headroomPenalty * 0.65 + gatewayLoad * 0.08);

    rows.push({
      regionId: rid,
      stressScore: op10mA11Round(stressScore),
      band: absorptionBand(stressScore),
      minHeadroom: op10mA11Round(minHeadroom),
      gatewayLoad: op10mA11Round(gatewayLoad),
      narrative: `${rid} absorption ${absorptionBand(stressScore)} (stress ${op10mA11Round(stressScore)}); min headroom ${op10mA11Round(minHeadroom)}.`,
    });
  }

  return rows.sort((a, b) => b.stressScore - a.stressScore);
}

export function op10mA11RegionsWithAbsorptionBreach(rows: OP10M_A11_AbsorptionStressRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'breached' || r.band === 'strained').map((r) => r.regionId);
}

export function op10mA11NationalMetropolitanSaturation(rows: OP10M_A11_AbsorptionStressRow[]): number {
  if (!rows.length) return 0;
  const avg = rows.reduce((a, r) => a + r.stressScore, 0) / rows.length;
  const breached = rows.filter((r) => r.band === 'breached').length;
  return op10mA11Round(op10mA11Clamp(avg + breached * 6));
}
