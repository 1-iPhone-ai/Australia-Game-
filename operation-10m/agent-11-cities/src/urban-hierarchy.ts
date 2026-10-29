import {
  OP10M_A11_CORE_REGIONS,
  type OP10M_A11_CityGrowthSlice,
  type OP10M_A11_PrimateBand,
  type OP10M_A11_RegionId,
  type OP10M_A11_UrbanHierarchyRow,
} from './types.ts';
import { op10mA11Clamp, op10mA11Round } from './constants.ts';

function primateBand(index: number): OP10M_A11_PrimateBand {
  if (index < 22) return 'decentralized';
  if (index < 40) return 'balanced';
  if (index < 62) return 'concentrated';
  return 'hyper_concentrated';
}

export function op10mA11ComputeUrbanHierarchy(cities: OP10M_A11_CityGrowthSlice[]): OP10M_A11_UrbanHierarchyRow[] {
  const rows: OP10M_A11_UrbanHierarchyRow[] = [];

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const regionCities = cities.filter((c) => c.regionId === rid);
    if (!regionCities.length) {
      rows.push({
        regionId: rid,
        primateIndex: 30,
        primateBand: 'balanced',
        gatewayShare: 0,
        secondaryMomentum: 40,
        narrative: `${rid}: no tracked cities — neutral hierarchy prior.`,
      });
      continue;
    }

    const gateways = regionCities.filter((c) => c.gateway);
    const secondaries = regionCities.filter((c) => !c.gateway);
    const totalGrowth = regionCities.reduce((a, c) => a + c.growthScore, 0) || 1;
    const gatewayGrowth = gateways.reduce((a, c) => a + c.growthScore, 0);
    const gatewayShare = op10mA11Clamp((gatewayGrowth / totalGrowth) * 100);
    const secondaryMomentum =
      secondaries.length > 0
        ? secondaries.reduce((a, c) => a + c.growthScore, 0) / secondaries.length
        : gatewayGrowth / Math.max(1, gateways.length);

    const top = Math.max(...regionCities.map((c) => c.growthScore));
    const restAvg =
      regionCities.length > 1
        ? (totalGrowth - top) / (regionCities.length - 1)
        : top * 0.6;
    const primateIndex = op10mA11Clamp((top / Math.max(1, restAvg) - 1) * 28 + gatewayShare * 0.35);
    const band = primateBand(primateIndex);

    rows.push({
      regionId: rid,
      primateIndex: op10mA11Round(primateIndex),
      primateBand: band,
      gatewayShare: op10mA11Round(gatewayShare),
      secondaryMomentum: op10mA11Round(secondaryMomentum),
      narrative: `${rid} primate ${band} (index ${op10mA11Round(primateIndex)}); gateway share ${op10mA11Round(gatewayShare)}%.`,
    });
  }

  return rows;
}

export function op10mA11NationalPrimateIndex(hierarchy: OP10M_A11_UrbanHierarchyRow[]): number {
  if (!hierarchy.length) return 0;
  const avg = hierarchy.reduce((a, h) => a + h.primateIndex, 0) / hierarchy.length;
  const hyper = hierarchy.filter((h) => h.primateBand === 'hyper_concentrated' || h.primateBand === 'concentrated').length;
  return op10mA11Round(op10mA11Clamp(avg + hyper * 4));
}
