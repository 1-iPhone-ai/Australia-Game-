import type { V1028DresEvacuationCapacityEdge } from '../types/core';
import { V1028_DRES_clamp, V1028_DRES_evacuationCapacityGraphHash as dgovGraphHashCore } from '../engine/disaster-resilience-utils';

export function V1028_DRES_mergeEvacuationCapacityEdges(
  base: readonly V1028DresEvacuationCapacityEdge[],
  extra: readonly V1028DresEvacuationCapacityEdge[],
): V1028DresEvacuationCapacityEdge[] {
  return [...base, ...extra];
}

export function V1028_DRES_evacuationCapacityPressure(
  edges: readonly V1028DresEvacuationCapacityEdge[],
  turn: number,
  seedSeverity: number,
): number {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    acc += e.weight * (1 + ((turn + e.lagTurns) % 5)) * 0.015;
  }
  return V1028_DRES_clamp(acc * 0.4 + seedSeverity * 0.01, 0, 1);
}

export function V1028_DRES_evacuationCapacityGraphHash(edges: readonly V1028DresEvacuationCapacityEdge[]): string {
  return dgovGraphHashCore(edges);
}
