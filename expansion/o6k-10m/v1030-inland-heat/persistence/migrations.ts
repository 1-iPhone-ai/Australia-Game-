import {
  V1030_IHEAT_SCHEMA_VERSION,
  type V1030IheatPersisted,
  type V1030IheatRegionId,
} from '../types/core';

const REGIONS: V1030IheatRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function createEmptyV1030IheatPersisted(): V1030IheatPersisted {
  const regionalAridBuffer: V1030IheatPersisted['regionalAridBuffer'] = {};
  REGIONS.forEach((r, i) => {
    regionalAridBuffer[r] = {
      bufferIndex: 44 + (i % 6),
      rerouteStress: 36 + (i % 8),
      compositeCapacity: 54 + (i % 5),
      exposedSystems: 2 + (i % 4),
    };
  });
  return {
    schemaVersion: V1030_IHEAT_SCHEMA_VERSION,
    revision: 0,
    lastProcessedTurn: null,
    heatwaveSnapshots: {},
    aridBufferGraphRevision: 0,
    regionalAridBuffer,
    historyTail: [],
    aiReadCache: {},
  };
}

function clampNum(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

export function sanitizeV1030IheatPersisted(raw: unknown, turn: number): V1030IheatPersisted {
  const base = createEmptyV1030IheatPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<V1030IheatPersisted>;
  const schema =
    o.schemaVersion === V1030_IHEAT_SCHEMA_VERSION ? o.schemaVersion : V1030_IHEAT_SCHEMA_VERSION;
  return {
    schemaVersion: schema,
    revision: clampNum(Number(o.revision ?? 0), 0, 1_000_000),
    lastProcessedTurn: o.lastProcessedTurn == null ? null : clampNum(Number(o.lastProcessedTurn), 0, 1_000_000),
    heatwaveSnapshots: o.heatwaveSnapshots && typeof o.heatwaveSnapshots === 'object' ? { ...o.heatwaveSnapshots } : {},
    aridBufferGraphRevision: clampNum(Number(o.aridBufferGraphRevision ?? 0), 0, 1_000_000),
    regionalAridBuffer: { ...base.regionalAridBuffer, ...(o.regionalAridBuffer ?? {}) },
    historyTail: Array.isArray(o.historyTail)
      ? o.historyTail.slice(-12).map((h) => ({
          turn: clampNum(Number((h as { turn?: number }).turn ?? turn), 0, 1_000_000),
          inputHash: String((h as { inputHash?: string }).inputHash ?? ''),
          aggregateInlandHeatExposure: clampNum(Number((h as { aggregateInlandHeatExposure?: number }).aggregateInlandHeatExposure ?? 0), 0, 100),
        }))
      : [],
    aiReadCache: o.aiReadCache && typeof o.aiReadCache === 'object' ? { ...o.aiReadCache } : {},
  };
}
