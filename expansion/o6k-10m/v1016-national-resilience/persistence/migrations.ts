import {
  V1016_NRES_SCHEMA_VERSION,
  type V1016NresPersisted,
  type V1016NresRegionId,
} from '../types/core';

const REGIONS: V1016NresRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function createEmptyV1016NresPersisted(): V1016NresPersisted {
  const regionalContinuity: V1016NresPersisted['regionalContinuity'] = {};
  REGIONS.forEach((r, i) => {
    regionalContinuity[r] = {
      bufferIndex: 44 + (i % 6),
      rerouteStress: 36 + (i % 8),
      compositeContinuity: 54 + (i % 5),
      exposedSystems: 2 + (i % 4),
    };
  });
  return {
    schemaVersion: V1016_NRES_SCHEMA_VERSION,
    revision: 0,
    lastProcessedTurn: null,
    shockSnapshots: {},
    propagationGraphRevision: 0,
    regionalContinuity,
    historyTail: [],
    aiReadCache: {},
  };
}

function clampNum(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

export function sanitizeV1016NresPersisted(raw: unknown, turn: number): V1016NresPersisted {
  const base = createEmptyV1016NresPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<V1016NresPersisted>;
  const schema =
    o.schemaVersion === V1016_NRES_SCHEMA_VERSION ? o.schemaVersion : V1016_NRES_SCHEMA_VERSION;
  return {
    schemaVersion: schema,
    revision: clampNum(Number(o.revision ?? 0), 0, 1_000_000),
    lastProcessedTurn: o.lastProcessedTurn == null ? null : clampNum(Number(o.lastProcessedTurn), 0, 1_000_000),
    shockSnapshots: o.shockSnapshots && typeof o.shockSnapshots === 'object' ? { ...o.shockSnapshots } : {},
    propagationGraphRevision: clampNum(Number(o.propagationGraphRevision ?? 0), 0, 1_000_000),
    regionalContinuity: { ...base.regionalContinuity, ...(o.regionalContinuity ?? {}) },
    historyTail: Array.isArray(o.historyTail)
      ? o.historyTail.slice(-12).map((h) => ({
          turn: clampNum(Number((h as { turn?: number }).turn ?? turn), 0, 1_000_000),
          inputHash: String((h as { inputHash?: string }).inputHash ?? ''),
          aggregateSeverity: clampNum(Number((h as { aggregateSeverity?: number }).aggregateSeverity ?? 0), 0, 100),
        }))
      : [],
    aiReadCache: o.aiReadCache && typeof o.aiReadCache === 'object' ? { ...o.aiReadCache } : {},
  };
}
