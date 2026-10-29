import type { V1032TresBackboneBufferEdge } from '../types/core';
import { V1032_TRES_clamp, V1032_TRES_backboneBufferGraphHash as dgovGraphHashCore } from '../engine/telecom-resilience-utils';

export function V1032_TRES_mergeBackboneBufferEdges(
  base: readonly V1032TresBackboneBufferEdge[],
  extra: readonly V1032TresBackboneBufferEdge[],
): V1032TresBackboneBufferEdge[] {
  return [...base, ...extra];
}

export function V1032_TRES_backboneBufferPressure(
  edges: readonly V1032TresBackboneBufferEdge[],
  turn: number,
  seedSeverity: number,
): number {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    acc += e.weight * (1 + ((turn + e.lagTurns) % 5)) * 0.015;
  }
  return V1032_TRES_clamp(acc * 0.4 + seedSeverity * 0.01, 0, 1);
}

export function V1032_TRES_backboneBufferGraphHash(edges: readonly V1032TresBackboneBufferEdge[]): string {
  return dgovGraphHashCore(edges);
}
