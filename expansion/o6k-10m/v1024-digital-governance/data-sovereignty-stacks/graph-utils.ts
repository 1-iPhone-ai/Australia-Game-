import type { V1024DgovDataSovereigntyEdge } from '../types/core';
import { V1024_DGOV_clamp, V1024_DGOV_dataSovereigntyGraphHash as dgovGraphHashCore } from '../engine/digital-governance-utils';

export function V1024_DGOV_mergeDataSovereigntyEdges(
  base: readonly V1024DgovDataSovereigntyEdge[],
  extra: readonly V1024DgovDataSovereigntyEdge[],
): V1024DgovDataSovereigntyEdge[] {
  return [...base, ...extra];
}

export function V1024_DGOV_dataSovereigntyPressure(
  edges: readonly V1024DgovDataSovereigntyEdge[],
  turn: number,
  seedSeverity: number,
): number {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    acc += e.weight * (1 + ((turn + e.lagTurns) % 5)) * 0.015;
  }
  return V1024_DGOV_clamp(acc * 0.4 + seedSeverity * 0.01, 0, 1);
}

export function V1024_DGOV_dataSovereigntyGraphHash(edges: readonly V1024DgovDataSovereigntyEdge[]): string {
  return dgovGraphHashCore(edges);
}
