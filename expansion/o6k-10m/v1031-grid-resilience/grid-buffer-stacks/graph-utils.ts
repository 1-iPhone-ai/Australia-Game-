import type { V1031GresGridBufferEdge } from '../types/core';
import { V1031_GRES_clamp, V1031_GRES_gridBufferGraphHash as dgovGraphHashCore } from '../engine/grid-resilience-utils';

export function V1031_GRES_mergeGridBufferEdges(
  base: readonly V1031GresGridBufferEdge[],
  extra: readonly V1031GresGridBufferEdge[],
): V1031GresGridBufferEdge[] {
  return [...base, ...extra];
}

export function V1031_GRES_gridBufferPressure(
  edges: readonly V1031GresGridBufferEdge[],
  turn: number,
  seedSeverity: number,
): number {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    acc += e.weight * (1 + ((turn + e.lagTurns) % 5)) * 0.015;
  }
  return V1031_GRES_clamp(acc * 0.4 + seedSeverity * 0.01, 0, 1);
}

export function V1031_GRES_gridBufferGraphHash(edges: readonly V1031GresGridBufferEdge[]): string {
  return dgovGraphHashCore(edges);
}
