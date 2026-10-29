import {
  V1029_CRES_SCHEMA_VERSION,
  type V1029CresPersisted,
  type V1029CresRegionId,
} from '../types/core';

const REGIONS: V1029CresRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function createEmptyV1029CresPersisted(): V1029CresPersisted {
  const regionalAdaptationBuffer: V1029CresPersisted['regionalAdaptationBuffer'] = {};
  REGIONS.forEach((r, i) => {
    regionalAdaptationBuffer[r] = {
      bufferIndex: 44 + (i % 6),
      rerouteStress: 36 + (i % 8),
      compositeCapacity: 54 + (i % 5),
      exposedSystems: 2 + (i % 4),
    };
  });
  return {
    schemaVersion: V1029_CRES_SCHEMA_VERSION,
    revision: 0,
    lastProcessedTurn: null,
    surgeSnapshots: {},
    adaptationBufferGraphRevision: 0,
    regionalAdaptationBuffer,
    historyTail: [],
    aiReadCache: {},
  };
}

function clampNum(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

export function sanitizeV1029CresPersisted(raw: unknown, turn: number): V1029CresPersisted {
  const base = createEmptyV1029CresPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<V1029CresPersisted>;
  const schema =
    o.schemaVersion === V1029_CRES_SCHEMA_VERSION ? o.schemaVersion : V1029_CRES_SCHEMA_VERSION;
  return {
    schemaVersion: schema,
    revision: clampNum(Number(o.revision ?? 0), 0, 1_000_000),
    lastProcessedTurn: o.lastProcessedTurn == null ? null : clampNum(Number(o.lastProcessedTurn), 0, 1_000_000),
    surgeSnapshots: o.surgeSnapshots && typeof o.surgeSnapshots === 'object' ? { ...o.surgeSnapshots } : {},
    adaptationBufferGraphRevision: clampNum(Number(o.adaptationBufferGraphRevision ?? 0), 0, 1_000_000),
    regionalAdaptationBuffer: { ...base.regionalAdaptationBuffer, ...(o.regionalAdaptationBuffer ?? {}) },
    historyTail: Array.isArray(o.historyTail)
      ? o.historyTail.slice(-12).map((h) => ({
          turn: clampNum(Number((h as { turn?: number }).turn ?? turn), 0, 1_000_000),
          inputHash: String((h as { inputHash?: string }).inputHash ?? ''),
          aggregateSeaLevelExposure: clampNum(Number((h as { aggregateSeaLevelExposure?: number }).aggregateSeaLevelExposure ?? 0), 0, 100),
        }))
      : [],
    aiReadCache: o.aiReadCache && typeof o.aiReadCache === 'object' ? { ...o.aiReadCache } : {},
  };
}
