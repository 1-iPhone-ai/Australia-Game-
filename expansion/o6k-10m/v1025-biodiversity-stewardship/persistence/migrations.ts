import {
  V1025_BIO_SCHEMA_VERSION,
  type V1025BioPersisted,
  type V1025BioRegionId,
} from '../types/core';

const REGIONS: V1025BioRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function createEmptyV1025BioPersisted(): V1025BioPersisted {
  const regionalConservationOffset: V1025BioPersisted['regionalConservationOffset'] = {};
  REGIONS.forEach((r, i) => {
    regionalConservationOffset[r] = {
      bufferIndex: 44 + (i % 6),
      rerouteStress: 36 + (i % 8),
      compositeCapacity: 54 + (i % 5),
      exposedSystems: 2 + (i % 4),
    };
  });
  return {
    schemaVersion: V1025_BIO_SCHEMA_VERSION,
    revision: 0,
    lastProcessedTurn: null,
    recoverySnapshots: {},
    conservationOffsetGraphRevision: 0,
    regionalConservationOffset,
    historyTail: [],
    aiReadCache: {},
  };
}

function clampNum(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

export function sanitizeV1025BioPersisted(raw: unknown, turn: number): V1025BioPersisted {
  const base = createEmptyV1025BioPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<V1025BioPersisted>;
  const schema =
    o.schemaVersion === V1025_BIO_SCHEMA_VERSION ? o.schemaVersion : V1025_BIO_SCHEMA_VERSION;
  return {
    schemaVersion: schema,
    revision: clampNum(Number(o.revision ?? 0), 0, 1_000_000),
    lastProcessedTurn: o.lastProcessedTurn == null ? null : clampNum(Number(o.lastProcessedTurn), 0, 1_000_000),
    recoverySnapshots: o.recoverySnapshots && typeof o.recoverySnapshots === 'object' ? { ...o.recoverySnapshots } : {},
    conservationOffsetGraphRevision: clampNum(Number(o.conservationOffsetGraphRevision ?? 0), 0, 1_000_000),
    regionalConservationOffset: { ...base.regionalConservationOffset, ...(o.regionalConservationOffset ?? {}) },
    historyTail: Array.isArray(o.historyTail)
      ? o.historyTail.slice(-12).map((h) => ({
          turn: clampNum(Number((h as { turn?: number }).turn ?? turn), 0, 1_000_000),
          inputHash: String((h as { inputHash?: string }).inputHash ?? ''),
          aggregateEcosystemStress: clampNum(Number((h as { aggregateEcosystemStress?: number }).aggregateEcosystemStress ?? 0), 0, 100),
        }))
      : [],
    aiReadCache: o.aiReadCache && typeof o.aiReadCache === 'object' ? { ...o.aiReadCache } : {},
  };
}
