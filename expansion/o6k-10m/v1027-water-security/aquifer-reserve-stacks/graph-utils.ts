import type { V1027WsecAquiferReserveEdge } from '../types/core';
import { V1027_WSEC_clamp, V1027_WSEC_aquiferReserveGraphHash as dgovGraphHashCore } from '../engine/water-security-utils';

export function V1027_WSEC_mergeAquiferReserveEdges(
  base: readonly V1027WsecAquiferReserveEdge[],
  extra: readonly V1027WsecAquiferReserveEdge[],
): V1027WsecAquiferReserveEdge[] {
  return [...base, ...extra];
}

export function V1027_WSEC_aquiferReservePressure(
  edges: readonly V1027WsecAquiferReserveEdge[],
  turn: number,
  seedSeverity: number,
): number {
  let acc = 0;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    acc += e.weight * (1 + ((turn + e.lagTurns) % 5)) * 0.015;
  }
  return V1027_WSEC_clamp(acc * 0.4 + seedSeverity * 0.01, 0, 1);
}

export function V1027_WSEC_aquiferReserveGraphHash(edges: readonly V1027WsecAquiferReserveEdge[]): string {
  return dgovGraphHashCore(edges);
}
