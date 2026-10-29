import {
  V1026_RHS_SCHEMA_VERSION,
  type V1026RhsPersisted,
  type V1026RhsRegionId,
} from '../types/core';

const REGIONS: V1026RhsRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function createEmptyV1026RhsPersisted(): V1026RhsPersisted {
  const regionalPrimaryCareAccess: V1026RhsPersisted['regionalPrimaryCareAccess'] = {};
  REGIONS.forEach((r, i) => {
    regionalPrimaryCareAccess[r] = {
      bufferIndex: 44 + (i % 6),
      rerouteStress: 36 + (i % 8),
      compositeCapacity: 54 + (i % 5),
      exposedSystems: 2 + (i % 4),
    };
  });
  return {
    schemaVersion: V1026_RHS_SCHEMA_VERSION,
    revision: 0,
    lastProcessedTurn: null,
    careSnapshots: {},
    primaryCareAccessGraphRevision: 0,
    regionalPrimaryCareAccess,
    historyTail: [],
    aiReadCache: {},
  };
}

function clampNum(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

export function sanitizeV1026RhsPersisted(raw: unknown, turn: number): V1026RhsPersisted {
  const base = createEmptyV1026RhsPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<V1026RhsPersisted>;
  const schema =
    o.schemaVersion === V1026_RHS_SCHEMA_VERSION ? o.schemaVersion : V1026_RHS_SCHEMA_VERSION;
  return {
    schemaVersion: schema,
    revision: clampNum(Number(o.revision ?? 0), 0, 1_000_000),
    lastProcessedTurn: o.lastProcessedTurn == null ? null : clampNum(Number(o.lastProcessedTurn), 0, 1_000_000),
    careSnapshots: o.careSnapshots && typeof o.careSnapshots === 'object' ? { ...o.careSnapshots } : {},
    primaryCareAccessGraphRevision: clampNum(Number(o.primaryCareAccessGraphRevision ?? 0), 0, 1_000_000),
    regionalPrimaryCareAccess: { ...base.regionalPrimaryCareAccess, ...(o.regionalPrimaryCareAccess ?? {}) },
    historyTail: Array.isArray(o.historyTail)
      ? o.historyTail.slice(-12).map((h) => ({
          turn: clampNum(Number((h as { turn?: number }).turn ?? turn), 0, 1_000_000),
          inputHash: String((h as { inputHash?: string }).inputHash ?? ''),
          aggregateCapacityStress: clampNum(Number((h as { aggregateCapacityStress?: number }).aggregateCapacityStress ?? 0), 0, 100),
        }))
      : [],
    aiReadCache: o.aiReadCache && typeof o.aiReadCache === 'object' ? { ...o.aiReadCache } : {},
  };
}
