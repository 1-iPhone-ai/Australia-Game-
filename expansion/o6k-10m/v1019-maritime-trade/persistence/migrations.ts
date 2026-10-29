import {
  V1019_MTRD_SCHEMA_VERSION,
  type V1019MtrdPersisted,
  type V1019MtrdRegionId,
} from '../types/core';

const REGIONS: V1019MtrdRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function createEmptyV1019MtrdPersisted(): V1019MtrdPersisted {
  const regionalPort: V1019MtrdPersisted['regionalPort'] = {};
  REGIONS.forEach((r, i) => {
    regionalPort[r] = {
      bufferIndex: 44 + (i % 6),
      rerouteStress: 36 + (i % 8),
      compositePort: 54 + (i % 5),
      exposedSystems: 2 + (i % 4),
    };
  });
  return {
    schemaVersion: V1019_MTRD_SCHEMA_VERSION,
    revision: 0,
    lastProcessedTurn: null,
    laneSnapshots: {},
    laneGraphRevision: 0,
    regionalPort,
    historyTail: [],
    aiReadCache: {},
  };
}

function clampNum(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

export function sanitizeV1019MtrdPersisted(raw: unknown, turn: number): V1019MtrdPersisted {
  const base = createEmptyV1019MtrdPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<V1019MtrdPersisted> & {
    routeSnapshots?: V1019MtrdPersisted['laneSnapshots'];
    corridorGraphRevision?: number;
    regionalHub?: V1019MtrdPersisted['regionalPort'];
  };
  const schema =
    o.schemaVersion === V1019_MTRD_SCHEMA_VERSION ? o.schemaVersion : V1019_MTRD_SCHEMA_VERSION;
  const laneSnapshots =
    o.laneSnapshots && typeof o.laneSnapshots === 'object'
      ? { ...o.laneSnapshots }
      : o.routeSnapshots && typeof o.routeSnapshots === 'object'
        ? { ...o.routeSnapshots }
        : {};
  return {
    schemaVersion: schema,
    revision: clampNum(Number(o.revision ?? 0), 0, 1_000_000),
    lastProcessedTurn: o.lastProcessedTurn == null ? null : clampNum(Number(o.lastProcessedTurn), 0, 1_000_000),
    laneSnapshots,
    laneGraphRevision: clampNum(
      Number(o.laneGraphRevision ?? o.corridorGraphRevision ?? 0),
      0,
      1_000_000,
    ),
    regionalPort: { ...base.regionalPort, ...(o.regionalPort ?? o.regionalHub ?? {}) },
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
