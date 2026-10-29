import type { V1034CiresSegmentBufferEdge } from '../types/core';
import { V1034_CIRES_clamp, V1034_CIRES_segmentBufferGraphHash as dgovGraphHashCore } from '../engine/critical-infrastructure-resilience-utils';

export function V1034_CIRES_mergeSegmentBufferEdges(
  base: readonly V1034CiresSegmentBufferEdge[],
  extra: readonly V1034CiresSegmentBufferEdge[],
): V1034CiresSegmentBufferEdge[] {
  return [...base, ...extra];
}

export function V1034_CIRES_segmentBufferPressure(
  edges: readonly V1034CiresSegmentBufferEdge[],
  turn: number,
  seedSeverity: number,
): number {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    acc += e.weight * (1 + ((turn + e.lagTurns) % 5)) * 0.015;
  }
  return V1034_CIRES_clamp(acc * 0.4 + seedSeverity * 0.01, 0, 1);
}

export function V1034_CIRES_segmentBufferGraphHash(edges: readonly V1034CiresSegmentBufferEdge[]): string {
  return dgovGraphHashCore(edges);
}
