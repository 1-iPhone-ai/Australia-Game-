import {
  V1028_DRES_SCHEMA_VERSION,
  type V1028DresPersisted,
  type V1028DresRegionId,
} from '../types/core';

const REGIONS: V1028DresRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function createEmptyV1028DresPersisted(): V1028DresPersisted {
  const regionalEvacuationCapacity: V1028DresPersisted['regionalEvacuationCapacity'] = {};
  REGIONS.forEach((r, i) => {
    regionalEvacuationCapacity[r] = {
      bufferIndex: 44 + (i % 6),
      rerouteStress: 36 + (i % 8),
      compositeCapacity: 54 + (i % 5),
      exposedSystems: 2 + (i % 4),
    };
  });
  return {
    schemaVersion: V1028_DRES_SCHEMA_VERSION,
    revision: 0,
    lastProcessedTurn: null,
    hazardSnapshots: {},
    evacuationCapacityGraphRevision: 0,
    regionalEvacuationCapacity,
    historyTail: [],
    aiReadCache: {},
  };
}

function clampNum(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

export function sanitizeV1028DresPersisted(raw: unknown, turn: number): V1028DresPersisted {
  const base = createEmptyV1028DresPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<V1028DresPersisted>;
  const schema =
    o.schemaVersion === V1028_DRES_SCHEMA_VERSION ? o.schemaVersion : V1028_DRES_SCHEMA_VERSION;
  return {
    schemaVersion: schema,
    revision: clampNum(Number(o.revision ?? 0), 0, 1_000_000),
    lastProcessedTurn: o.lastProcessedTurn == null ? null : clampNum(Number(o.lastProcessedTurn), 0, 1_000_000),
    hazardSnapshots: o.hazardSnapshots && typeof o.hazardSnapshots === 'object' ? { ...o.hazardSnapshots } : {},
    evacuationCapacityGraphRevision: clampNum(Number(o.evacuationCapacityGraphRevision ?? 0), 0, 1_000_000),
    regionalEvacuationCapacity: { ...base.regionalEvacuationCapacity, ...(o.regionalEvacuationCapacity ?? {}) },
    historyTail: Array.isArray(o.historyTail)
      ? o.historyTail.slice(-12).map((h) => ({
          turn: clampNum(Number((h as { turn?: number }).turn ?? turn), 0, 1_000_000),
          inputHash: String((h as { inputHash?: string }).inputHash ?? ''),
          aggregateDisasterRisk: clampNum(Number((h as { aggregateDisasterRisk?: number }).aggregateDisasterRisk ?? 0), 0, 100),
        }))
      : [],
    aiReadCache: o.aiReadCache && typeof o.aiReadCache === 'object' ? { ...o.aiReadCache } : {},
  };
}
