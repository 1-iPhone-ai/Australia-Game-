import {
  V1037_PCRS_SCHEMA_VERSION,
  type V1037PcresPersisted,
  type V1037PcresRegionId,
} from '../types/core';

const REGIONS: V1037PcresRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function createEmptyV1037PcresPersisted(): V1037PcresPersisted {
  const regionalCustodyChainMesh: V1037PcresPersisted['regionalCustodyChainMesh'] = {};
  REGIONS.forEach((r, i) => {
    regionalCustodyChainMesh[r] = {
      bufferIndex: 44 + (i % 6),
      rerouteStress: 36 + (i % 8),
      compositeCapacity: 54 + (i % 5),
      exposedSystems: 2 + (i % 4),
    };
  });
  return {
    schemaVersion: V1037_PCRS_SCHEMA_VERSION,
    revision: 0,
    lastProcessedTurn: null,
    custodySnapshots: {},
    custodyChainMeshGraphRevision: 0,
    regionalCustodyChainMesh,
    historyTail: [],
    aiReadCache: {},
  };
}

function clampNum(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

export function sanitizeV1037PcresPersisted(raw: unknown, turn: number): V1037PcresPersisted {
  const base = createEmptyV1037PcresPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<V1037PcresPersisted>;
  const schema =
    o.schemaVersion === V1037_PCRS_SCHEMA_VERSION ? o.schemaVersion : V1037_PCRS_SCHEMA_VERSION;
  return {
    schemaVersion: schema,
    revision: clampNum(Number(o.revision ?? 0), 0, 1_000_000),
    lastProcessedTurn: o.lastProcessedTurn == null ? null : clampNum(Number(o.lastProcessedTurn), 0, 1_000_000),
    custodySnapshots: o.custodySnapshots && typeof o.custodySnapshots === 'object' ? { ...o.custodySnapshots } : {},
    custodyChainMeshGraphRevision: clampNum(Number(o.custodyChainMeshGraphRevision ?? 0), 0, 1_000_000),
    regionalCustodyChainMesh: { ...base.regionalCustodyChainMesh, ...(o.regionalCustodyChainMesh ?? {}) },
    historyTail: Array.isArray(o.historyTail)
      ? o.historyTail.slice(-12).map((h) => ({
          turn: clampNum(Number((h as { turn?: number }).turn ?? turn), 0, 1_000_000),
          inputHash: String((h as { inputHash?: string }).inputHash ?? ''),
          aggregateCustodyChainStressExposure: clampNum(Number((h as { aggregateCustodyChainStressExposure?: number }).aggregateCustodyChainStressExposure ?? 0), 0, 100),
        }))
      : [],
    aiReadCache: o.aiReadCache && typeof o.aiReadCache === 'object' ? { ...o.aiReadCache } : {},
  };
}
