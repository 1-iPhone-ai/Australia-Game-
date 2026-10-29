import {
  V1036_IIRES_SCHEMA_VERSION,
  type V1036IiresPersisted,
  type V1036IiresRegionId,
} from '../types/core';

const REGIONS: V1036IiresRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function createEmptyV1036IiresPersisted(): V1036IiresPersisted {
  const regionalAttestationMesh: V1036IiresPersisted['regionalAttestationMesh'] = {};
  REGIONS.forEach((r, i) => {
    regionalAttestationMesh[r] = {
      bufferIndex: 44 + (i % 6),
      rerouteStress: 36 + (i % 8),
      compositeCapacity: 54 + (i % 5),
      exposedSystems: 2 + (i % 4),
    };
  });
  return {
    schemaVersion: V1036_IIRES_SCHEMA_VERSION,
    revision: 0,
    lastProcessedTurn: null,
    attestationSnapshots: {},
    attestationMeshGraphRevision: 0,
    regionalAttestationMesh,
    historyTail: [],
    aiReadCache: {},
  };
}

function clampNum(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

export function sanitizeV1036IiresPersisted(raw: unknown, turn: number): V1036IiresPersisted {
  const base = createEmptyV1036IiresPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Partial<V1036IiresPersisted>;
  const schema =
    o.schemaVersion === V1036_IIRES_SCHEMA_VERSION ? o.schemaVersion : V1036_IIRES_SCHEMA_VERSION;
  return {
    schemaVersion: schema,
    revision: clampNum(Number(o.revision ?? 0), 0, 1_000_000),
    lastProcessedTurn: o.lastProcessedTurn == null ? null : clampNum(Number(o.lastProcessedTurn), 0, 1_000_000),
    attestationSnapshots: o.attestationSnapshots && typeof o.attestationSnapshots === 'object' ? { ...o.attestationSnapshots } : {},
    attestationMeshGraphRevision: clampNum(Number(o.attestationMeshGraphRevision ?? 0), 0, 1_000_000),
    regionalAttestationMesh: { ...base.regionalAttestationMesh, ...(o.regionalAttestationMesh ?? {}) },
    historyTail: Array.isArray(o.historyTail)
      ? o.historyTail.slice(-12).map((h) => ({
          turn: clampNum(Number((h as { turn?: number }).turn ?? turn), 0, 1_000_000),
          inputHash: String((h as { inputHash?: string }).inputHash ?? ''),
          aggregateAttestationMeshStressExposure: clampNum(Number((h as { aggregateAttestationMeshStressExposure?: number }).aggregateAttestationMeshStressExposure ?? 0), 0, 100),
        }))
      : [],
    aiReadCache: o.aiReadCache && typeof o.aiReadCache === 'object' ? { ...o.aiReadCache } : {},
  };
}
