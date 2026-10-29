import type { V1021ImfdHandoffStackEdge } from '../types/core';
import { V1021_IMFD_clamp, V1021_IMFD_handoffStackGraphHash as imfdPgHashCore } from '../engine/intermodal-freight-utils';

export function V1021_IMFD_mergeHandoffStackEdges(
  base: readonly V1021ImfdHandoffStackEdge[],
  extra: readonly V1021ImfdHandoffStackEdge[],
): V1021ImfdHandoffStackEdge[] {
  return [...base, ...extra];
}

export function V1021_IMFD_handoffStackPressure(
  edges: readonly V1021ImfdHandoffStackEdge[],
  turn: number,
  seedSeverity: number,
): number {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    acc += e.weight * (1 + ((turn + e.lagTurns) % 5)) * 0.015;
  }
  return V1021_IMFD_clamp(acc * 0.4 + seedSeverity * 0.01, 0, 1);
}

export function V1021_IMFD_handoffStackGraphHash(edges: readonly V1021ImfdHandoffStackEdge[]): string {
  return imfdPgHashCore(edges);
}
