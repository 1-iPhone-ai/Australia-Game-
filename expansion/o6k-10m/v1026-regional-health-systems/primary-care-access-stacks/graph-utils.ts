import type { V1026RhsPrimaryCareAccessEdge } from '../types/core';
import { V1026_RHS_clamp, V1026_RHS_primaryCareAccessGraphHash as dgovGraphHashCore } from '../engine/regional-health-systems-utils';

export function V1026_RHS_mergePrimaryCareAccessEdges(
  base: readonly V1026RhsPrimaryCareAccessEdge[],
  extra: readonly V1026RhsPrimaryCareAccessEdge[],
): V1026RhsPrimaryCareAccessEdge[] {
  return [...base, ...extra];
}

export function V1026_RHS_primaryCareAccessPressure(
  edges: readonly V1026RhsPrimaryCareAccessEdge[],
  turn: number,
  seedSeverity: number,
): number {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    acc += e.weight * (1 + ((turn + e.lagTurns) % 5)) * 0.015;
  }
  return V1026_RHS_clamp(acc * 0.4 + seedSeverity * 0.01, 0, 1);
}

export function V1026_RHS_primaryCareAccessGraphHash(edges: readonly V1026RhsPrimaryCareAccessEdge[]): string {
  return dgovGraphHashCore(edges);
}
