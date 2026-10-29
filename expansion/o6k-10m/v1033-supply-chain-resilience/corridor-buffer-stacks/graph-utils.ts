import type { V1033ScresCorridorBufferEdge } from '../types/core';
import { V1033_SCRES_clamp, V1033_SCRES_corridorBufferGraphHash as dgovGraphHashCore } from '../engine/supply-chain-resilience-utils';

export function V1033_SCRES_mergeCorridorBufferEdges(
  base: readonly V1033ScresCorridorBufferEdge[],
  extra: readonly V1033ScresCorridorBufferEdge[],
): V1033ScresCorridorBufferEdge[] {
  return [...base, ...extra];
}

export function V1033_SCRES_corridorBufferPressure(
  edges: readonly V1033ScresCorridorBufferEdge[],
  turn: number,
  seedSeverity: number,
): number {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    acc += e.weight * (1 + ((turn + e.lagTurns) % 5)) * 0.015;
  }
  return V1033_SCRES_clamp(acc * 0.4 + seedSeverity * 0.01, 0, 1);
}

export function V1033_SCRES_corridorBufferGraphHash(edges: readonly V1033ScresCorridorBufferEdge[]): string {
  return dgovGraphHashCore(edges);
}
