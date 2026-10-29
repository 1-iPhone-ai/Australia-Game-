import type { V1016NresPropagationEdge } from '../types/core';
import { V1016_NRES_clamp, V1016_NRES_propagationGraphHash as nresPgHashCore } from '../engine/national-resilience-utils';

export function V1016_NRES_mergePropagationEdges(
  base: readonly V1016NresPropagationEdge[],
  extra: readonly V1016NresPropagationEdge[],
): V1016NresPropagationEdge[] {
  return [...base, ...extra];
}

export function V1016_NRES_propagationPressure(
  edges: readonly V1016NresPropagationEdge[],
  turn: number,
  seedSeverity: number,
): number {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    acc += e.weight * (1 + ((turn + e.lagTurns) % 5)) * 0.015;
  }
  return V1016_NRES_clamp(acc * 0.4 + seedSeverity * 0.01, 0, 1);
}

export function V1016_NRES_propagationGraphHash(edges: readonly V1016NresPropagationEdge[]): string {
  return nresPgHashCore(edges);
}
