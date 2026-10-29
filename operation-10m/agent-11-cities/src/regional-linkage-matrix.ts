import {
  OP10M_A11_CORE_REGIONS,
  type OP10M_A11_IntercityLinkSlice,
  type OP10M_A11_LinkageBand,
  type OP10M_A11_RegionId,
  type OP10M_A11_RegionalLinkageEdge,
} from './types.ts';
import { op10mA11Clamp, op10mA11Round } from './constants.ts';

function linkageBand(strength: number): OP10M_A11_LinkageBand {
  if (strength < 18) return 'weak';
  if (strength < 38) return 'moderate';
  if (strength < 58) return 'strong';
  return 'structural';
}

export function op10mA11BuildRegionalLinkageMatrix(
  links: OP10M_A11_IntercityLinkSlice[],
): OP10M_A11_RegionalLinkageEdge[] {
  const acc = new Map<string, { strength: number; count: number }>();

  for (const link of links) {
    if (link.regionA === link.regionB) continue;
    const key = [link.regionA, link.regionB].sort().join('::');
    const healthPenalty =
      link.health === 'severed' ? 0.15 : link.health === 'degraded' ? 0.55 : link.health === 'operational' ? 0.85 : 1;
    const add = op10mA11Clamp(link.utilization * 0.45 * healthPenalty + (link.strategic ? 8 : 0));
    const prev = acc.get(key) || { strength: 0, count: 0 };
    prev.strength += add;
    prev.count += 1;
    acc.set(key, prev);
  }

  const out: OP10M_A11_RegionalLinkageEdge[] = [];
  for (const [key, val] of acc) {
    const [fromRegion, toRegion] = key.split('::') as [OP10M_A11_RegionId, OP10M_A11_RegionId];
    const strength = op10mA11Clamp(val.strength / Math.max(1, val.count) + val.count * 2);
    out.push({
      fromRegion,
      toRegion,
      strength: op10mA11Round(strength),
      band: linkageBand(strength),
      viaLinks: val.count,
    });
  }

  return out.sort((a, b) => b.strength - a.strength);
}

export function op10mA11LinkageFragilityIndex(
  linkages: OP10M_A11_RegionalLinkageEdge[],
  corridorStress: number,
): number {
  const pairsPossible = (OP10M_A11_CORE_REGIONS.length * (OP10M_A11_CORE_REGIONS.length - 1)) / 2;
  const weakShare = linkages.filter((l) => l.band === 'weak').length / Math.max(1, pairsPossible);
  const strongShare = linkages.filter((l) => l.band === 'strong' || l.band === 'structural').length / Math.max(1, pairsPossible);
  return op10mA11Round(op10mA11Clamp(weakShare * 55 + corridorStress * 0.35 - strongShare * 18 + 12));
}

export function op10mA11RegionsWithWeakLinkage(
  linkages: OP10M_A11_RegionalLinkageEdge[],
): OP10M_A11_RegionId[] {
  const weakCount = {} as Record<OP10M_A11_RegionId, number>;
  for (const rid of OP10M_A11_CORE_REGIONS) weakCount[rid] = 0;
  for (const l of linkages) {
    if (l.band !== 'weak') continue;
    weakCount[l.fromRegion] += 1;
    weakCount[l.toRegion] += 1;
  }
  return OP10M_A11_CORE_REGIONS.filter((r) => weakCount[r] >= 2);
}
