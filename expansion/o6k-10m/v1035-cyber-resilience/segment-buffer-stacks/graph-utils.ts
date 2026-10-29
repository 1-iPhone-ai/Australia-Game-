import type { V1035CyresSegmentBufferEdge } from '../types/core';
import { V1035_CYRES_clamp, V1035_CYRES_segmentBufferGraphHash as dgovGraphHashCore } from '../engine/cyber-resilience-utils';

export function V1035_CYRES_mergeSegmentBufferEdges(
  base: readonly V1035CyresSegmentBufferEdge[],
  extra: readonly V1035CyresSegmentBufferEdge[],
): V1035CyresSegmentBufferEdge[] {
  return [...base, ...extra];
}

export function V1035_CYRES_segmentBufferPressure(
  edges: readonly V1035CyresSegmentBufferEdge[],
  turn: number,
  seedSeverity: number,
): number {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    acc += e.weight * (1 + ((turn + e.lagTurns) % 5)) * 0.015;
  }
  return V1035_CYRES_clamp(acc * 0.4 + seedSeverity * 0.01, 0, 1);
}

export function V1035_CYRES_segmentBufferGraphHash(edges: readonly V1035CyresSegmentBufferEdge[]): string {
  return dgovGraphHashCore(edges);
}
