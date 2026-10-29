import type { V1017IclogCorridorEdge } from '../types/core';
import { V1017_ICLOG_clamp, V1017_ICLOG_corridorGraphHash as nresPgHashCore } from '../engine/intercity-logistics-utils';

export function V1017_ICLOG_mergeCorridorEdges(
  base: readonly V1017IclogCorridorEdge[],
  extra: readonly V1017IclogCorridorEdge[],
): V1017IclogCorridorEdge[] {
  return [...base, ...extra];
}

export function V1017_ICLOG_corridorPressure(
  edges: readonly V1017IclogCorridorEdge[],
  turn: number,
  seedSeverity: number,
): number {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    acc += e.weight * (1 + ((turn + e.lagTurns) % 5)) * 0.015;
  }
  return V1017_ICLOG_clamp(acc * 0.4 + seedSeverity * 0.01, 0, 1);
}

export function V1017_ICLOG_corridorGraphHash(edges: readonly V1017IclogCorridorEdge[]): string {
  return nresPgHashCore(edges);
}
