import {
  V1020_RPIPE_SCHEMA_VERSION,
  type V1020RpipePersisted,
  type V1020RpipeRegionId,
} from '../types/core';

const REGIONS: V1020RpipeRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function createEmptyV1020RpipePersisted(): V1020RpipePersisted {
  const regionalCompliance: V1020RpipePersisted['regionalCompliance'] = {};
  REGIONS.forEach((r, i) => {
    regionalCompliance[r] = {
      bufferIndex: 44 + (i % 6),
      rerouteStress: 36 + (i % 8),
      compositeCompliance: 54 + (i % 5),
      exposedSystems: 2 + (i % 4),
    };
  });
  return {
    schemaVersion: V1020_RPIPE_SCHEMA_VERSION,
    revision: 0,
    lastProcessedTurn: null,
    pipelineSnapshots: {},
    commercializationStackGraphRevision: 0,
    regionalCompliance,
    historyTail: [],
    aiReadCache: {},
  };
}

function clampNum(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

export function sanitizeV1020RpipePersisted(raw: unknown, turn: number): V1020RpipePersisted {
  const base = createEmptyV1020RpipePersisted();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<V1020RpipePersisted>;
  const schema =
    o.schemaVersion === V1020_RPIPE_SCHEMA_VERSION ? o.schemaVersion : V1020_RPIPE_SCHEMA_VERSION;
  return {
    schemaVersion: schema,
    revision: clampNum(Number(o.revision ?? 0), 0, 1_000_000),
    lastProcessedTurn: o.lastProcessedTurn == null ? null : clampNum(Number(o.lastProcessedTurn), 0, 1_000_000),
    pipelineSnapshots: o.pipelineSnapshots && typeof o.pipelineSnapshots === 'object' ? { ...o.pipelineSnapshots } : {},
    commercializationStackGraphRevision: clampNum(Number(o.commercializationStackGraphRevision ?? 0), 0, 1_000_000),
    regionalCompliance: { ...base.regionalCompliance, ...(o.regionalCompliance ?? {}) },
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
