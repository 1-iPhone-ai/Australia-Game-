import {
  V1031_GRES_SCHEMA_VERSION,
  type V1031GresPersisted,
  type V1031GresRegionId,
} from '../types/core';

const REGIONS: V1031GresRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function createEmptyV1031GresPersisted(): V1031GresPersisted {
  const regionalGridBuffer: V1031GresPersisted['regionalGridBuffer'] = {};
  REGIONS.forEach((r, i) => {
    regionalGridBuffer[r] = {
      bufferIndex: 44 + (i % 6),
      rerouteStress: 36 + (i % 8),
      compositeCapacity: 54 + (i % 5),
      exposedSystems: 2 + (i % 4),
    };
  });
  return {
    schemaVersion: V1031_GRES_SCHEMA_VERSION,
    revision: 0,
    lastProcessedTurn: null,
    outageSnapshots: {},
    gridBufferGraphRevision: 0,
    regionalGridBuffer,
    historyTail: [],
    aiReadCache: {},
  };
}

function clampNum(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

export function sanitizeV1031GresPersisted(raw: unknown, turn: number): V1031GresPersisted {
  const base = createEmptyV1031GresPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<V1031GresPersisted>;
  const schema =
    o.schemaVersion === V1031_GRES_SCHEMA_VERSION ? o.schemaVersion : V1031_GRES_SCHEMA_VERSION;
  return {
    schemaVersion: schema,
    revision: clampNum(Number(o.revision ?? 0), 0, 1_000_000),
    lastProcessedTurn: o.lastProcessedTurn == null ? null : clampNum(Number(o.lastProcessedTurn), 0, 1_000_000),
    outageSnapshots: o.outageSnapshots && typeof o.outageSnapshots === 'object' ? { ...o.outageSnapshots } : {},
    gridBufferGraphRevision: clampNum(Number(o.gridBufferGraphRevision ?? 0), 0, 1_000_000),
    regionalGridBuffer: { ...base.regionalGridBuffer, ...(o.regionalGridBuffer ?? {}) },
    historyTail: Array.isArray(o.historyTail)
      ? o.historyTail.slice(-12).map((h) => ({
          turn: clampNum(Number((h as { turn?: number }).turn ?? turn), 0, 1_000_000),
          inputHash: String((h as { inputHash?: string }).inputHash ?? ''),
          aggregateGridStressExposure: clampNum(Number((h as { aggregateGridStressExposure?: number }).aggregateGridStressExposure ?? 0), 0, 100),
        }))
      : [],
    aiReadCache: o.aiReadCache && typeof o.aiReadCache === 'object' ? { ...o.aiReadCache } : {},
  };
}
