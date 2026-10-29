import {
  V1014_WORKFORCE_SCHEMA_VERSION,
  type V1014WorkforcePersisted,
  type V1014WorkforceRegionId,
} from '../types/core';

const REGIONS: V1014WorkforceRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function createEmptyV1014WorkforceMigrationPersisted(): V1014WorkforcePersisted {
  const regionalAggregates: V1014WorkforcePersisted['regionalAggregates'] = {};
  REGIONS.forEach((r, i) => {
    regionalAggregates[r] = {
      queuePressure: 42 + (i % 5),
      mismatchIndex: 38 + (i % 7),
      migrationLoopGain: 0.55,
      compositeReadiness: 52 + (i % 4),
    };
  });
  return {
    schemaVersion: V1014_WORKFORCE_SCHEMA_VERSION,
    revision: 0,
    lastProcessedTurn: null,
    migrationSnapshots: {},
    skillsGraphRevision: 0,
    regionalAggregates,
    historyTail: [],
    aiReadCache: {},
  };
}

function clampNum(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

export function sanitizeV1014WorkforceMigrationPersisted(
  raw: unknown,
  turn: number,
): V1014WorkforcePersisted {
  const base = createEmptyV1014WorkforceMigrationPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<V1014WorkforcePersisted>;
  const schema =
    o.schemaVersion === V1014_WORKFORCE_SCHEMA_VERSION ? o.schemaVersion : V1014_WORKFORCE_SCHEMA_VERSION;
  return {
    schemaVersion: schema,
    revision: clampNum(Number(o.revision ?? 0), 0, 1_000_000),
    lastProcessedTurn: o.lastProcessedTurn == null ? null : clampNum(Number(o.lastProcessedTurn), 0, 1_000_000),
    migrationSnapshots:
      o.migrationSnapshots && typeof o.migrationSnapshots === 'object' ? { ...o.migrationSnapshots } : {},
    skillsGraphRevision: clampNum(Number(o.skillsGraphRevision ?? 0), 0, 1_000_000),
    regionalAggregates: { ...base.regionalAggregates, ...(o.regionalAggregates ?? {}) },
    historyTail: Array.isArray(o.historyTail)
      ? o.historyTail.slice(-12).map((h) => ({
          turn: clampNum(Number((h as { turn?: number }).turn ?? turn), 0, 1_000_000),
          inputHash: String((h as { inputHash?: string }).inputHash ?? ''),
          aggregateMismatch: clampNum(Number((h as { aggregateMismatch?: number }).aggregateMismatch ?? 0), 0, 100),
        }))
      : [],
    aiReadCache: o.aiReadCache && typeof o.aiReadCache === 'object' ? { ...o.aiReadCache } : {},
  };
}
