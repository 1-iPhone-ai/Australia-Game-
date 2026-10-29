import type { V1019MtrdLaneGraphEdge } from '../types/core';
import { V1019_MTRD_clamp, V1019_MTRD_laneGraphHash as nresPgHashCore } from '../engine/maritime-trade-utils';

export function V1019_MTRD_mergeLaneGraphEdges(
  base: readonly V1019MtrdLaneGraphEdge[],
  extra: readonly V1019MtrdLaneGraphEdge[],
): V1019MtrdLaneGraphEdge[] {
  return [...base, ...extra];
}

export function V1019_MTRD_lanePressure(
  edges: readonly V1019MtrdLaneGraphEdge[],
  turn: number,
  seedSeverity: number,
): number {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    acc += e.weight * (1 + ((turn + e.lagTurns) % 5)) * 0.015;
  }
  return V1019_MTRD_clamp(acc * 0.4 + seedSeverity * 0.01, 0, 1);
}

export function V1019_MTRD_laneGraphHash(edges: readonly V1019MtrdLaneGraphEdge[]): string {
  return nresPgHashCore(edges);
}
