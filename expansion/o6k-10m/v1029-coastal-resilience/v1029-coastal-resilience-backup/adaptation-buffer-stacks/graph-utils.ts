import type { V1029CresAdaptationBufferEdge } from '../types/core';
import { V1029_CRES_clamp, V1029_CRES_adaptationBufferGraphHash as dgovGraphHashCore } from '../engine/coastal-resilience-utils';

export function V1029_CRES_mergeAdaptationBufferEdges(
  base: readonly V1029CresAdaptationBufferEdge[],
  extra: readonly V1029CresAdaptationBufferEdge[],
): V1029CresAdaptationBufferEdge[] {
  return [...base, ...extra];
}

export function V1029_CRES_adaptationBufferPressure(
  edges: readonly V1029CresAdaptationBufferEdge[],
  turn: number,
  seedSeverity: number,
): number {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    acc += e.weight * (1 + ((turn + e.lagTurns) % 5)) * 0.015;
  }
  return V1029_CRES_clamp(acc * 0.4 + seedSeverity * 0.01, 0, 1);
}

export function V1029_CRES_adaptationBufferGraphHash(edges: readonly V1029CresAdaptationBufferEdge[]): string {
  return dgovGraphHashCore(edges);
}
