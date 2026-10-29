import {
  V1033_SCRES_SCHEMA_VERSION,
  type V1033ScresPersisted,
  type V1033ScresRegionId,
} from '../types/core';

const REGIONS: V1033ScresRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function createEmptyV1033ScresPersisted(): V1033ScresPersisted {
  const regionalCorridorBuffer: V1033ScresPersisted['regionalCorridorBuffer'] = {};
  REGIONS.forEach((r, i) => {
    regionalCorridorBuffer[r] = {
      bufferIndex: 44 + (i % 6),
      rerouteStress: 36 + (i % 8),
      compositeCapacity: 54 + (i % 5),
      exposedSystems: 2 + (i % 4),
    };
  });
  return {
    schemaVersion: V1033_SCRES_SCHEMA_VERSION,
    revision: 0,
    lastProcessedTurn: null,
    disruptionSnapshots: {},
    corridorBufferGraphRevision: 0,
    regionalCorridorBuffer,
    historyTail: [],
    aiReadCache: {},
  };
}

function clampNum(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

export function sanitizeV1033ScresPersisted(raw: unknown, turn: number): V1033ScresPersisted {
  const base = createEmptyV1033ScresPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<V1033ScresPersisted>;
  const schema =
    o.schemaVersion === V1033_SCRES_SCHEMA_VERSION ? o.schemaVersion : V1033_SCRES_SCHEMA_VERSION;
  return {
    schemaVersion: schema,
    revision: clampNum(Number(o.revision ?? 0), 0, 1_000_000),
    lastProcessedTurn: o.lastProcessedTurn == null ? null : clampNum(Number(o.lastProcessedTurn), 0, 1_000_000),
    disruptionSnapshots: o.disruptionSnapshots && typeof o.disruptionSnapshots === 'object' ? { ...o.disruptionSnapshots } : {},
    corridorBufferGraphRevision: clampNum(Number(o.corridorBufferGraphRevision ?? 0), 0, 1_000_000),
    regionalCorridorBuffer: { ...base.regionalCorridorBuffer, ...(o.regionalCorridorBuffer ?? {}) },
    historyTail: Array.isArray(o.historyTail)
      ? o.historyTail.slice(-12).map((h) => ({
          turn: clampNum(Number((h as { turn?: number }).turn ?? turn), 0, 1_000_000),
          inputHash: String((h as { inputHash?: string }).inputHash ?? ''),
          aggregateLogisticsStressExposure: clampNum(Number((h as { aggregateLogisticsStressExposure?: number }).aggregateLogisticsStressExposure ?? 0), 0, 100),
        }))
      : [],
    aiReadCache: o.aiReadCache && typeof o.aiReadCache === 'object' ? { ...o.aiReadCache } : {},
  };
}
