import {
  V1022_HAFF_SCHEMA_VERSION,
  type V1022HaffPersisted,
  type V1022HaffRegionId,
} from '../types/core';

const REGIONS: V1022HaffRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function createEmptyV1022HaffPersisted(): V1022HaffPersisted {
  const regionalSupplyPipeline: V1022HaffPersisted['regionalSupplyPipeline'] = {};
  REGIONS.forEach((r, i) => {
    regionalSupplyPipeline[r] = {
      bufferIndex: 44 + (i % 6),
      rerouteStress: 36 + (i % 8),
      compositeCapacity: 54 + (i % 5),
      exposedSystems: 2 + (i % 4),
    };
  });
  return {
    schemaVersion: V1022_HAFF_SCHEMA_VERSION,
    revision: 0,
    lastProcessedTurn: null,
    stressSnapshots: {},
    supplyPipelineGraphRevision: 0,
    regionalSupplyPipeline,
    historyTail: [],
    aiReadCache: {},
  };
}

function clampNum(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

export function sanitizeV1022HaffPersisted(raw: unknown, turn: number): V1022HaffPersisted {
  const base = createEmptyV1022HaffPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<V1022HaffPersisted>;
  const schema =
    o.schemaVersion === V1022_HAFF_SCHEMA_VERSION ? o.schemaVersion : V1022_HAFF_SCHEMA_VERSION;
  return {
    schemaVersion: schema,
    revision: clampNum(Number(o.revision ?? 0), 0, 1_000_000),
    lastProcessedTurn: o.lastProcessedTurn == null ? null : clampNum(Number(o.lastProcessedTurn), 0, 1_000_000),
    stressSnapshots: o.stressSnapshots && typeof o.stressSnapshots === 'object' ? { ...o.stressSnapshots } : {},
    supplyPipelineGraphRevision: clampNum(Number(o.supplyPipelineGraphRevision ?? 0), 0, 1_000_000),
    regionalSupplyPipeline: { ...base.regionalSupplyPipeline, ...(o.regionalSupplyPipeline ?? {}) },
    historyTail: Array.isArray(o.historyTail)
      ? o.historyTail.slice(-12).map((h) => ({
          turn: clampNum(Number((h as { turn?: number }).turn ?? turn), 0, 1_000_000),
          inputHash: String((h as { inputHash?: string }).inputHash ?? ''),
          aggregateRentStress: clampNum(Number((h as { aggregateRentStress?: number }).aggregateRentStress ?? 0), 0, 100),
        }))
      : [],
    aiReadCache: o.aiReadCache && typeof o.aiReadCache === 'object' ? { ...o.aiReadCache } : {},
  };
}
