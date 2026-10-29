import type { V1030IheatAridBufferEdge } from '../types/core';
import { V1030_IHEAT_clamp, V1030_IHEAT_aridBufferGraphHash as dgovGraphHashCore } from '../engine/inland-heat-utils';

export function V1030_IHEAT_mergeAridBufferEdges(
  base: readonly V1030IheatAridBufferEdge[],
  extra: readonly V1030IheatAridBufferEdge[],
): V1030IheatAridBufferEdge[] {
  return [...base, ...extra];
}

export function V1030_IHEAT_aridBufferPressure(
  edges: readonly V1030IheatAridBufferEdge[],
  turn: number,
  seedSeverity: number,
): number {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    acc += e.weight * (1 + ((turn + e.lagTurns) % 5)) * 0.015;
  }
  return V1030_IHEAT_clamp(acc * 0.4 + seedSeverity * 0.01, 0, 1);
}

export function V1030_IHEAT_aridBufferGraphHash(edges: readonly V1030IheatAridBufferEdge[]): string {
  return dgovGraphHashCore(edges);
}
