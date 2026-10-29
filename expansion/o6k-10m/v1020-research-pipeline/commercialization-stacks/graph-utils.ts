import type { V1020RpipeGrantStackEdge } from '../types/core';
import { V1020_RPIPE_clamp, V1020_RPIPE_commercializationStackGraphHash as nresPgHashCore } from '../engine/research-pipeline-utils';

export function V1020_RPIPE_mergeCommercializationStackEdges(
  base: readonly V1020RpipeGrantStackEdge[],
  extra: readonly V1020RpipeGrantStackEdge[],
): V1020RpipeGrantStackEdge[] {
  return [...base, ...extra];
}

export function V1020_RPIPE_commercializationStackPressure(
  edges: readonly V1020RpipeGrantStackEdge[],
  turn: number,
  seedSeverity: number,
): number {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    acc += e.weight * (1 + ((turn + e.lagTurns) % 5)) * 0.015;
  }
  return V1020_RPIPE_clamp(acc * 0.4 + seedSeverity * 0.01, 0, 1);
}

export function V1020_RPIPE_commercializationStackGraphHash(edges: readonly V1020RpipeGrantStackEdge[]): string {
  return nresPgHashCore(edges);
}
