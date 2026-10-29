import {
  V1024_DGOV_SCHEMA_VERSION,
  type V1024DgovPersisted,
  type V1024DgovRegionId,
} from '../types/core';

const REGIONS: V1024DgovRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function createEmptyV1024DgovPersisted(): V1024DgovPersisted {
  const regionalDataSovereignty: V1024DgovPersisted['regionalDataSovereignty'] = {};
  REGIONS.forEach((r, i) => {
    regionalDataSovereignty[r] = {
      bufferIndex: 44 + (i % 6),
      rerouteStress: 36 + (i % 8),
      compositeCapacity: 54 + (i % 5),
      exposedSystems: 2 + (i % 4),
    };
  });
  return {
    schemaVersion: V1024_DGOV_SCHEMA_VERSION,
    revision: 0,
    lastProcessedTurn: null,
    policySnapshots: {},
    dataSovereigntyGraphRevision: 0,
    regionalDataSovereignty,
    historyTail: [],
    aiReadCache: {},
  };
}

function clampNum(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

export function sanitizeV1024DgovPersisted(raw: unknown, turn: number): V1024DgovPersisted {
  const base = createEmptyV1024DgovPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<V1024DgovPersisted>;
  const schema =
    o.schemaVersion === V1024_DGOV_SCHEMA_VERSION ? o.schemaVersion : V1024_DGOV_SCHEMA_VERSION;
  return {
    schemaVersion: schema,
    revision: clampNum(Number(o.revision ?? 0), 0, 1_000_000),
    lastProcessedTurn: o.lastProcessedTurn == null ? null : clampNum(Number(o.lastProcessedTurn), 0, 1_000_000),
    policySnapshots: o.policySnapshots && typeof o.policySnapshots === 'object' ? { ...o.policySnapshots } : {},
    dataSovereigntyGraphRevision: clampNum(Number(o.dataSovereigntyGraphRevision ?? 0), 0, 1_000_000),
    regionalDataSovereignty: { ...base.regionalDataSovereignty, ...(o.regionalDataSovereignty ?? {}) },
    historyTail: Array.isArray(o.historyTail)
      ? o.historyTail.slice(-12).map((h) => ({
          turn: clampNum(Number((h as { turn?: number }).turn ?? turn), 0, 1_000_000),
          inputHash: String((h as { inputHash?: string }).inputHash ?? ''),
          aggregateComplianceStress: clampNum(Number((h as { aggregateComplianceStress?: number }).aggregateComplianceStress ?? 0), 0, 100),
        }))
      : [],
    aiReadCache: o.aiReadCache && typeof o.aiReadCache === 'object' ? { ...o.aiReadCache } : {},
  };
}
