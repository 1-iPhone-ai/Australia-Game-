import {
  V1017_ICLOG_SCHEMA_VERSION,
  type V1017IclogPersisted,
  type V1017IclogRegionId,
} from '../types/core';

const REGIONS: V1017IclogRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function createEmptyV1017IclogPersisted(): V1017IclogPersisted {
  const regionalHub: V1017IclogPersisted['regionalHub'] = {};
  REGIONS.forEach((r, i) => {
    regionalHub[r] = {
      bufferIndex: 44 + (i % 6),
      rerouteStress: 36 + (i % 8),
      compositeHub: 54 + (i % 5),
      exposedSystems: 2 + (i % 4),
    };
  });
  return {
    schemaVersion: V1017_ICLOG_SCHEMA_VERSION,
    revision: 0,
    lastProcessedTurn: null,
    routeSnapshots: {},
    corridorGraphRevision: 0,
    regionalHub,
    historyTail: [],
    aiReadCache: {},
  };
}

function clampNum(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

export function sanitizeV1017IclogPersisted(raw: unknown, turn: number): V1017IclogPersisted {
  const base = createEmptyV1017IclogPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<V1017IclogPersisted>;
  const schema =
    o.schemaVersion === V1017_ICLOG_SCHEMA_VERSION ? o.schemaVersion : V1017_ICLOG_SCHEMA_VERSION;
  return {
    schemaVersion: schema,
    revision: clampNum(Number(o.revision ?? 0), 0, 1_000_000),
    lastProcessedTurn: o.lastProcessedTurn == null ? null : clampNum(Number(o.lastProcessedTurn), 0, 1_000_000),
    routeSnapshots: o.routeSnapshots && typeof o.routeSnapshots === 'object' ? { ...o.routeSnapshots } : {},
    corridorGraphRevision: clampNum(Number(o.corridorGraphRevision ?? 0), 0, 1_000_000),
    regionalHub: { ...base.regionalHub, ...(o.regionalHub ?? {}) },
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
