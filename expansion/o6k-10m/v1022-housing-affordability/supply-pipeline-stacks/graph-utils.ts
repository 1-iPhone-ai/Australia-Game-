import type { V1022HaffSupplyPipelineEdge } from '../types/core';
import { V1022_HAFF_clamp, V1022_HAFF_supplyPipelineGraphHash as imfdPgHashCore } from '../engine/housing-affordability-utils';

export function V1022_HAFF_mergeSupplyPipelineEdges(
  base: readonly V1022HaffSupplyPipelineEdge[],
  extra: readonly V1022HaffSupplyPipelineEdge[],
): V1022HaffSupplyPipelineEdge[] {
  return [...base, ...extra];
}

export function V1022_HAFF_supplyPipelinePressure(
  edges: readonly V1022HaffSupplyPipelineEdge[],
  turn: number,
  seedSeverity: number,
): number {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    acc += e.weight * (1 + ((turn + e.lagTurns) % 5)) * 0.015;
  }
  return V1022_HAFF_clamp(acc * 0.4 + seedSeverity * 0.01, 0, 1);
}

export function V1022_HAFF_supplyPipelineGraphHash(edges: readonly V1022HaffSupplyPipelineEdge[]): string {
  return imfdPgHashCore(edges);
}
