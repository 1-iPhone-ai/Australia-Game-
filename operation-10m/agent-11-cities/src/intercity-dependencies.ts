import {
  type OP10M_A11_DependencyCriticality,
  type OP10M_A11_IntercityDependencyEdge,
  type OP10M_A11_IntercityLinkSlice,
  type OP10M_A11_RegionId,
} from './types.ts';
import { op10mA11Clamp, op10mA11Round } from './constants.ts';

function linkCriticality(link: OP10M_A11_IntercityLinkSlice, network: number): OP10M_A11_DependencyCriticality {
  let score = link.utilization * 0.55;
  if (link.strategic) score += 12;
  if (link.health === 'degraded' || link.health === 'severed') score += 18;
  if (link.health === 'operational' && link.utilization >= 72) score += 10;
  if (network < 35) score += 8;
  score = op10mA11Clamp(score);
  if (score >= 78) return 'essential';
  if (score >= 58) return 'high';
  if (score >= 36) return 'medium';
  return 'low';
}

export function op10mA11BuildIntercityDependencies(
  links: OP10M_A11_IntercityLinkSlice[],
  networkFreight: number,
  networkDigital: number,
): OP10M_A11_IntercityDependencyEdge[] {
  const network = (networkFreight + networkDigital) / 2;
  const byGroup = new Map<string, OP10M_A11_IntercityLinkSlice[]>();
  for (const link of links) {
    const g = link.redundancyGroup || link.linkId;
    const arr = byGroup.get(g) || [];
    arr.push(link);
    byGroup.set(g, arr);
  }

  const stressedGroups = new Set<string>();
  for (const [group, groupLinks] of byGroup) {
    const allStressed = groupLinks.every(
      (l) => l.utilization >= 70 || l.health === 'degraded' || l.health === 'severed',
    );
    if (allStressed && groupLinks.length >= 1) stressedGroups.add(group);
  }

  return links.map((link) => {
    const criticality = linkCriticality(link, network);
    const dependentRegions: OP10M_A11_RegionId[] = [link.regionA, link.regionB];
    const chokePoint = stressedGroups.has(link.redundancyGroup) && link.strategic;
    return {
      linkId: link.linkId,
      criticality,
      dependentRegions,
      chokePoint,
      explanation: chokePoint
        ? `${link.linkId} is a redundancy choke point (${link.kind}, ${link.health}).`
        : `${link.linkId} ${criticality} dependency for ${link.regionA}↔${link.regionB}.`,
    };
  });
}

export function op10mA11CorridorStressIndex(links: OP10M_A11_IntercityLinkSlice[]): number {
  if (!links.length) return 0;
  const avg =
    links.reduce((acc, l) => {
      const healthPenalty = l.health === 'severed' ? 30 : l.health === 'degraded' ? 18 : 0;
      return acc + op10mA11Clamp(l.utilization * 0.75 + healthPenalty);
    }, 0) / links.length;
  return op10mA11Round(avg);
}

export function op10mA11SummarizeDependencies(
  deps: OP10M_A11_IntercityDependencyEdge[],
  stress: number,
): string {
  const essential = deps.filter((d) => d.criticality === 'essential' || d.criticality === 'high').length;
  const choke = deps.filter((d) => d.chokePoint).length;
  return `Intercity stress ${stress}; ${essential} high/essential deps; ${choke} choke points.`;
}
