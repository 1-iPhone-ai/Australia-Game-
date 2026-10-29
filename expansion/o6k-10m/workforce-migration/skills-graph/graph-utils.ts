import type { V1014WorkforceSkillsGraphEdge, V1014WorkforceSkillDomain } from '../types/core';
import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_hash } from '../engine/workforce-migration-utils';

export function V1014_WORKFORCE_mergeSkillsEdges(
  base: readonly V1014WorkforceSkillsGraphEdge[],
  extension: readonly V1014WorkforceSkillsGraphEdge[],
): V1014WorkforceSkillsGraphEdge[] {
  const map = new Map<string, V1014WorkforceSkillsGraphEdge>();
  [...base, ...extension].forEach((edge) => {
    const key = `${edge.fromDomain}:${edge.toDomain}:${edge.corridorId}`;
    const prev = map.get(key);
    if (!prev || edge.weight > prev.weight) map.set(key, edge);
  });
  return [...map.values()];
}

export function V1014_WORKFORCE_skillsGraphHash(edges: readonly V1014WorkforceSkillsGraphEdge[]): string {
  return V1014_WORKFORCE_hash({
    n: edges.length,
    head: edges.slice(0, 8).map((e) => [e.fromDomain, e.toDomain, e.weight]),
  });
}

export function V1014_WORKFORCE_retrainCost(
  from: V1014WorkforceSkillDomain,
  to: V1014WorkforceSkillDomain,
  fiscalHeadroom: number,
): number {
  const base = from === to ? 0 : 12 + Math.abs(from.charCodeAt(0) - to.charCodeAt(0)) % 9;
  const discount = V1014_WORKFORCE_clamp(fiscalHeadroom / 120, 0, 0.35);
  return V1014_WORKFORCE_clamp(base * (1 - discount), 0, 48);
}

export function V1014_WORKFORCE_pathPressure(
  edges: readonly V1014WorkforceSkillsGraphEdge[],
  domain: V1014WorkforceSkillDomain,
): number {
  const inbound = edges.filter((e) => e.toDomain === domain);
  if (!inbound.length) return 0;
  const sum = inbound.reduce((acc, e) => acc + e.weight, 0);
  return V1014_WORKFORCE_clamp(sum / inbound.length, 0, 1);
}
