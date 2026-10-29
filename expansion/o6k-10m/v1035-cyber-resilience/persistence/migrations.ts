import {
  V1035_CYRES_SCHEMA_VERSION,
  type V1035CyresPersisted,
  type V1035CyresRegionId,
} from '../types/core';

const REGIONS: V1035CyresRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function createEmptyV1035CyresPersisted(): V1035CyresPersisted {
  const regionalSegmentBuffer: V1035CyresPersisted['regionalSegmentBuffer'] = {};
  REGIONS.forEach((r, i) => {
    regionalSegmentBuffer[r] = {
      bufferIndex: 44 + (i % 6),
      rerouteStress: 36 + (i % 8),
      compositeCapacity: 54 + (i % 5),
      exposedSystems: 2 + (i % 4),
    };
  });
  return {
    schemaVersion: V1035_CYRES_SCHEMA_VERSION,
    revision: 0,
    lastProcessedTurn: null,
    intrusionSnapshots: {},
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

export function sanitizeV1035CyresPersisted(raw: unknown, turn: number): V1035CyresPersisted {
  const base = createEmptyV1035CyresPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<V1035CyresPersisted>;
  const schema =
    o.schemaVersion === V1035_CYRES_SCHEMA_VERSION ? o.schemaVersion : V1035_CYRES_SCHEMA_VERSION;
  return {
    schemaVersion: schema,
    revision: clampNum(Number(o.revision ?? 0), 0, 1_000_000),
    lastProcessedTurn: o.lastProcessedTurn == null ? null : clampNum(Number(o.lastProcessedTurn), 0, 1_000_000),
    intrusionSnapshots: o.intrusionSnapshots && typeof o.intrusionSnapshots === 'object' ? { ...o.intrusionSnapshots } : {},
    segmentBufferGraphRevision: clampNum(Number(o.segmentBufferGraphRevision ?? 0), 0, 1_000_000),
    regionalSegmentBuffer: { ...base.regionalSegmentBuffer, ...(o.regionalSegmentBuffer ?? {}) },
    historyTail: Array.isArray(o.historyTail)
      ? o.historyTail.slice(-12).map((h) => ({
          turn: clampNum(Number((h as { turn?: number }).turn ?? turn), 0, 1_000_000),
          inputHash: String((h as { inputHash?: string }).inputHash ?? ''),
          aggregateSovereignDigitalStressExposure: clampNum(Number((h as { aggregateSovereignDigitalStressExposure?: number }).aggregateSovereignDigitalStressExposure ?? 0), 0, 100),
        }))
      : [],
    aiReadCache: o.aiReadCache && typeof o.aiReadCache === 'object' ? { ...o.aiReadCache } : {},
  };
}
