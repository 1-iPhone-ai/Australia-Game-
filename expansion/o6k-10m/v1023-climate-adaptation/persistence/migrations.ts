import {
  V1023_CLAD_SCHEMA_VERSION,
  type V1023CladPersisted,
  type V1023CladRegionId,
} from '../types/core';

const REGIONS: V1023CladRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function createEmptyV1023CladPersisted(): V1023CladPersisted {
  const regionalDroughtBuffer: V1023CladPersisted['regionalDroughtBuffer'] = {};
  REGIONS.forEach((r, i) => {
    regionalDroughtBuffer[r] = {
      bufferIndex: 44 + (i % 6),
      rerouteStress: 36 + (i % 8),
      compositeCapacity: 54 + (i % 5),
      exposedSystems: 2 + (i % 4),
    };
  });
  return {
    schemaVersion: V1023_CLAD_SCHEMA_VERSION,
    revision: 0,
    lastProcessedTurn: null,
    hazardSnapshots: {},
    droughtBufferGraphRevision: 0,
    regionalDroughtBuffer,
    historyTail: [],
    aiReadCache: {},
  };
}

function clampNum(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

export function sanitizeV1023CladPersisted(raw: unknown, turn: number): V1023CladPersisted {
  const base = createEmptyV1023CladPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<V1023CladPersisted>;
  const schema =
    o.schemaVersion === V1023_CLAD_SCHEMA_VERSION ? o.schemaVersion : V1023_CLAD_SCHEMA_VERSION;
  return {
    schemaVersion: schema,
    revision: clampNum(Number(o.revision ?? 0), 0, 1_000_000),
    lastProcessedTurn: o.lastProcessedTurn == null ? null : clampNum(Number(o.lastProcessedTurn), 0, 1_000_000),
    hazardSnapshots: o.hazardSnapshots && typeof o.hazardSnapshots === 'object' ? { ...o.hazardSnapshots } : {},
    droughtBufferGraphRevision: clampNum(Number(o.droughtBufferGraphRevision ?? 0), 0, 1_000_000),
    regionalDroughtBuffer: { ...base.regionalDroughtBuffer, ...(o.regionalDroughtBuffer ?? {}) },
    historyTail: Array.isArray(o.historyTail)
      ? o.historyTail.slice(-12).map((h) => ({
          turn: clampNum(Number((h as { turn?: number }).turn ?? turn), 0, 1_000_000),
          inputHash: String((h as { inputHash?: string }).inputHash ?? ''),
          aggregateHeatStress: clampNum(Number((h as { aggregateHeatStress?: number }).aggregateHeatStress ?? 0), 0, 100),
        }))
      : [],
    aiReadCache: o.aiReadCache && typeof o.aiReadCache === 'object' ? { ...o.aiReadCache } : {},
  };
}
