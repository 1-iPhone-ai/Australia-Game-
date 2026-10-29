import { V1014_PUBSVC_LIMITS } from '../core/constants.ts';
import {
  V1014_PUBSVC_SCHEMA_VERSION,
  V1014_PUBSVC_CORE_REGIONS,
} from '../core/types.ts';
import type {
  V1014PubsSvcNationalSnapshot,
  V1014PubsSvcRegionalAggregate,
  V1014PubsSvcRegionId,
  V1014PubsSvcSection6Persisted,
} from '../core/types.ts';
import { V1014_PUBSVC_clamp } from '../core/math.ts';

export const V1014_PUBSVC_SECTION6_KEY = 'save.meta.v1014.public_services_v2' as const;

export function V1014_PUBSVC_createInitialSection6Persisted(): V1014PubsSvcSection6Persisted {
  const regionalAggregates = {} as Record<V1014PubsSvcRegionId, V1014PubsSvcRegionalAggregate>;
  for (const regionId of V1014_PUBSVC_CORE_REGIONS) {
    regionalAggregates[regionId] = V1014_PUBSVC_emptyRegionalAggregate(regionId, 0);
  }
  return {
    schemaVersion: V1014_PUBSVC_SCHEMA_VERSION,
    lastTurn: 0,
    regionalAggregates,
    historyTail: [],
  };
}

export function V1014_PUBSVC_emptyRegionalAggregate(
  regionId: V1014PubsSvcRegionId,
  turn: number,
): V1014PubsSvcRegionalAggregate {
  return {
    regionId,
    turn,
    queuePressureIndex: 40,
    skillMismatchIndex: 32,
    migrationLoopIndex: 38,
    compositeKpi: 45,
    pillars: {
      housing: { waitTurns: 18, backlogBand: 'stable', skillGapBand: 'mild_gap' },
      healthcare: { waitTurns: 22, backlogBand: 'building', skillGapBand: 'moderate_gap' },
      education: { waitTurns: 16, backlogBand: 'stable', skillGapBand: 'mild_gap' },
    },
  };
}

export function V1014_PUBSVC_migrateSection6Persisted(
  raw: Partial<V1014PubsSvcSection6Persisted> | null | undefined,
): V1014PubsSvcSection6Persisted {
  if (!raw || typeof raw !== 'object') return V1014_PUBSVC_createInitialSection6Persisted();
  const base = V1014_PUBSVC_createInitialSection6Persisted();
  base.lastTurn = typeof raw.lastTurn === 'number' ? raw.lastTurn : 0;
  if (raw.regionalAggregates && typeof raw.regionalAggregates === 'object') {
    for (const regionId of V1014_PUBSVC_CORE_REGIONS) {
      const slice = raw.regionalAggregates[regionId];
      if (slice) base.regionalAggregates[regionId] = { ...base.regionalAggregates[regionId], ...slice };
    }
  }
  if (Array.isArray(raw.historyTail)) {
    base.historyTail = raw.historyTail.slice(-V1014_PUBSVC_LIMITS.section6HistoryDepth);
  }
  return base;
}

export function V1014_PUBSVC_rollSection6History(
  persisted: V1014PubsSvcSection6Persisted,
  snapshot: V1014PubsSvcNationalSnapshot,
): V1014PubsSvcSection6Persisted {
  const regionalAggregates = { ...persisted.regionalAggregates };
  for (const regionId of V1014_PUBSVC_CORE_REGIONS) {
    regionalAggregates[regionId] = snapshot.regions[regionId];
  }
  const historyTail = [...persisted.historyTail, V1014_PUBSVC_CORE_REGIONS.map((r) => regionalAggregates[r])];
  while (historyTail.length > V1014_PUBSVC_LIMITS.section6HistoryDepth) historyTail.shift();
  return {
    schemaVersion: V1014_PUBSVC_SCHEMA_VERSION,
    lastTurn: snapshot.turn,
    regionalAggregates,
    historyTail,
  };
}

export function V1014_PUBSVC_section6RegionalAggregateMeans(
  persisted: V1014PubsSvcSection6Persisted,
): { queue: number; skill: number; migration: number; composite: number } {
  const regions = V1014_PUBSVC_CORE_REGIONS.map((r) => persisted.regionalAggregates[r]);
  const mean = (pick: (a: V1014PubsSvcRegionalAggregate) => number) =>
    regions.reduce((s, a) => s + pick(a), 0) / regions.length;
  return {
    queue: V1014_PUBSVC_clamp(mean((a) => a.queuePressureIndex), 0, 100),
    skill: V1014_PUBSVC_clamp(mean((a) => a.skillMismatchIndex), 0, 100),
    migration: V1014_PUBSVC_clamp(mean((a) => a.migrationLoopIndex), 0, 100),
    composite: V1014_PUBSVC_clamp(mean((a) => a.compositeKpi), 0, 100),
  };
}

export function V1014_PUBSVC_encodeSection6Blob(persisted: V1014PubsSvcSection6Persisted): string {
  return JSON.stringify({ key: V1014_PUBSVC_SECTION6_KEY, persisted });
}

export function V1014_PUBSVC_decodeSection6Blob(blob: string): V1014PubsSvcSection6Persisted {
  try {
    const parsed = JSON.parse(blob) as { persisted?: V1014PubsSvcSection6Persisted };
    return V1014_PUBSVC_migrateSection6Persisted(parsed.persisted);
  } catch {
    return V1014_PUBSVC_createInitialSection6Persisted();
  }
}
