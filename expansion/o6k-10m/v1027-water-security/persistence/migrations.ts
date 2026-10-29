import {
  V1027_WSEC_SCHEMA_VERSION,
  type V1027WsecPersisted,
  type V1027WsecRegionId,
} from '../types/core';

const REGIONS: V1027WsecRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function createEmptyV1027WsecPersisted(): V1027WsecPersisted {
  const regionalAquiferReserve: V1027WsecPersisted['regionalAquiferReserve'] = {};
  REGIONS.forEach((r, i) => {
    regionalAquiferReserve[r] = {
      bufferIndex: 44 + (i % 6),
      rerouteStress: 36 + (i % 8),
      compositeCapacity: 54 + (i % 5),
      exposedSystems: 2 + (i % 4),
    };
  });
  return {
    schemaVersion: V1027_WSEC_SCHEMA_VERSION,
    revision: 0,
    lastProcessedTurn: null,
    basinSnapshots: {},
    aquiferReserveGraphRevision: 0,
    regionalAquiferReserve,
    historyTail: [],
    aiReadCache: {},
  };
}

function clampNum(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

export function sanitizeV1027WsecPersisted(raw: unknown, turn: number): V1027WsecPersisted {
  const base = createEmptyV1027WsecPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<V1027WsecPersisted>;
  const schema =
    o.schemaVersion === V1027_WSEC_SCHEMA_VERSION ? o.schemaVersion : V1027_WSEC_SCHEMA_VERSION;
  return {
    schemaVersion: schema,
    revision: clampNum(Number(o.revision ?? 0), 0, 1_000_000),
    lastProcessedTurn: o.lastProcessedTurn == null ? null : clampNum(Number(o.lastProcessedTurn), 0, 1_000_000),
    basinSnapshots: o.basinSnapshots && typeof o.basinSnapshots === 'object' ? { ...o.basinSnapshots } : {},
    aquiferReserveGraphRevision: clampNum(Number(o.aquiferReserveGraphRevision ?? 0), 0, 1_000_000),
    regionalAquiferReserve: { ...base.regionalAquiferReserve, ...(o.regionalAquiferReserve ?? {}) },
    historyTail: Array.isArray(o.historyTail)
      ? o.historyTail.slice(-12).map((h) => ({
          turn: clampNum(Number((h as { turn?: number }).turn ?? turn), 0, 1_000_000),
          inputHash: String((h as { inputHash?: string }).inputHash ?? ''),
          aggregateWaterStress: clampNum(Number((h as { aggregateWaterStress?: number }).aggregateWaterStress ?? 0), 0, 100),
        }))
      : [],
    aiReadCache: o.aiReadCache && typeof o.aiReadCache === 'object' ? { ...o.aiReadCache } : {},
  };
}
