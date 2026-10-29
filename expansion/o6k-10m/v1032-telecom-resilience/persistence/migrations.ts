import {
  V1032_TRES_SCHEMA_VERSION,
  type V1032TresPersisted,
  type V1032TresRegionId,
} from '../types/core';

const REGIONS: V1032TresRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function createEmptyV1032TresPersisted(): V1032TresPersisted {
  const regionalBackboneBuffer: V1032TresPersisted['regionalBackboneBuffer'] = {};
  REGIONS.forEach((r, i) => {
    regionalBackboneBuffer[r] = {
      bufferIndex: 44 + (i % 6),
      rerouteStress: 36 + (i % 8),
      compositeCapacity: 54 + (i % 5),
      exposedSystems: 2 + (i % 4),
    };
  });
  return {
    schemaVersion: V1032_TRES_SCHEMA_VERSION,
    revision: 0,
    lastProcessedTurn: null,
    failoverSnapshots: {},
    backboneBufferGraphRevision: 0,
    regionalBackboneBuffer,
    historyTail: [],
    aiReadCache: {},
  };
}

function clampNum(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

export function sanitizeV1032TresPersisted(raw: unknown, turn: number): V1032TresPersisted {
  const base = createEmptyV1032TresPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<V1032TresPersisted>;
  const schema =
    o.schemaVersion === V1032_TRES_SCHEMA_VERSION ? o.schemaVersion : V1032_TRES_SCHEMA_VERSION;
  return {
    schemaVersion: schema,
    revision: clampNum(Number(o.revision ?? 0), 0, 1_000_000),
    lastProcessedTurn: o.lastProcessedTurn == null ? null : clampNum(Number(o.lastProcessedTurn), 0, 1_000_000),
    failoverSnapshots: o.failoverSnapshots && typeof o.failoverSnapshots === 'object' ? { ...o.failoverSnapshots } : {},
    backboneBufferGraphRevision: clampNum(Number(o.backboneBufferGraphRevision ?? 0), 0, 1_000_000),
    regionalBackboneBuffer: { ...base.regionalBackboneBuffer, ...(o.regionalBackboneBuffer ?? {}) },
    historyTail: Array.isArray(o.historyTail)
      ? o.historyTail.slice(-12).map((h) => ({
          turn: clampNum(Number((h as { turn?: number }).turn ?? turn), 0, 1_000_000),
          inputHash: String((h as { inputHash?: string }).inputHash ?? ''),
          aggregateTelecomStressExposure: clampNum(Number((h as { aggregateTelecomStressExposure?: number }).aggregateTelecomStressExposure ?? 0), 0, 100),
        }))
      : [],
    aiReadCache: o.aiReadCache && typeof o.aiReadCache === 'object' ? { ...o.aiReadCache } : {},
  };
}
