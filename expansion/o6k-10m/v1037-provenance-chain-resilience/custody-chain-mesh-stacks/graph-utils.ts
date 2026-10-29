import type { V1037PcresCustodyChainMeshEdge } from '../types/core';
import { V1037_PCRS_clamp, V1037_PCRS_custodyChainMeshGraphHash as dgovGraphHashCore } from '../engine/provenance-chain-resilience-utils';

export function V1037_PCRS_mergeCustodyChainMeshEdges(
  base: readonly V1037PcresCustodyChainMeshEdge[],
  extra: readonly V1037PcresCustodyChainMeshEdge[],
): V1037PcresCustodyChainMeshEdge[] {
  return [...base, ...extra];
}

export function V1037_PCRS_custodyChainMeshPressure(
  edges: readonly V1037PcresCustodyChainMeshEdge[],
  turn: number,
  seedSeverity: number,
): number {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    acc += e.weight * (1 + ((turn + e.lagTurns) % 5)) * 0.015;
  }
  return V1037_PCRS_clamp(acc * 0.4 + seedSeverity * 0.01, 0, 1);
}

export function V1037_PCRS_custodyChainMeshGraphHash(edges: readonly V1037PcresCustodyChainMeshEdge[]): string {
  return dgovGraphHashCore(edges);
}
