import type { V1025BioConservationOffsetEdge } from '../types/core';
import { V1025_BIO_clamp, V1025_BIO_conservationOffsetGraphHash as dgovGraphHashCore } from '../engine/biodiversity-stewardship-utils';

export function V1025_BIO_mergeConservationOffsetEdges(
  base: readonly V1025BioConservationOffsetEdge[],
  extra: readonly V1025BioConservationOffsetEdge[],
): V1025BioConservationOffsetEdge[] {
  return [...base, ...extra];
}

export function V1025_BIO_conservationOffsetPressure(
  edges: readonly V1025BioConservationOffsetEdge[],
  turn: number,
  seedSeverity: number,
): number {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    acc += e.weight * (1 + ((turn + e.lagTurns) % 5)) * 0.015;
  }
  return V1025_BIO_clamp(acc * 0.4 + seedSeverity * 0.01, 0, 1);
}

export function V1025_BIO_conservationOffsetGraphHash(edges: readonly V1025BioConservationOffsetEdge[]): string {
  return dgovGraphHashCore(edges);
}
