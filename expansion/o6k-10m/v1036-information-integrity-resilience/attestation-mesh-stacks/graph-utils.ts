import type { V1036IiresAttestationMeshEdge } from '../types/core';
import { V1036_IIRES_clamp, V1036_IIRES_attestationMeshGraphHash as dgovGraphHashCore } from '../engine/information-integrity-resilience-utils';

export function V1036_IIRES_mergeAttestationMeshEdges(
  base: readonly V1036IiresAttestationMeshEdge[],
  extra: readonly V1036IiresAttestationMeshEdge[],
): V1036IiresAttestationMeshEdge[] {
  return [...base, ...extra];
}

export function V1036_IIRES_attestationMeshPressure(
  edges: readonly V1036IiresAttestationMeshEdge[],
  turn: number,
  seedSeverity: number,
): number {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    acc += e.weight * (1 + ((turn + e.lagTurns) % 5)) * 0.015;
  }
  return V1036_IIRES_clamp(acc * 0.4 + seedSeverity * 0.01, 0, 1);
}

export function V1036_IIRES_attestationMeshGraphHash(edges: readonly V1036IiresAttestationMeshEdge[]): string {
  return dgovGraphHashCore(edges);
}
