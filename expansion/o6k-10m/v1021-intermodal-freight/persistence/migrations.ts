import {
  V1021_IMFD_SCHEMA_VERSION,
  type V1021ImfdPersisted,
  type V1021ImfdRegionId,
} from '../types/core';

const REGIONS: V1021ImfdRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function createEmptyV1021ImfdPersisted(): V1021ImfdPersisted {
  const regionalHandoff: V1021ImfdPersisted['regionalHandoff'] = {};
  REGIONS.forEach((r, i) => {
    regionalHandoff[r] = {
      bufferIndex: 44 + (i % 6),
      rerouteStress: 36 + (i % 8),
      compositeCapacity: 54 + (i % 5),
      exposedSystems: 2 + (i % 4),
    };
  });
  return {
    schemaVersion: V1021_IMFD_SCHEMA_VERSION,
    revision: 0,
    lastProcessedTurn: null,
    corridorSnapshots: {},
    handoffStackGraphRevision: 0,
    regionalHandoff,
    historyTail: [],
    aiReadCache: {},
  };
}

function clampNum(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

export function sanitizeV1021ImfdPersisted(raw: unknown, turn: number): V1021ImfdPersisted {
  const base = createEmptyV1021ImfdPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<V1021ImfdPersisted>;
  const schema =
    o.schemaVersion === V1021_IMFD_SCHEMA_VERSION ? o.schemaVersion : V1021_IMFD_SCHEMA_VERSION;
  return {
    schemaVersion: schema,
    revision: clampNum(Number(o.revision ?? 0), 0, 1_000_000),
    lastProcessedTurn: o.lastProcessedTurn == null ? null : clampNum(Number(o.lastProcessedTurn), 0, 1_000_000),
    corridorSnapshots: o.corridorSnapshots && typeof o.corridorSnapshots === 'object' ? { ...o.corridorSnapshots } : {},
    handoffStackGraphRevision: clampNum(Number(o.handoffStackGraphRevision ?? 0), 0, 1_000_000),
    regionalHandoff: { ...base.regionalHandoff, ...(o.regionalHandoff ?? {}) },
    historyTail: Array.isArray(o.historyTail)
      ? o.historyTail.slice(-12).map((h) => ({
          turn: clampNum(Number((h as { turn?: number }).turn ?? turn), 0, 1_000_000),
          inputHash: String((h as { inputHash?: string }).inputHash ?? ''),
          aggregateDwellPenalty: clampNum(Number((h as { aggregateDwellPenalty?: number }).aggregateDwellPenalty ?? 0), 0, 100),
        }))
      : [],
    aiReadCache: o.aiReadCache && typeof o.aiReadCache === 'object' ? { ...o.aiReadCache } : {},
  };
}
