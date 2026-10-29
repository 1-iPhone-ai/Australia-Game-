import type { V1023CladDroughtBufferEdge } from '../types/core';
import { V1023_CLAD_clamp, V1023_CLAD_droughtBufferGraphHash as imfdPgHashCore } from '../engine/climate-adaptation-utils';

export function V1023_CLAD_mergeDroughtBufferEdges(
  base: readonly V1023CladDroughtBufferEdge[],
  extra: readonly V1023CladDroughtBufferEdge[],
): V1023CladDroughtBufferEdge[] {
  return [...base, ...extra];
}

export function V1023_CLAD_droughtBufferPressure(
  edges: readonly V1023CladDroughtBufferEdge[],
  turn: number,
  seedSeverity: number,
): number {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    acc += e.weight * (1 + ((turn + e.lagTurns) % 5)) * 0.015;
  }
  return V1023_CLAD_clamp(acc * 0.4 + seedSeverity * 0.01, 0, 1);
}

export function V1023_CLAD_droughtBufferGraphHash(edges: readonly V1023CladDroughtBufferEdge[]): string {
  return imfdPgHashCore(edges);
}
