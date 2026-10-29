import {
  OP10M_A11_CORE_REGIONS,
  type OP10M_A11_HubRole,
  type OP10M_A11_LinkageHubProfile,
  type OP10M_A11_RegionId,
  type OP10M_A11_RegionalLinkageEdge,
} from './types.ts';
import { op10mA11Clamp, op10mA11Round } from './constants.ts';

function hubRole(weighted: number, degree: number): OP10M_A11_HubRole {
  if (weighted >= 62 && degree >= 4) return 'national_hub';
  if (weighted >= 42 && degree >= 3) return 'regional_hub';
  if (degree >= 2) return 'connector';
  return 'peripheral';
}

export function op10mA11AnalyzeLinkageHubs(
  linkages: OP10M_A11_RegionalLinkageEdge[],
): OP10M_A11_LinkageHubProfile[] {
  const degree = {} as Record<OP10M_A11_RegionId, number>;
  const weight = {} as Record<OP10M_A11_RegionId, number>;
  for (const rid of OP10M_A11_CORE_REGIONS) {
    degree[rid] = 0;
    weight[rid] = 0;
  }

  for (const edge of linkages) {
    degree[edge.fromRegion] += 1;
    degree[edge.toRegion] += 1;
    weight[edge.fromRegion] += edge.strength;
    weight[edge.toRegion] += edge.strength;
  }

  const maxWeight = Math.max(...OP10M_A11_CORE_REGIONS.map((r) => weight[r]), 1);

  return OP10M_A11_CORE_REGIONS.map((regionId) => {
    const deg = degree[regionId];
    const weightedCentrality = op10mA11Clamp((weight[regionId] / maxWeight) * 100);
    const role = hubRole(weightedCentrality, deg);
    const isolationScore = op10mA11Clamp(100 - weightedCentrality * 0.75 - deg * 6);
    return {
      regionId,
      degree: deg,
      weightedCentrality: op10mA11Round(weightedCentrality),
      role,
      isolationScore: op10mA11Round(isolationScore),
      narrative: `${regionId} linkage role ${role} (degree ${deg}, isolation ${op10mA11Round(isolationScore)}).`,
    };
  }).sort((a, b) => b.weightedCentrality - a.weightedCentrality);
}

export function op10mA11OverloadedHubs(hubs: OP10M_A11_LinkageHubProfile[]): OP10M_A11_LinkageHubProfile[] {
  return hubs.filter(
    (h) =>
      (h.role === 'national_hub' || h.role === 'regional_hub') &&
      h.weightedCentrality >= 55 &&
      h.degree >= 3,
  );
}

export function op10mA11DeeplyIsolatedRegions(hubs: OP10M_A11_LinkageHubProfile[]): OP10M_A11_RegionId[] {
  return hubs.filter((h) => h.isolationScore >= 72 && h.role === 'peripheral').map((h) => h.regionId);
}
