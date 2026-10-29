import {
  V1034_CIRES_SCHEMA_VERSION,
  type V1034CiresPersisted,
  type V1034CiresRegionId,
} from '../types/core';

const REGIONS: V1034CiresRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function createEmptyV1034CiresPersisted(): V1034CiresPersisted {
  const regionalSegmentBuffer: V1034CiresPersisted['regionalSegmentBuffer'] = {};
  REGIONS.forEach((r, i) => {
    regionalSegmentBuffer[r] = {
      bufferIndex: 44 + (i % 6),
      rerouteStress: 36 + (i % 8),
      compositeCapacity: 54 + (i % 5),
      exposedSystems: 2 + (i % 4),
    };
  });
  return {
    schemaVersion: V1034_CIRES_SCHEMA_VERSION,
    revision: 0,
    lastProcessedTurn: null,
    compromiseSnapshots: {},
    segmentBufferGraphRevision: 0,
    regionalSegmentBuffer,
    historyTail: [],
    aiReadCache: {},
  };
}

function clampNum(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

export function sanitizeV1034CiresPersisted(raw: unknown, turn: number): V1034CiresPersisted {
  const base = createEmptyV1034CiresPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<V1034CiresPersisted>;
  const schema =
    o.schemaVersion === V1034_CIRES_SCHEMA_VERSION ? o.schemaVersion : V1034_CIRES_SCHEMA_VERSION;
  return {
    schemaVersion: schema,
    revision: clampNum(Number(o.revision ?? 0), 0, 1_000_000),
    lastProcessedTurn: o.lastProcessedTurn == null ? null : clampNum(Number(o.lastProcessedTurn), 0, 1_000_000),
    compromiseSnapshots: o.compromiseSnapshots && typeof o.compromiseSnapshots === 'object' ? { ...o.compromiseSnapshots } : {},
    segmentBufferGraphRevision: clampNum(Number(o.segmentBufferGraphRevision ?? 0), 0, 1_000_000),
    regionalSegmentBuffer: { ...base.regionalSegmentBuffer, ...(o.regionalSegmentBuffer ?? {}) },
    historyTail: Array.isArray(o.historyTail)
      ? o.historyTail.slice(-12).map((h) => ({
          turn: clampNum(Number((h as { turn?: number }).turn ?? turn), 0, 1_000_000),
          inputHash: String((h as { inputHash?: string }).inputHash ?? ''),
          aggregateCyberPhysicalStressExposure: clampNum(Number((h as { aggregateCyberPhysicalStressExposure?: number }).aggregateCyberPhysicalStressExposure ?? 0), 0, 100),
        }))
      : [],
    aiReadCache: o.aiReadCache && typeof o.aiReadCache === 'object' ? { ...o.aiReadCache } : {},
  };
}
