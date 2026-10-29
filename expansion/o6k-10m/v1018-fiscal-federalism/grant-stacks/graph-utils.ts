import type { V1018FfedGrantStackEdge } from '../types/core';
import { V1018_FFED_clamp, V1018_FFED_grantStackGraphHash as nresPgHashCore } from '../engine/fiscal-federalism-utils';

export function V1018_FFED_mergeGrantStackEdges(
  base: readonly V1018FfedGrantStackEdge[],
  extra: readonly V1018FfedGrantStackEdge[],
): V1018FfedGrantStackEdge[] {
  return [...base, ...extra];
}

export function V1018_FFED_grantStackPressure(
  edges: readonly V1018FfedGrantStackEdge[],
  turn: number,
  seedSeverity: number,
): number {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    acc += e.weight * (1 + ((turn + e.lagTurns) % 5)) * 0.015;
  }
  return V1018_FFED_clamp(acc * 0.4 + seedSeverity * 0.01, 0, 1);
}

export function V1018_FFED_grantStackGraphHash(edges: readonly V1018FfedGrantStackEdge[]): string {
  return nresPgHashCore(edges);
}
